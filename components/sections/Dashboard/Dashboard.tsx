import Adminbar from "@/components/layout/AdminNav";
import Footer from "@/components/layout/Footer";
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [docNum, setDocNum] = useState(0);
  

//   useEffect(() => {
//     const id = localStorage.getItem("user");
//     axiosBase
//       .get(`/document/${id}`)
//       .then((response) => setDocNum(response?.data?.data?.count));
//   }, []);
  return (
    <>
      <Adminbar/>
      {/* <div className="mb-8">
        <div className="mt-[90px] ml-[17rem] mr-14 border py-11 rounded-[5px]">
          <h4 className="text-[20px] pl-[4em] text-[#1b173f] font-medium">
            DASHBOARD
          </h4>
        </div>

        <div className="mt-4 ml-[17rem] mr-14 border h-[23em] rounded-[5px]">
          <div className="bg-[#F7F7F8] border border-[#638AFF] my-[3em] mx-[15em] h-[16em] rounded-[7px] text-center">
            <div className="my-[4em]">
              <h2 className="text-[28px] mb-6 text-[#1b173f] font-medium">
                Welcome to your Dashboard
              </h2>
              <h3 className="text-[22px] mb-6 text-[#1b173f] font-normal">
                <span className="font-medium">{docNum}</span> documents in Total
              </h3>
            </div>
          </div>
        </div>
      </div> */}

      <Footer />
    </>
  );
};

export default Dashboard;
