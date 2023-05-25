import React from "react";
import { sidebarItems1, sidebarItems2, sidebarItems3 } from "./sidebarItems";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/images/navlogo.png"
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";

const sidebar = () => {
  const token = Cookies.get("token");
  const decodedToken = jwt.decode(token);
  const role = decodedToken?.role;
  const router = useRouter();
  return (
    <>
      <div className="top-0 bottom-0 w-[16rem] h-[100%] grow z-10 fixed bg-white border-r border-[#e7e5e5] ">
        <div>
          <Link href="">
            <Image className="mt-0 ml-[25px]  bg-transparent" src={logo} alt="Old Mutual" width={140} height={70} />
          </Link>
        </div>
        <div className="mb-2">
          <ul className=" min:mt-0 pl-4 block mt-4">
            {sidebarItems1.map((items, index) => {
              // if (items.path === '/users' && role !== 'admin') {
              //   return null;
              // }
              return (
                <li
                  key={index}
                  className=" min:text-xl lg:justify-content-start align-items-center text-[#1b173f] text-sm mb-1"
                >
                  <Link
                    href={items.path}
                    className={router.pathname === items.path ? "text-[#3e8d38] focus:text-[#3e8d38] p-1 flex align-items-center leading-3 font-medium" : "focus:text-[#3e8d38]  p-1 flex align-items-center leading-3 font-normal"}
                  >
                    <label className={router.pathname === items.path ? "text-[#3e8d38] focus:text-[#3e8d38] mr-3 p-1 text-[16px] cursor-pointer" : "focus:text-[#3e8d38] mr-3 p-1 text-[16px] text-[#696b6d] cursor-pointer"}>{items.icon}</label>
                    <label className="p-1 cursor-pointer">{items.title} </label>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mb-2 mt-5">
          <span className="ml-6 text-[#afaeae] text-sm font-medium">QUOTATION</span>
          <ul className=" min:mt-0 pl-4 block mt-4">
            {sidebarItems2.map((items, index) => {
              return (
                <li
                  key={index}
                  className=" min:text-xl lg:justify-content-start align-items-center text-[#1b173f] text-sm mb-1"
                >
                  <Link
                    href={items.path}
                    className={router.pathname === items.path ? "text-[#3e8d38] focus:text-[#3e8d38] p-1 flex align-items-center leading-3 font-medium" : "focus:text-[#3e8d38]  p-1 flex align-items-center leading-3 font-normal"}
                  >
                    <label className={router.pathname === items.path ? "text-[#3e8d38] focus:text-[#3e8d38] mr-3 p-1 text-[16px] cursor-pointer" : "focus:text-[#3e8d38] mr-3 p-1 text-[16px] text-[#696b6d] cursor-pointer"}>{items.icon}</label>
                    <label className="p-1 cursor-pointer">{items.title} </label>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mb-2 mt-5">
          <span className="ml-6 text-[#afaeae] text-sm font-medium">REPORTS</span>
          <ul className=" min:mt-0 pl-4 block mt-4">
            {sidebarItems3.map((items, index) => {
              return (
                <li
                  key={index}
                  className=" min:text-xl lg:justify-content-start align-items-center text-[#1b173f] text-sm mb-1"
                >
                  <Link
                    href={items.path}
                    className={router.pathname === items.path ? "text-[#3e8d38] focus:text-[#3e8d38] p-1 flex align-items-center leading-3 font-medium" : "focus:text-[#3e8d38]  p-1 flex align-items-center leading-3 font-normal"}
                  >
                    <label className={router.pathname === items.path ? "text-[#3e8d38] focus:text-[#3e8d38] mr-3 p-1 text-[16px] cursor-pointer" : "focus:text-[#3e8d38] mr-3 p-1 text-[16px] text-[#696b6d] cursor-pointer"}>{items.icon}</label>
                    <label className="p-1 cursor-pointer">{items.title} </label>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>


      </div>
    </>
  );
};
export default sidebar;