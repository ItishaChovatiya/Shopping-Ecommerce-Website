import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { ClientContext } from "../../App";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { GoDash } from "react-icons/go";
import { useState } from 'react';
import { useEffect } from 'react';
import { postData } from "../../utils/Api";


const ProductListView = (props) => {
  const context = useContext(ClientContext);
  const data = props.data;

  if (!data) {
    return <div className="text-red-500">Product data not available.</div>;
  }
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const displayProductDetailHandler = (id) => {
    context.setOpenProductDetailModel(true);
    context.setGetidtodisplay(id);
  };
  const AddToCartHandler = (product, user_id, quantity) => {
    const productItem = {
      productId: product._id,
      user_id: user_id,
      quantity: quantity,
      price: parseInt(product.pro_price * quantity),
      productName: product.pro_Name,
      image: product.pro_img[0],
      subTotal: product.pro_price,
      countInStoke: product.pro_stoke,
      brand: product.pro_brand,
      size: data?.pro_Size?.length !== 0 ? selectedTabName : "",
      ram: data?.pro_RAM?.length !== 0 ? selectedTabName : "",
      weight: data?.pro_Weight?.length !== 0,
      discount: product.pro_discount,
      oldPrice: product.pro_old_price,
    };

    if (data?.pro_Size?.length !== 0 || data?.pro_RAM?.length !== 0) {
      setIsShowTabs(true);
    } else {
      context.addToCartHandler(productItem, user_id, quantity);
      setIsAdded(true);
      setIsShowTabs(false);
    }

    if (activeTab !== null) {
      context.addToCartHandler(productItem, user_id, quantity);
      setIsAdded(true);
      setIsShowTabs(false);
    }
  };

  useEffect(() => {
    if (!context?.cartData || !Array.isArray(context.cartData)) {
      setIsAdded(false);
      setQuantity(1);
      return;
    }

    const cartItem = context.cartData.find(
      (item) => item.productId === data._id
    );

    if (cartItem) {
      setIsAdded(true);
      setQuantity(cartItem.quantity || 1);
    } else {
      setIsAdded(false);
      setQuantity(1);
    }
  }, [context?.cartData, data._id]);

  const removeQty = () => {
    const newQty = quantity - 1;
    if (quantity === 1) {
      postData("/v1/Cart/deleteCartQty", {
        productId: data._id,
        userId: context.userData._id,
      }).then((res) => {
        if (res.success === true) {
          context.alertBox("success", res.message);
          context.CartDataHandler();
          setIsAdded(false);
          setQuantity(1);
          setIsShowTabs(false);
          setActiveTab(null);
        }
      });
    } else {
      postData("/v1/Cart/decreaseCartQty", {
        productId: data._id,
        userId: context.userData._id,
        qty: newQty,
      })
        .then((res) => {
          if (res.success) {
            setQuantity(newQty);
            context.CartDataHandler();
            context.alertBox("success", res.message);
          } else {
            context.alertBox("error", res.message);
          }
        })
        .catch((err) => {
          context.alertBox("error", err.message);
        });
    }
  };

  const addQty = () => {
    const newQty = quantity + 1;
    postData("/v1/Cart/IncreaseCartQty", {
      productId: data._id,
      userId: context.userData._id,
      qty: newQty,
    }).then((res) => {
      if (res.success) {
        setQuantity(newQty);
        context.CartDataHandler();
        context.alertBox("success", res.message);
      } else {
        context.alertBox("error", res.message);
      }
    });
  };
  return (
    <div className="w-[90%] h-[360px] mx-auto border rounded-md shadow-md p-4 flex flex-col lg:flex-row gap-4 items-start">
      <div className="group w-full h-full lg:w-[40%] relative">
        <div className="w-full h-full">
          <img
            src={data.pro_img?.[0]}
            alt="product"
            className="w-full h-full object-cover transition-all duration-700"
          />
          <img
            src={data.pro_img?.[1]}
            alt="hover"
            className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
        </div>

        <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs rounded hover:bg-white hover:text-black transition">
          {data.pro_discount}%
        </span>

        <div className="absolute top-[-200px] right-3 z-50 flex flex-col gap-2 opacity-0 group-hover:opacity-100 group-hover:top-3 transition-all duration-700">
          <Button className="!bg-white !rounded-full !w-[40px] !h-[40px] !p-0 !text-black hover:!text-white hover:!bg-black">
            <FaRegHeart className="text-[18px]" />
          </Button>
          <Button className="!bg-white !rounded-full !w-[40px] !h-[40px] !p-0 !text-black hover:!text-white hover:!bg-black">
            <IoGitCompareOutline className="text-[18px]" />
          </Button>
          <Button
            onClick={() => displayProductDetailHandler(data._id)}
            className="!bg-white !rounded-full !w-10 !h-10 !p-0 !text-black hover:!text-white hover:!bg-black"
          >
            <MdOutlineZoomOutMap className="text-[18px]" />
          </Button>
        </div>
      </div>

      <div className="w-full lg:w-[60%] flex flex-col justify-between h-full gap-2 relative">
        <div className="flex flex-col gap-2">
          <h6 className="text-sm text-gray-500">
            <Link to="/" className="hover:underline">
              {data.pro_brand}
            </Link>
          </h6>
          <h3 className="text-lg sm:text-xl font-semibold">
            {data.pro_Name.slice(0, 40)}...
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400 line-through">
              {data.pro_old_price}
            </p>
            <p className="text-base font-medium text-black">
              &#8377;{data.pro_price}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            {data.pro_desc.slice(0, 600)}...
          </p>
        </div>

        {Array.isArray(context.cartData) && isAdded ? (
          <div className="flex mb-2 items-center justify-between !w-[40%] overflow-hidden border border-[rgba(0,0,0,0.3)] mt-2">
            <Button
              className="!min-w-[45px] !w-[45px] !h-[35px] !bg-black !rounded-none"
              onClick={removeQty}
            >
              <GoDash className="text-white" />
            </Button>
            <span className="px-4 font-semibold">{quantity}</span>
            <Button
              onClick={addQty}
              className="!min-w-[45px] !w-[45px] !h-[35px] !bg-black !rounded-none"
            >
              <AiOutlinePlus className="text-white" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => AddToCartHandler(data, context?.userData?._id, 1)}
            className="!my-2 !flex !items-center !gap-2 w-[40%] !bg-black !text-white hover:!text-black hover:!bg-white !border-2 !border-solid"
          >
            <IoCartOutline className="text-xl" />
            Add To Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductListView;
