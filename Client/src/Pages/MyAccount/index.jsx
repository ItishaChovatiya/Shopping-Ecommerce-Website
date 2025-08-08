import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import AccountSideBar from "../../Component/AccountSidebar";
import { ClientContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { DeleteData, getData, putData } from "../../utils/Api";
import CircularProgress from "@mui/material/CircularProgress";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Radio from "@mui/material/Radio";
import { MdDelete } from "react-icons/md";

const MyAccount = () => {
  const [data, setData] = useState({
    Name: "",
    email: "",
    mobile: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const validateValu = Object.values(data).every((el) => el);
  const context = useContext(ClientContext);
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
          console.log(error);
        }
      };
      fetch();
    }
  }, [context.userData]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");
    putData(`/v1/user/${context?.userData?._id}?token=${token}`, data, {
      withCreadentials: true,
    })
      .then((res) => {
        setIsLoading(false);
        setData({ Name: "", email: "", mobile: "" });
        context.alertBox("success", "User Address Add successfully");
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
    navigate("/Account/AddAddressData");
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
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
    <div className="w-full min-h-screen">
      <div className="bg-white mx-auto px-4">
       
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            My Profile
          </h2>
          <hr className="mb-6" />

          <form onSubmit={submitHandler}>
            {/* Profile Info */}
            <div className="grid sm:grid-cols-2 gap-5">
              <TextField
                label="Name"
                name="Name"
                value={data.Name}
                onChange={inputHandler}
                disabled={isLoading}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={data.email}
                onChange={inputHandler}
                disabled={isLoading}
                variant="outlined"
                fullWidth
              />
            </div>

            {/* Mobile and Add Address */}
            <div className="grid sm:grid-cols-2 gap-5 mt-5">
              <PhoneInput
                defaultCountry="in"
                name="mobile"
                disabled={isLoading}
                value={data.mobile}
                onChange={(phone) =>
                  setData((prev) => ({ ...prev, mobile: phone }))
                }
                className="w-full"
              />

              <button
                type="button"
                onClick={AddDetailHandler}
                className="bg-blue-100 text-blue-700 font-medium border border-blue-500 border-dashed rounded-md px-6 py-2 hover:bg-blue-200 transition-all w-full"
              >
                + Add Address Detail
              </button>
            </div>

            {/* Address Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {Array.isArray(address) && address.length > 0 ? (
                address.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-dashed border-gray-300 p-4 bg-gray-50 shadow hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <Radio
                          {...label}
                          name="address"
                          checked={selectedValue === item?._id}
                          value={item?._id}
                          onChange={handleChange}
                          size="small"
                        />
                        <div className="text-sm text-gray-700">
                          <p className="font-semibold mb-1">
                            {item?.address_line}, {item?.city}
                          </p>
                          <p>
                            {item?.state}, {item?.country} - {item?.pincode}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Address Type :  
                            <span className="capitalize">
                              {item?.address_Type}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeHandler(item._id)}
                        className="text-red-500 hover:text-red-700 text-xl"
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic col-span-2">
                  No address found.
                </p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap gap-4 mt-8">
              <button
                type="submit"
                className="w-full sm:w-[150px] bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex justify-center items-center gap-2 transition"
                disabled={!validateValu || isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Update Data"
                )}
              </button>
              <button
                type="button"
                onClick={resetHandler}
                className="w-full sm:w-[150px] bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default MyAccount;
