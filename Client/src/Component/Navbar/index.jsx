import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/amazon_PNG4.png";
import Badge from "@mui/material/Badge";
import { MdLockReset } from "react-icons/md";
import SearchBar from "./SearchBar";
import NavigationBar from "./NavigationBar";
import { ClientContext } from "../../App";
import { CgProfile } from "react-icons/cg";
import { Button } from "antd";

const Header = () => {
  const context = useContext(ClientContext);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Account");
  };

  const ResetPassHandler = () => {
    navigate("/ResetPass");
  };

  const myListHandler = () => {
    navigate("/Account/myList");
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="border-y border-b-gray-800">
        <div className="container flex flex-col sm:flex-row items-center justify-between">
          <div className="w-full sm:w-1/2 py-2 text-center sm:text-left">
            <p>Utilities for setting the width of an element.</p>
          </div>
          <div className="w-full sm:w-1/2 flex items-center justify-center sm:justify-end mt-2 sm:mt-0">
            <ul className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Link to="/" className="link">
                Help center
              </Link>
              <Link to="/" className="link">
                Order Tracking
              </Link>
            </ul>
          </div>
        </div>
      </div>

      {/* Logo, search, profile */}
      <div className="border-b border-gray-300">
        <div className="container flex flex-col lg:flex-row items-center justify-between gap-4 py-3">
          <div className="w-full lg:w-1/5 flex justify-center lg:justify-start">
            <Link to={"/"}>
              <img src={logo} className="h-9 w-14" alt="Flowbite Logo" />
            </Link>
          </div>
          <div className="w-full lg:w-2/5">
            <SearchBar />
          </div>
          <div className="w-full lg:w-2/5 flex flex-col items-center lg:flex-row lg:justify-end">
            <ul className="flex flex-row items-center justify-center lg:justify-between w-full px-2 gap-4">
              <div className="w-[70%]">
                {context.isLoading ? (
                  <div className="flex items-center space-x-3 p-4 max-w-sm">
                    <div
                      className="flex items-center gap-2"
                      onClick={handleClick}
                    >
                      <Button className="!flex !justify-center p-2">
                        <CgProfile className="text-4xl" />
                      </Button>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {context?.userData?.Name?.trim() || (
                          <span className="text-gray-400 italic">
                            Name not found
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        {context?.userData?.email?.trim() || (
                          <span className="text-gray-400 italic">
                            Email not found
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <li className="flex items-center gap-1">
                    <Link to="/Login" className="hover:text-green-500">
                      Login
                    </Link>
                    <span>|</span>
                    <Link to="/Register" className="hover:text-green-500">
                      Sign Up
                    </Link>
                  </li>
                )}
              </div>
              <div className="w-[30%] flex gap-10">
                <Badge
                  badgeContent={context?.cartData?.length || 0}
                  color="primary"
                  onClick={context?.setOpenCartPanel}
                >
                  <i className="ri-shopping-cart-2-line text-2xl"></i>
                </Badge>
                <Badge
                  badgeContent={context?.myListData?.length || 0}
                  color="primary"
                  onClick={myListHandler}
                >
                  <i className="ri-heart-line text-2xl"></i>
                </Badge>
                <MdLockReset className="text-3xl" onClick={ResetPassHandler} />
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div className=" bg-white shadow-sm">
        <NavigationBar />
      </div>
    </>
  );
};

export default Header;
