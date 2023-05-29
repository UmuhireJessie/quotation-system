import Adminbar from "@/components/layout/AdminNav";
import Footer from "@/components/layout/Footer";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Chart } from "chart.js";


const Dashboard = () => {

  const [transaction, setTransaction] = useState<Number | String>("--")
  const [quoteAmount, setQuoteAmount] = useState<Number | String>("--")
  const [totalPaidQuotes, setTotalPaidQuotes] = useState<Number | String>("--")
  const [totalAmountQuotesToday, setTotalAmountQuotesToday] = useState<Number | String>("--")
  const [monday, setMonday] = useState(0)
  const [tuesday, setTuesday] = useState(0)
  const [wednesday, setWednesday] = useState(0)
  const [thursday, setThursday] = useState(0)
  const [friday, setFriday] = useState(0)
  const [saturday, setSaturday] = useState(0)
  const [sunday, setSunday] = useState(0)
  const token = Cookies.get("token");

  const getRevenueChart = async () => {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement | null;
    const ctx = canvas?.getContext('2d');

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [{
          data: [sunday, monday, tuesday, wednesday, thursday, friday, saturday],
          label: "Amount in RWF",
          borderColor: "rgb(109, 253, 181)",
          backgroundColor: "rgb(109, 253, 181,0.5)",
          borderWidth: 1
        }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

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

      const convertedData = dataArray.map(obj => ({
        ...obj,
        createdAt: new Date(obj.createdAt)
      }));

      const c = new Date("28/05/2023")
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();
      console.log("data icagaguye", currentDate, "year:", currentYear, "month:", currentMonth, "date:", currentDay, "day:", currentDate.getDay())
      const firstDayOfWeek = new Date(currentYear, currentMonth, currentDay - currentDate.getDay());
      const lastDayOfWeek = new Date(currentYear, currentMonth, currentDay + (6 - currentDate.getDay()));

      const filteredWeekData = convertedData.filter(obj =>
        obj.status === "successful" &&
        obj.createdAt >= firstDayOfWeek &&
        obj.createdAt <= lastDayOfWeek
      );


      let mondayAmount = 0;
      let tuesdayAmount = 0;
      let wednesdayAmount = 0;
      let thursdayAmount = 0;
      let fridayAmount = 0;
      let saturdayAmount = 0;
      let sundayAmount = 0;

      filteredWeekData.forEach(obj => {
        const dayOfWeek = obj.createdAt.getDay();
        const amount = obj.amount;
        switch (dayOfWeek) {
          case 1:
            mondayAmount += amount;
            break;
          case 2:
            tuesdayAmount += amount;
            break;
          case 3:
            wednesdayAmount += amount;
            break;
          case 4:
            thursdayAmount += amount;
            break;
          case 5:
            fridayAmount += amount;
            break;
          case 6:
            saturdayAmount += amount;
            break;
          case 0:
            sundayAmount += amount;
            break;
        }
      });
      console.log("mondayAmount", mondayAmount)

      const successfulArray = dataArray.filter(data => data.status === "successful");
      const totalAmount = successfulArray.reduce((sum, data) => sum + data.amount, 0);
      const currDate = new Date().toISOString().slice(0, 10);
      const paidTodayArray = dataArray.filter(data => data.createdAt === currDate && data.status === "successful");
      const totalAmountPaidToday = paidTodayArray.reduce((sum, data) => sum + data.amount, 0);

      setTransaction(dataArray.length)
      setQuoteAmount(totalAmount.toFixed(2))
      setTotalPaidQuotes(successfulArray.length)
      setTotalAmountQuotesToday(totalAmountPaidToday.toFixed(2))
      setMonday(mondayAmount)
      setTuesday(tuesdayAmount)
      setWednesday(wednesdayAmount)
      setThursday(thursdayAmount)
      setFriday(fridayAmount)
      setSaturday(saturdayAmount)
      setSunday(sundayAmount)

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
    getRevenueChart()
  }, [monday, tuesday, wednesday, thursday, friday, saturday, sunday])

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
            <h4 className="pb-3">Chart showing amount generated from quote paid this</h4>
            <div>
              <canvas id='myChart'></canvas>
            </div>
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
