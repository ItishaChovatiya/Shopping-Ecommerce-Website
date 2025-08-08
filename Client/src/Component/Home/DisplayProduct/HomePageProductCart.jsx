import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { ClientContext } from '../../../App';
import { IoCartOutline } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { GoDash } from "react-icons/go";
import { useState } from 'react';
import { useEffect } from 'react';
import { postData } from '../../../utils/Api';
import { IoClose } from "react-icons/io5";


const Product = (props) => {
    const [quantity, setQuantity] = useState(1)
    const [isAdded, setIsAdded] = useState(false);
    const context = useContext(ClientContext);
    const [activeTab, setActiveTab] = useState(null)
    const [isShowTabs, setIsShowTabs] = useState(false)
    const [selectedTabName, setSelectedTabName] = useState(null)
    const data = props.data;

    const handleClickActiveTab = (index, name) => {
        setActiveTab(index)
        setSelectedTabName(name)
    }

    if (!data) {
        return <div className="text-red-500">Product data not available.</div>;
    }

    const displayProductDetailHandler = (id) => {
        context.setOpenProductDetailModel(true)
        context.setGetidtodisplay(id)
    };

    const PassProductDataHandler = (id) => {
        context.setGetidtodisplay(id)
    }

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
        }

        if (data?.pro_Size?.length !== 0 || data?.pro_RAM?.length !== 0) {
            setIsShowTabs(true)
        } else {
            context.addToCartHandler(productItem, user_id, quantity);
            setIsAdded(true);
            setIsShowTabs(false)
        }

        if (activeTab !== null) {
            context.addToCartHandler(productItem, user_id, quantity);
            setIsAdded(true);
            setIsShowTabs(false)
        }
    }

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
            postData('/v1/Cart/deleteCartQty', {
                productId: data._id,
                userId: context.userData._id
            }).then((res) => {
                if (res.success === true) {
                    context.alertBox("success", res.message);
                    context.CartDataHandler();
                    setIsAdded(false);
                    setQuantity(1);
                    setIsShowTabs(false)
                    setActiveTab(null)
                }
            });
        }
        else {
            postData('/v1/Cart/decreaseCartQty', {
                productId: data._id,
                userId: context.userData._id,
                qty: newQty
            }).then((res) => {
                if (res.success) {
                    setQuantity(newQty);
                    context.CartDataHandler();
                    context.alertBox("success", res.message);
                } else {
                    context.alertBox("error", res.message);
                }
            }).catch((err) => {
                context.alertBox("error", err.message);
            });
        }
    }

    const addQty = () => {
        const newQty = quantity + 1;
        postData('/v1/Cart/IncreaseCartQty', {
            productId: data._id,
            userId: context.userData._id,
            qty: newQty
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

    const handleClose = () => {
        setIsShowTabs(false)
    }

    const mylisthandler = (item) => {
        const alreadyInList = context?.myListData?.some((x) => x.productId === String(item._id));

        if (alreadyInList) {
            context.removeMyListItemHadler(item._id);
        } else {
            context.AddToMyListHandler(item);
        }
    };


    return (
        <div className="productItems border rounded mb-8 shadow-lg transition-all duration-300 bg-white">
            <div className="group w-full h-[200px] sm:h-[250px] mb-3 overflow-hidden relative">
                <Link to={`/productDetail/${data._id}`}>
                    <div className="h-full overflow-hidden" onClick={() => PassProductDataHandler(data._id)}>
                        <img
                            src={data.pro_img?.[0]}
                            alt="product"
                            className="w-full h-full object-cover"
                        />
                        {data.pro_img?.[1] && (
                            <img
                                src={data.pro_img[1]}
                                alt="product-hover"
                                className="w-full h-full object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                            />
                        )}
                    </div>
                </Link>


                {
                    isShowTabs === true && <div className='flex items-center justify-center absolute top-0 left-0  w-full h-full bg-[rgba(0,0,0,0.5)] 
                z-[60] p-3 gap-2'>
                        <Button
                            onClick={handleClose}
                            className="!absolute !top-2 !right-2 !w-8 !h-8 !bg-white !text-black !rounded-full !p-0 flex items-center justify-center"
                            title="Close"
                        >
                            <IoClose className="text-xl" />
                        </Button>

                        {
                            data?.pro_Size?.length !== 0 && data?.pro_Size.map((size, index) => {
                                return (
                                    <span key={index} className={`flex items-center justify-center p-1 bg-[rgba(255,255,255,0.8)]
                                     w-[50px] h-[25px] rounded-sm cursor-pointer hover:bg-white ${activeTab === index && "!bg-[#45dd68]"}`}
                                        onClick={() => handleClickActiveTab(index, size)}>
                                        {size}
                                    </span>
                                )
                            })
                        }
                        {
                            data?.pro_RAM?.length !== 0 && data?.pro_RAM.map((ram, index) => {
                                return (
                                    <span key={index} className={`flex items-center justify-center p-1 bg-[rgba(255,255,255,0.8)]
                                     w-[50px] h-[25px] rounded-sm cursor-pointer hover:bg-white ${activeTab === index && "!bg-[#45dd68]"}`}
                                        onClick={() => handleClickActiveTab(index, ram)}>
                                        {ram}
                                    </span>
                                )
                            })
                        }

                    </div>
                }

                {data.pro_discount && (
                    <span className="absolute flex items-center justify-center text-xs sm:text-sm font-medium rounded hover:text-black hover:bg-white top-3 left-3 text-white w-10 h-6 bg-black">
                        {data.pro_discount}%
                    </span>
                )}

                <div className="absolute top-[-200px] right-3 z-50 flex flex-col gap-2 transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:top-3">
                    <Button
                        onClick={() => mylisthandler(data)}
                        className="!bg-white !rounded-full !w-10 !h-10 !p-0 !text-black"
                    >
                        {
                            context?.myListData?.some((item) => item.productId === String(data._id))
                                ? <FaHeart className="text-[18px] text-red-500" />
                                : <FaRegHeart className="text-[18px]" />
                        }
                    </Button>

                    
                    <Button
                        onClick={() => displayProductDetailHandler(data._id)}
                        className="!bg-white !rounded-full !w-10 !h-10 !p-0 !text-black"
                    >
                        <MdOutlineZoomOutMap className="text-[18px]" />
                    </Button>
                </div>
            </div>

            <div className="px-2 sm:px-3">
                <h6 className="text-xs text-gray-400">
                    <Link to="/" className="hover:text-green-600">{data.pro_brand}</Link>
                </h6>
                <h3 className="text-sm sm:text-base font-medium text-black">
                    {data.pro_Name?.slice(0, 40)}...
                </h3>
                <div className="mt-1">
                    <Rating name="read-only" value={data.pro_rating} readOnly size="small" />
                </div>

                <div className="flex lg:flex-row p-0 flex-col items-start gap-3 mt-1">
                    <p className="text-red-800 line-through ">{data.pro_old_price}</p>
                    <p className="text-base font-[500] text-black">&#8377;{data.pro_price}</p>
                </div>
                {Array.isArray(context.cartData) && isAdded ? (
                    <div className="flex mb-2 items-center justify-between overflow-hidden border border-[rgba(0,0,0,0.3)] mt-2">
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
                        className="!my-2 !flex !items-center !gap-2 w-full !bg-black !text-white hover:!text-black hover:!bg-white !border-2 !border-solid"
                    >
                        <IoCartOutline className="text-xl" />
                        Add To Cart
                    </Button>
                )}

            </div>
        </div>
    );
};

export default Product;