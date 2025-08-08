import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import user_img from "../../assets/User.jpg";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { FaRegUser } from "react-icons/fa6";
import { PiSignOut } from "react-icons/pi";
import { MyContext } from "../../App";
import { AiOutlineMenuFold } from "react-icons/ai";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getData } from "../../utils/Api";
import { RiLockPasswordLine } from "react-icons/ri";

const Header = () => {
  const [anchorMyAcc, setAnchorMyAcc] = useState(null);
  const open = Boolean(anchorMyAcc);

  const handleClick = (event) => {
    setAnchorMyAcc(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorMyAcc(null);
  };
  const LogOutHandler = () => {
    setAnchorMyAcc(null);
    getData(`/v1/user/LogOut?token=${localStorage.getItem("accessToken")}`, {
      withCreadentials: true,
    }).then((res) => {
      context.setIsLoading(false);
      context.setIsUserSign(false);
      localStorage.clear();
    });
  };
  const context = useContext(MyContext);

  return (
    <header className="w-full h-[auto] py-2 pr-7 flex flex-col sm:flex-row items-center justify-between shadow-md">
      <div className="part1 ">
        <Button
          onClick={() => context.setIsSideBarOpen(!context.isSidebarOpen)}
          className={`!text-[rgba(0,0,0,0.8)] !w-[40px] !h-[40px] !min-w-[40px] !rounded-full transition-all 
                           duration-300  ${
                             context.isSidebarOpen === true
                               ? "!ml-[320px]"
                               : "!ml-[10px]"
                           }`}
        >
          {context.isSidebarOpen === true ? (
            <AiOutlineMenuFold className="text-[20px] text-[rgba(0,0,0,0.8)]" />
          ) : (
            <AiOutlineMenuUnfold className="text-[20px] text-[rgba(0,0,0,0.8)]" />
          )}
        </Button>
      </div>
      <div className="part2 flex justify-end items-center gap-4">
        {context.isUserSign === true ? (
          <div className="cursor-pointer">
            <Tooltip title="Account settings">
              <div
                className="w-[30px] h-[30px] rounded-full overflow-hidden"
                onClick={handleClick}
              >
                <img
                  src={user_img}
                  className="w-full h-full object-cover"
                  alt="user image"
                />
              </div>
            </Tooltip>
            <Menu
              anchorEl={anchorMyAcc}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
            >
              <MenuItem className="!bg-white !py-0">
                <div className="flex items-center gap-3">
                  <div className="w-[35px] h-[35px] rounded-full overflow-hidden">
                    <img
                      src={user_img}
                      className="w-full h-full object-cover"
                      alt="user image"
                    />
                  </div>
                  <div>
                    <p className="text-[15px] font-[700] leading-5 capitalize">
                      {context.userData?.Name || "Loading"}
                    </p>
                    <p className="text-[13px]">{context.userData?.email || "Loading"}</p>
                  </div>
                </div>
              </MenuItem>
              <Divider />
              <Link to="/Profile">
                <MenuItem className="flex gap-3 justify-center items-center">
                  <FaRegUser />
                  <p>Profile</p>
                </MenuItem>
              </Link>
              <Link to="/ChangePassword">
                <MenuItem className="flex gap-3 justify-center items-center">
                  <RiLockPasswordLine className="text-[21px]" />
                  <p>Change Password</p>
                </MenuItem>
              </Link>
              <Divider />
              <MenuItem className="!flex gap-3" onClick={LogOutHandler}>
                <PiSignOut className="text-[20px] font-[900]" />Log Out
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div>
            <Link to={"/Register"}>
              <Button className="btn-blue">Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
