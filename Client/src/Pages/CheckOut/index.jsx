import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { ClientContext } from "../../App";
import { useNavigate } from "react-router-dom";
import no_address from "../../assets/no_address.avif";
import { IoBagCheckOutline } from "react-icons/io5";
import { DeleteData, postData } from "../../utils/Api";
import { GiCash } from "react-icons/gi";
import axios from "axios";

const VITE_RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const VITE_RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET;
const VITE_PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const CheckOutpage = () => {
  const context = useContext(ClientContext);
  const token = localStorage.getItem("accessToken");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [totalAmount, setTotalAmount] = useState();
  const navigate = useNavigate();

  const addressRef = useRef(null);
  const totalAmountRef = useRef(0);

  useEffect(() => {
    const TotalAmount = context.cartData?.length
      ? context.cartData
        .map((item) => parseInt(item.subTotal))
        .reduce((sum, value) => sum + value, 0)
      : 0;

    setTotalAmount(TotalAmount);
    totalAmountRef.current = TotalAmount;
    localStorage.setItem("userId", context?.userData?._id);
  }, [context?.cartData, context?.userData]);

  useEffect(() => {
    addressRef.current = selectedAddress;
    totalAmountRef.current = totalAmount;
  }, [selectedAddress, totalAmount]);

  useEffect(() => {
    if (document.getElementById("paypal-sdk")) return;

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${VITE_PAYPAL_CLIENT_ID}&disable-funding=card`;
    script.async = true;

    script.onload = () => {
      window.paypal
        .Buttons({
          createOrder: async () => {
            try {
              const address = addressRef.current;
              if (!address || Object.keys(address).length === 0) {
                context.alertBox(
                  "error",
                  "Please select a valid address before proceeding."
                );
                throw new Error("Address is missing.");
              }
              const resp = await fetch(
                "https://v6.exchangerate-api.com/v6/c704f87a1774f334f17336ab/latest/USD"
              );
              const resData = await resp.json();

              if (resData.result === "success") {
                const inrRate = resData.conversion_rates.INR;
                const amount = totalAmountRef.current;
                const convertedAmount = (amount / inrRate).toFixed(2);

                const headers = {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                };

                const userId = localStorage.getItem("userId");

                const response = await axios.post(
                  `${VITE_API_URL}/v1/Order/CreateOrder_PayPal?userId=${userId}&totalAmount=${convertedAmount}&token=${token}`,
                  {},
                  { headers }
                );

                return response?.data?.id;
              } else {
                console.error("Exchange rate fetch failed:", resData);
              }
            } catch (err) {
              console.error("PayPal createOrder error:", err);
            }
          },

          onApprove: async (data) => {
            try {
              const info = {
                userId: context?.userData?._id,
                products: context?.cartData,
                payment_status: "COMPLETED",
                paymentId: data.orderID,
                delivery_address: addressRef.current,
                totalAmount: totalAmountRef.current,
                date: new Date().toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
              };

              const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              };

              const res = await axios.post(
                `${VITE_API_URL}/v1/Order/CapturePayPalOrder?token=${token}`,
                info,
                { headers }
              );

              if (res.data.success) {
                await DeleteData(`/v1/Cart/EmptyCartPro?token=${token}`);
                context.CartDataHandler();
                context.alertBox("success", res.data.message);
                navigate("/Order/Success");
              } else {
                context.alertBox("error", res.data.message);
                navigate("/Order/Failed");
              }
            } catch (error) {
              console.error("❌ Error in onApprove:", error);
              navigate("/Order/Failed");
              context.alertBox(
                "error",
                "Something went wrong during order processing."
              );
            }
          },

          onError: (error) => {
            console.error("PayPal Error:", error);
          },
        })
        .render("#paypal-button-container");
    };

    document.body.appendChild(script);
  }, [context?.cartData, context?.userData]);

  const EditHandler = (id) => navigate(`/Account/AddAddressData/${id}`);
  const addAddressHandler = () => navigate("/Account/AddAddressData");

  const checkoutHandler = (e) => {
    e.preventDefault();

    const options = {
      key: VITE_RAZORPAY_KEY_ID,
      key_secret: VITE_RAZORPAY_KEY_SECRET,
      amount: parseInt(totalAmount * 100),
      currency: "INR",
      name: "Mahadev",
      description: "Testing Purpose",
      handler: function (response) {
        const paymentId = response.razorpay_payment_id;
        const user = context?.userData;

        const payLoad = {
          userId: user?._id,
          products: context?.cartData,
          paymentId: paymentId,
          payment_status: "COMPLETED",
          delivery_address: selectedAddress,
          totalAmount: totalAmount,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
        };

        postData(`/v1/Order/OrderPlaced?token=${token}`, payLoad).then(
          (res) => {
            if (res.success === true) {
              DeleteData(`/v1/Cart/EmptyCartPro?token=${token}`).then(() => {
                context.CartDataHandler();
                context.alertBox("success", res.message);
                navigate("/Order/Success");
              });
            } else {
              context.alertBox("error", res.message);
            }
          }
        );
      },
      theme: { color: "#45dd68" },
    };

    const pay = new window.Razorpay(options);
    pay.open();
  };

  const CashOnDeliveryHandler = () => {
    const user = context?.userData;
    const payLoad = {
      userId: user?._id,
      products: context?.cartData,
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: selectedAddress,
      totalAmount: totalAmount,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    postData(`/v1/Order/OrderPlaced?token=${token}`, payLoad).then((res) => {
      if (res.success === true) {
        context.alertBox("success", res.message);
        DeleteData(`/v1/Cart/EmptyCartPro?token=${token}`).then(() => {
          context.CartDataHandler();
          navigate("/Order/Success");
        });
      } else {
        context.alertBox("error", res.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form>
        <div className="container mx-auto flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[60%] p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Select Delivery Address</h2>
              <Button
                variant="outlined"
                className="!border !border-blue-700"
                onClick={addAddressHandler}
              >
                + ADD NEW ADDRESS
              </Button>
            </div>

            {context?.address?.length === 0 ? (
              <img
                src={no_address}
                alt="Empty_address"
                className="w-full h-full object-fill border"
              />
            ) : (
              context?.address.map((addr, index) => (
                <div
                  key={index}
                  className={`border rounded-md p-4 mb-4 ${selectedAddress === addr._id
                    ? "bg-purple-50 border-blue-500"
                    : "bg-white"
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <label className="flex items-start gap-3 w-full cursor-pointer">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)}
                        className="mt-1 accent-blue-600"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">
                          {addr.address_line}, {addr.landMark}, {addr.city},{" "}
                          {addr.state}
                        </p>
                        <p className="text-sm text-gray-600">
                          Pincode: {addr.pincode}
                        </p>
                        <p className="text-sm text-gray-600">
                          Country: {addr.country}
                        </p>
                        <p className="text-sm text-gray-600">
                          Address Type: {addr.address_Type}
                        </p>
                      </div>
                    </label>
                    {selectedAddress === addr._id && (
                      <button
                        onClick={() => EditHandler(addr._id)}
                        className="mt-4 bg-blue-700 text-white text-sm py-2 px-4 rounded"
                      >
                        EDIT
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart  */}
          <div className="bg-white rounded shadow-md p-6 w-full lg:w-[40%]">
            <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
            <div className="flex justify-between text-sm font-semibold border-b pb-2 mb-2">
              <span>Product</span>
              <span>Subtotal</span>
            </div>

            {context?.cartData?.length > 0 &&
              context?.cartData.map((data, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-4 border-b pb-2"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={data.image}
                      alt="Product"
                      className="w-[60px] h-[60px] object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-bold">{data.productName}</p>
                      <p className="text-sm">Qty: {data.quantity}</p>
                      <p>Price : {data.price}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{data.subTotal}</p>
                  </div>
                </div>
              ))}

            <div className="w-[260px] mx-auto">
              <Button
                className="!flex !gap-3 !mx-auto !bg-blue-500 !w-full !text-white"
                onClick={checkoutHandler}
              >
                <IoBagCheckOutline />
                CheckOut
              </Button>
              <Button
                className="!flex !gap-3 !mx-auto !bg-black !mt-3 !w-full !text-white"
                onClick={CashOnDeliveryHandler}
              >
                <GiCash /> Cash On Delivery
              </Button>
              <div id="paypal-button-container" className="mt-4"></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckOutpage;
