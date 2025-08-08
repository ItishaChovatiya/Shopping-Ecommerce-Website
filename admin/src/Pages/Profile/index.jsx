import React, { useContext, useEffect, useState } from "react";
import img from "../../assets/profile_user.jpg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { DeleteData, getData, putData } from "../../utils/Api";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Radio from "@mui/material/Radio";
import { MdDelete } from "react-icons/md";

const Profile = () => {
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const context = useContext(MyContext);
  const [data, setData] = useState({
    Name: "",
    email: "",
    mobile: "",
  });
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

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
  useEffect(() => {
    const fetchImage = async () => {
      const userAvatar = [];
      if (
        context?.userData?.avatar !== null &&
        context?.userData?.avatar !== undefined &&
        context?.userData?.avatar.length > 0
      ) {
        userAvatar.push(context?.userData?.avatar);
        setPreview(userAvatar);
      }
    };
    fetchImage();
  }, [context?.userData]);

  const [isLoading, setIsLoading] = useState(false);
  const validateValu = Object.values(data).every((el) => el);
  const navigate = useNavigate();
  const [address, setAddress] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
    }

    if (context?.userData) {
      setData({
        Name: context.userData.Name || "",
        email: context.userData.email || "",
        mobile: String(context.userData.mobile || ""),
      });
    }

    if (context?.userData?._id) {
      const fetch = async () => {
        try {
          const res = await getData(
            `/v1/address/GetAddressDetail/${context.userData._id}?token=${token}`,
            { withCredentials: true }
          );
          setAddress(res.data);
          context?.setAddress(res.data);
        } catch (error) {
          alert(error);
        }
      };

      fetch();
    }
  }, [context.userData]);

  const submitHandler = (e) => {
    e.preventDefault();

    setIsLoading(true);

    const token = localStorage.getItem("accessToken");
    putData(`/v1/user/${context?.userData?._id}?token=${token}`, data, {
      withCreadentials: true,
    })
      .then((res) => {
        setIsLoading(false);
        context.alertBox("success", "User Updated successfully...");
      })
      .catch(() => {
        setIsLoading(false);
        context.alertBox("error", "Something went wrong");
      });
  };

  const resetHandler = () => {
    setData({ Name: "", email: "", mobile: "" });
  };

  const AddDetailHandler = () => {
    navigate("/AddAddressData");
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [selectedValue, setSelectedValue] = useState("");

  const handleCheckBox = (event) => {
    const selectedId = event.target.value;
    setSelectedValue(selectedId);
  };

  const removeHandler = async (id) => {
    try {
      const userId = context?.userData?._id;

      const res = await DeleteData(`/v1/address/${id}`, { user_ID: userId });

      if (res.success) {
        setAddress(res.address);
        context.alertBox("success", res.message);
      } else {
        context.alertBox("error", res.message || "Delete failed");
      }
    } catch (error) {
      console.log(error);
      context.alertBox("error", "Something went wrong");
    }
  };

  return (
    <div>
      <div className="my-4 pt-5   bg-white px-5 pb-5">
        <h2 className="text-[25px] font-[600]">User Profile</h2>
        <div className="w-[200px] h-[120px] my-3 relative overflow-hidden flex items-center justify-center bg-gray-200">
          {uploading ? (
            <CircularProgress />
          ) : (
            <>
              {preview?.length === 0 ? (
                <>
                  <img
                    src={img}
                    alt="Avatar"
                    className="w-full h-full"
                  />
                </>
              ) : (
                <>
                  {preview?.map((img, index) => {
                    return (
                      <img
                        src={img}
                        key={index}
                        alt="img"
                        className="w-full h-full object-cover"
                      ></img>
                    );
                  })}
                </>
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

        <form onSubmit={submitHandler}>
          <div className="flex flex-col sm:flex-row gap-4 mt-5">
            <div className="lg:w-[40%] sm:w-full">
              <TextField
                label="Name"
                name="Name"
                value={data.Name}
                onChange={inputHandler}
                disabled={isLoading === true ? true : false}
                variant="outlined"
                className="w-full"
              />
            </div>
            <div className="lg:w-[40%] sm:w-full ">
              <TextField
                label="Email"
                name="email"
                disabled={isLoading === true ? true : false}
                value={data.email}
                onChange={inputHandler}
                variant="outlined"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-5">
            <div className="lg:w-[40%] sm:w-full">
              <PhoneInput
                defaultCountry="in"
                value={data.mobile}
                onChange={(phone) =>
                  setData((prev) => ({ ...prev, mobile: phone }))
                }
                name="mobile"
                disabled={isLoading}
              />
            </div>
            <div
              className="lg:w-[40%] sm:w-full mt-2"
              onClick={AddDetailHandler}
            >
              <span className="border py-[6px] px-[196px] rounded border-dashed border-gray-500">
                Add Address detail
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-5">
            {Array.isArray(address) && address.length > 0
              ? address.map((item, index) => (
                  <div
                    key={index}
                    className="lg:w-[40%] sm:w-full flex gap-3 border border-dashed border-gray-300"
                  >
                    <Radio
                      {...label}
                      name="address"
                      checked={selectedValue == item?._id}
                      value={item?._id}
                      onChange={handleCheckBox}
                    />
                    <span className="px-2 py-2">
                      {item?.address_line +
                        ", " +
                        item?.city +
                        ", " +
                        item?.state +
                        ", " +
                        item?.country +
                        ", " +
                        item?.pincode}
                    </span>
                    <span
                      className="my-auto mx-2 text-[20px]"
                      onClick={() => removeHandler(item._id)}
                    >
                      <MdDelete />
                    </span>
                  </div>
                ))
              : ""}
          </div>

          <div className="flex flex-row mt-5 gap-4">
            <button
              type="submit"
              className="w-[10%] bg-blue-500 text-white py-2 button-loader flex justify-center items-center gap-3"
              disabled={!validateValu || isLoading}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Update data"
              )}
            </button>
            <button
              className="w-[10%] bg-blue-500 text-white py-2 button-loader flex justify-center items-center gap-3"
              type="button"
              onClick={resetHandler}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
