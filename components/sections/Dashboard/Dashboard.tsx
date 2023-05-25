import Adminbar from "@/components/layout/AdminNav";
import Footer from "@/components/layout/Footer";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Dashboard = () => {

  const [transaction, setTransaction] = useState<Number | String>("--")
  const [quoteAmount, setQuoteAmount] = useState<Number | String>("--")
  const [totalPaidQuotes, setTotalPaidQuotes] = useState<Number | String>("--")
  const [totalAmountQuotesToday, setTotalAmountQuotesToday] = useState<Number | String>("--")
  const token = Cookies.get("token");


    const getAllPayment = async () => {
      try {
          const dt = await fetch("http://212.71.245.100:5000/payment/", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
          });

          const response = await dt.json();
          const dataArray = response.data
          
          const successfulArray = dataArray.filter(data => data.status === "successful");
          const totalAmount = successfulArray.reduce((sum, data) => sum + data.amount, 0);
          const currentDate = new Date().toISOString().slice(0, 10);
          const paidTodayArray = dataArray.filter(data => data.createdAt === currentDate && data.status === "successful");
          const totalAmountPaidToday = paidTodayArray.reduce((sum, data) => sum + data.amount, 0);

          setTransaction(dataArray.length)
          setQuoteAmount(totalAmount.toFixed(2))
          setTotalPaidQuotes(successfulArray.length)
          setTotalAmountQuotesToday(totalAmountPaidToday.toFixed(2))

          console.log("response", response)
          return response;
      } catch (error: any) {
          console.error(error);
          toast.error(error.message, {
              className: 'font-[sans-serif] text-sm'
          })
      }
  }

  useEffect(() => {
    getAllPayment()
  }, [])

  return (
    <>
      <Adminbar />
      <div className="mt-[5rem] ml-[17rem] mr-5 mb-4 p-6">
        <div className="flex justify-center mb-9">
          <div className="bg-purple-600 text-white w-[30%] rounded-lg p-6 mr-9">
            <div className="flex flex-col">
              <div className="flex flex-row text-white font-semibold justify-end items-end">
                <span className="text-2xl pr-2">{String(transaction)}</span>
              </div>
              <div className="mt-4">
                <p className="text-[16px] font-medium">Transactions</p>
                <p className="text-gray-300 text-sm">Total payments made</p>
              </div>
            </div>
          </div>
          <div className="bg-[#009677] text-white w-[30%] rounded-lg p-6 mr-9">
            <div className="flex flex-col">
              <div className="flex flex-row text-white font-semibold justify-end items-end">
                <span className="text-2xl pr-2">{String(quoteAmount)}</span>
                <span className="text-sm">RWF</span>
              </div>
              <div className="mt-4">
                <p className="text-[16px] font-medium">Amount</p>
                <p className="text-gray-300 text-sm">Total amount of paid quotes</p>
              </div>
            </div>
          </div>
          <div className="bg-[#60b848] text-white w-[30%] rounded-lg p-6">
            <div className="flex flex-col">
              <div className="flex flex-row text-white font-semibold justify-end items-end">
                <span className="text-2xl pr-2">{String(totalPaidQuotes)}</span>
              </div>
              <div className="mt-4">
                <p className="text-[16px] font-medium">Quotes</p>
                <p className="text-gray-300 text-sm">Total paid quotes</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-white w-[64%] rounded-lg p-6 mr-9 border shadow-md text-sm">
            Chart showing days vs amount from quote paid
          </div>
          <div className="bg-white w-[30%] rounded-lg p-6 border shadow-md">
            <div className="flex flex-col">
              <div className="mb-[6rem]">
                <p className="text-[16px] font-medium">Balance</p>
                <p className="text-gray-800 text-sm">Totals amount of quotes received today</p>
              </div>
              <div className="flex flex-row font-semibold justify-end items-end">
                <span className="text-2xl pr-2 mb-[3rem]">{String(totalAmountQuotesToday)}</span>
                <span className="text-sm pr-2 mb-[3rem]">RWF</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
