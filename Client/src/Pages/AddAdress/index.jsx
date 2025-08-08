import React, { useContext, useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useParams } from "react-router-dom";
import { ClientContext } from "../../App";
import { getData, postData, putData } from "../../utils/Api";

const AddAddress = () => {
  const { id } = useParams();
  const context = useContext(ClientContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [Data, setData] = useState({
    address_line: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [type, setType] = useState("Home");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const validateValu = Object.values(Data).every((el) => el);

  const addressData = {
    ...Data,
    address_Type: type,
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const isUpdating = Boolean(id); // true if updating
    const url = isUpdating
      ? `/v1/address/updateAddress/${id}?token=${token}`
      : `/v1/address/AddAddressData/${context?.userData?._id}?token=${token}`;

    const dataMethod = isUpdating ? putData : postData;

    dataMethod(url, addressData, {
      withCredentials: true,
    })
      .then((res) => {
        context.alertBox("success", res?.message);
        setIsLoading(false);
        setData({
          address_line: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
        });

        // ✅ Conditional navigation
        if (isUpdating) {
          navigate("/checkout");
        } else {
          navigate("/Account/myAccount");
        }

        // Refresh address list
        getData(
          `/v1/address/GetAddressDetail/${context?.userData?._id}?token=${token}`,
          { withCredentials: true }
        ).then((res) => {
          context?.setAddress(res.data);
        });
      })
      .catch(() => {
        setIsLoading(false);
        context.alertBox("error", "Something went wrong");
      });
  };

  const resetHandler = () => {
    setData({
      address_line: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });
    setType("Home");
  };

  const cancelHandler = () => {
    navigate("/myAccount");
  };

  useEffect(() => {
    const getsingleDataHandler = async () => {
      if (id) {
        await getData(`/v1/address/singleAddress/${id}?token=${token}`, {
          withCredentials: true,
        }).then((res) => {
          setData({
            address_line: res.data.address_line,
            city: res.data.city,
            state: res.data.state,
            country: res.data.country,
            pincode: res.data.pincode,
          });
          setType(res.data.address_Type || "Home");
        });
      }
    };
    getsingleDataHandler();
  }, [id, token]);

  return (
    <div className="px-[40px] mt-[50px] mb-[300px]">
      <h2 className="text-[28px] pb-3">
        {id ? "Update Your Address Details :-" : "Add Your Address Details :-"}
      </h2>
      <form onSubmit={submitHandler} method="post">
        <div className="grid grid-cols-2 mb-3 gap-5">
          <div>
            <h3 className="text-[18px] font-[500] mb-1 mt-3">Address_line</h3>
            <input
              type="text"
              name="address_line"
              value={Data.address_line}
              onChange={handleInputChange}
              className="w-full h-[40px] border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter address line"
            />
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1 mt-3">City</h3>
            <input
              type="text"
              name="city"
              value={Data.city}
              onChange={handleInputChange}
              className="w-full h-[40px] border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter city"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 mb-3 gap-5">
          <div>
            <h3 className="text-[18px] font-[500] mb-1 mt-3">State</h3>
            <input
              type="text"
              name="state"
              value={Data.state}
              onChange={handleInputChange}
              className="w-full h-[40px] border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter state"
            />
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1 mt-3">Country</h3>
            <input
              type="text"
              name="country"
              value={Data.country}
              onChange={handleInputChange}
              className="w-full h-[40px] border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter country"
            />
          </div>
          <div>
            <h3 className="text-[18px] font-[500] mb-1 mt-3">Pincode</h3>
            <input
              type="text"
              name="pincode"
              value={Data.pincode}
              onChange={handleInputChange}
              className="w-full h-[40px] border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter pincode"
            />
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-[18px] font-[500] mb-1 mt-3">Address Type :-</h2>
          <Select
            value={type}
            onChange={handleChange}
            displayEmpty
            size="small"
            className="w-[30%]"
          >
            <MenuItem value="Home">Home</MenuItem>
            <MenuItem value="Office">Office</MenuItem>
          </Select>
        </div>

        <div className="flex flex-row mt-5 gap-4">
          <button
            type="submit"
            className="w-[10%] bg-blue-500 text-white py-2 button-loader flex justify-center items-center gap-3"
            disabled={!validateValu || isLoading}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : id ? (
              "Update Address"
            ) : (
              "Add Address"
            )}
          </button>
          <button
            className="w-[10%] bg-blue-500 text-white py-2"
            type="button"
            onClick={resetHandler}
          >
            Reset
          </button>
          <button
            className="w-[10%] bg-blue-500 text-white py-2"
            type="button"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddress;
