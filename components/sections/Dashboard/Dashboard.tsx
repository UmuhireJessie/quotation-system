import Adminbar from "@/components/layout/AdminNav";
import Footer from "@/components/layout/Footer";

const Dashboard = () => {

  return (
    <>
      <Adminbar />
      <div className="mt-[5rem] ml-[17rem] mr-5 mb-4 p-6">
        <div className="flex justify-center mb-9">
          <div className="bg-purple-600 text-white w-[30%] rounded-lg p-6 mr-9">
            <div className="flex flex-col">
              <div className="flex flex-row text-white font-semibold justify-end items-end">
                <span className="text-2xl pr-2">200</span>
              </div>
              <div className="mt-4">
                <p className="text-[16px] font-medium">Transactions</p>
                <p className="text-gray-300 text-sm">Total transactions made</p>
              </div>
            </div>
          </div>
          <div className="bg-[#009677] text-white w-[30%] rounded-lg p-6 mr-9">
            <div className="flex flex-col">
              <div className="flex flex-row text-white font-semibold justify-end items-end">
                <span className="text-2xl pr-2">10,000</span>
                <span className="text-sm">RWF</span>
              </div>
              <div className="mt-4">
                <p className="text-[16px] font-medium">Amount</p>
                <p className="text-gray-300 text-sm">Total amount of payed quotes</p>
              </div>
            </div>
          </div>
          <div className="bg-[#60b848] text-white w-[30%] rounded-lg p-6">
            <div className="flex flex-col">
              <div className="flex flex-row text-white font-semibold justify-end items-end">
                <span className="text-2xl pr-2">982</span>
              </div>
              <div className="mt-4">
                <p className="text-[16px] font-medium">Quotes</p>
                <p className="text-gray-300 text-sm">Total payed quotes</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-white w-[64%] rounded-lg p-6 mr-9 border shadow-md">
            Chart
          </div>
          <div className="bg-white w-[30%] rounded-lg p-6 border shadow-md">
            <div className="flex flex-col">
              <div className="mb-[6rem]">
                <p className="text-[16px] font-medium">Balance</p>
                <p className="text-gray-800 text-sm">Totals amount of quotes received today</p>
              </div>
              <div className="flex flex-row font-semibold justify-end items-end">
                <span className="text-2xl pr-2 mb-[3rem]">982</span>
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
