import React, { useContext, useEffect, useState } from "react";
import img from "../../assets/profile-pic.jpg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoBagCheck } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { Button } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { ClientContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { getData, putData } from "../../utils/Api";

const AccountSideBar = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const context = useContext(ClientContext);

  useEffect(() => {
    const avatar = context?.userData?.avatar;
    if (avatar) {
      const urls = Array.isArray(avatar) ? avatar : [avatar];
      setPreview(urls.flat(Infinity).map(String));
    }
  }, [context?.userData]);

  const onChangeFile = async (event) => {
    try {
      setPreview([]);
      setUploading(true);

      const files = event.target.files;
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          file &&
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          )
        ) {
          formData.append("avatar", file);
        } else {
          context.alertBox(
            "error",
            "Please select only JPG, PNG, or WEBP images"
          );
          setUploading(false);
          return;
        }
      }

      const token = localStorage.getItem("accessToken");
      const res = await putData(
        `/v1/user/uploadAVTR?token=${token}`,
        formData,
        { withCreadentials: true }
      );
      setUploading(false);
      let images = res.avatar;
      setPreview(images);
    } catch (error) {
      context.alertBox("error", "Something went wrong during upload");
    }
  };

  const logOutHandler = () => {
    getData(`/v1/user/LogOut?token=${localStorage.getItem("accessToken")}`, {
      withCreadentials: true,
    })
      .then((res) => {
        context.setIsLoading(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        context.setCatData([]);
        context.alertBox("success", res.message);
        navigate("/");
      })
      .catch((error) => {
        context.alertBox("error", error.message);
      });
  };

  return (
    <div className=" bg-white shadow-md rounded-md flex items-center justify-center flex-col sticky top-[10px]">
      <div className="w-[100px] h-[100px] my-3 relative rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
        {uploading ? (
          <CircularProgress />
        ) : (
          <>
            {preview?.length === 0 ? (
              <img
                src={img}
                alt="dumyAvatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={preview[0] || img}
                alt="MainAvatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            )}
          </>
        )}

        <div
          className="overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.7)] flex items-center
             justify-center opacity-0 transition-all hover:opacity-100"
        >
          <FaCloudUploadAlt className="text-[#fff] text-[25px] cursor-pointer" />
          <input
            type="file"
            onChange={onChangeFile}
            accept="image/*"
            name="avatar"
            className="absolute top-0 left-0 opacity-0  w-full h-full"
          />
        </div>
      </div>
      <h3 className="text-[25px] font-[500]">{context?.userData?.Name}</h3>
      <p className="text-[10px] font-[500]">{context?.userData?.email}</p>
      <ul className="list-none w-full mt-8 pb-5 myAccountTabs">
        <li>
          <NavLink
            to="/Account/myAccount"
            className={({ isActive }) => (isActive ? "isActive" : "")}
          >
            <Button className="!w-full !text-[15px] !text-left !justify-start !px-5 !capitalize !rounded-none flex items-center gap-2 !text-[rgba(0,0,0,0.8)]">
              <FaRegUser className="text-[15px]" />
              User Profile
            </Button>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/Account/myList"
            className={({ isActive }) => (isActive ? "isActive" : "")}
          >
            <Button className="!w-full !text-[15px] !text-left !justify-start !px-5 !capitalize !rounded-none flex items-center gap-2 !text-[rgba(0,0,0,0.8)]">
              <IoMdHeartEmpty className="text-[17px]" />
              My List
            </Button>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Account/myOrder"
            className={({ isActive }) => (isActive ? "isActive" : "")}
          >
            <Button className="!w-full !text-[15px] !text-left !justify-start !px-5 !capitalize !rounded-none flex items-center gap-2 !text-[rgba(0,0,0,0.8)]">
              <IoBagCheck className="text-[17px]" />
              My Order
            </Button>
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? "isActive" : "")}
            onClick={logOutHandler}
          >
            <Button className="!w-full !text-[15px] !text-left !justify-start !px-5 !capitalize !rounded-none flex items-center gap-2 !text-[rgba(0,0,0,0.8)]">
              <IoIosLogOut className="text-[17px]" />
              Logout
            </Button>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AccountSideBar;
