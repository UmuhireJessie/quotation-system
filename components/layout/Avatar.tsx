import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import Avatar from "../assets/images/userAvatar.png";
import Image from "next/image";

const AvatarWithDropdown = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");

    // decode the JWT token
    const decodedToken = jwt.decode(token);
    console.log("decodedToken", decodedToken)
    const capitalizedRole = decodedToken?.role.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    setRole(capitalizedRole);
  }, [role]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/");

    console.log("Logging out...");
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* <div className="m-2 text-[#686969] text-base">{role}</div> */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-center w-8 h-8 rounded-[5px] border-[.5px] bg-[#e6e6e6] text-white font-semibold focus:outline-none"
      >
        <Image src={Avatar} alt="User Avatar" />
        {/* {username.charAt(0).toUpperCase()} */}
      </button>
      {showDropdown && (
        <div className="absolute top-10 right-0 w-48 py-2 bg-white rounded-lg shadow-xl">
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarWithDropdown;