import React from "react";
import logo from "../assets/logo.png";
import icons from "../ultils/icons";
import { Link } from "react-router-dom";
import path from "../ultils/path";
const Header = () => {
  const { FaPhone, MdEmail, FaUserCircle, FaCartShopping } = icons;
  return (
    <div className="border flex justify-between w-main h-[110px] py-[35px]">
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt="logo" className="w-[234px] object-contain" />
      </Link>

      <div className="flex text-[13px]">
        <div className="flex flex-col items-center px-5 border-r">
          <span className="flex gap-4 items-center">
            <FaPhone color="red" />
            <span className="font-medium">(+84) 123456789 </span>
          </span>
          <span>Mon-Sat 9:00AM - 8:00PM</span>
        </div>

        <div className="flex flex-col items-center px-5 border-r">
          <span className="flex gap-4 items-center">
            <MdEmail color="red" />
            <span className="font-medium">support1249@gmail.com</span>
          </span>
          <span>Online Support 24/7</span>
        </div>

        <div className="flex items-center justify-center gap-2 px-5 border-r">
          <FaCartShopping color="red" size={25} />
          <span>0 item(s)</span>
        </div>

        <div className="flex items-center justify-center px-5">
          <FaUserCircle color="red" size={25} />
        </div>
      </div>
    </div>
  );
};
export default Header;
