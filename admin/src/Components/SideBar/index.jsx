import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "@mui/material/Button";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineLogout } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { RiProductHuntFill } from "react-icons/ri";
import { FaPhotoFilm } from "react-icons/fa6";
import { BiCategory } from "react-icons/bi";
import { IoBagCheck } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { Collapse } from "react-collapse";
import { MyContext } from "../../App";

const SideBar = () => {
  const [subMenu, setSubMenu] = useState(null);

  const isOpenSubMenu = (index) => {
    if (subMenu == index) {
      setSubMenu(null);
    } else {
      setSubMenu(index);
    }
  };

  const context = useContext(MyContext);
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-100 border-r transition-all 
            ${context.isSidebarOpen ? "w-[18%]" : "hidden"}`}
    >
      <div className="w-full flex justify-center">
        <Link>
          <img src={logo} className="w-[120px] h-[80px]" alt="logo" />
        </Link>
      </div>
      <div>
        <ul>
          <Link to="/">
            <Button className="w-full flex !capitalize !justify-start !text-black !pl-5 gap-3 items-center !py-1 hover:!bg-[rgba(#f1f1f1)] !text-[16px] !font-[500]">
              <RxDashboard className="text-[20px]" />
              <span>Dashboard</span>
            </Button>
          </Link>
          <div>
            <Button
              onClick={() => isOpenSubMenu(1)}
              className="w-full flex !capitalize !justify-start !text-black !pl-5 gap-3 items-center !py-1 hover:!bg-[rgba(#f1f1f1)] !text-[16px] !font-[500]"
            >
              <FaPhotoFilm className="text-[20px]" />
              <span>Home Slides</span>
              <span className="ml-auto flex items-center justify-center w-[30px] h-[30px]">
                <FaAngleDown
                  className={`transition-all ${
                    subMenu === 1 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={subMenu === 1 ? true : false}>
              <ul className="w-full">
                <Link to="/HomeBanner/List" className="w-full">
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    home Banner list
                  </Button>
                </Link>
                <Link className="w-full" to={"/AddHomeBanner"}>
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Add home banner list
                  </Button>
                </Link>
              </ul>
            </Collapse>
          </div>
          <Link to="/User">
            <Button className="w-full flex !capitalize !justify-start !text-black !pl-5 gap-3 items-center !py-1 hover:!bg-[rgba(#f1f1f1)] !text-[16px] !font-[500]">
              <LuUsers className="text-[20px]" />
              <span>User</span>
            </Button>
          </Link>
          <div>
            <Button
              onClick={() => isOpenSubMenu(3)}
              className="w-full flex !capitalize !justify-start !text-black !pl-5 gap-3 items-center !py-1 hover:!bg-[rgba(#f1f1f1)] !text-[16px] !font-[500]"
            >
              <RiProductHuntFill className="text-[20px]" />
              <span>Products</span>
              <span className="ml-auto flex items-center justify-center w-[30px] h-[30px]">
                <FaAngleDown
                  className={`transition-all ${
                    subMenu === 3 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={subMenu === 3 ? true : false}>
              <ul className="w-full">
                <Link to="/Product/List" className="w-full">
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Product List
                  </Button>
                </Link>
                <Link className="w-full" to={"/AddProduct"}>
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Add Product
                  </Button>
                </Link>
                <Link to="/Product/AddProductRAM" className="w-full">
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Add Products RAM
                  </Button>
                </Link>
                <Link to="/Product/AddProductWeight" className="w-full">
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Add Products Weight
                  </Button>
                </Link>
                <Link to="/Product/AddProductSize" className="w-full">
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Add Products Size
                  </Button>
                </Link>
              </ul>
            </Collapse>
          </div>
          <div>
            <Button
              onClick={() => isOpenSubMenu(4)}
              className="w-full flex !capitalize !justify-start !text-black !pl-5 gap-3 items-center !py-1 hover:!bg-[rgba(#f1f1f1)] !text-[16px] !font-[500]"
            >
              <BiCategory className="text-[20px]" />
              <span>Categoery</span>
              <span className="ml-auto flex items-center justify-center w-[30px] h-[30px]">
                <FaAngleDown
                  className={`transition-all ${
                    subMenu === 4 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={subMenu === 4 ? true : false}>
              <ul className="w-full">
                <Link to="/Categoery/List" className="w-full">
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Categoery List
                  </Button>
                </Link>
                <Link className="w-full" to={"/AddCategoery"}>
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Add Categoery
                  </Button>
                </Link>
                <Link to="/SubCategoery/List" className="w-full">
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Sub Categoery List
                  </Button>
                </Link>
                <Link className="w-full" to={"/AddSubCategoery"}>
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Add Sub Categoery
                  </Button>
                </Link>
              </ul>
            </Collapse>
          </div>
          <div>
            <Button
              onClick={() => isOpenSubMenu(5)}
              className="w-full flex !capitalize !justify-start !text-black !pl-5 gap-3 items-center !py-1 hover:!bg-[rgba(#f1f1f1)] !text-[16px] !font-[500]"
            >
              <BiCategory className="text-[20px]" />
              <span>Blog</span>
              <span className="ml-auto flex items-center justify-center w-[30px] h-[30px]">
                <FaAngleDown
                  className={`transition-all ${
                    subMenu === 4 ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Button>

            <Collapse isOpened={subMenu === 5 ? true : false}>
              <ul className="w-full">
                <Link className="w-full" to="/Blog/List">
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Blog List
                  </Button>
                </Link>
                <Link className="w-full" to={"/AddBlog"}>
                  <Button className="!w-full !py-2 !pl-9 !text-[rgba(0,0,0,0.8)] !capitalize flex gap-3 !justify-start">
                    <span className="w-[5px] h-[5px] rounded-full bg-[rgba(0,0,0,0.5)]"></span>
                    Add Blog
                  </Button>
                </Link>
              </ul>
            </Collapse>
          </div>
          <Link to="/Order">
            <Button className="w-full flex !capitalize !justify-start !text-black !pl-5 gap-3 items-center !py-1 hover:!bg-[rgba(#f1f1f1)] !text-[16px] !font-[500]">
              <IoBagCheck className="text-[20px]" />
              <span>Order</span>
            </Button>
          </Link>
          <Link to="/">
            <Button className="w-full flex !capitalize !justify-start !text-black !pl-5 gap-3 items-center!py-1 hover:!bg-[rgba(#f1f1f1)]5 !text-[16px] !font-[500]">
              <MdOutlineLogout className="text-[20px]" />
              <span>Logout</span>
            </Button>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
