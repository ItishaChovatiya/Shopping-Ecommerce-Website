import React from 'react'
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { IoClose } from "react-icons/io5";
import { useContext } from 'react';
import { ClientContext } from '../../App';
import { postData } from '../../utils/Api';
import empty_cart from "../../assets/cart-empty.avif"

const CartPanelCom = () => {
    const context = useContext(ClientContext)
    const handleRemove = (id) => {
        postData('/v1/Cart/deleteCartQty', {
            productId: id,
            userId: context.userData._id
        }).then((res) => {
            if (res.success === true) {
                context.alertBox("success", "Product removed from cart");
                context.CartDataHandler();
            }
        });
    }
    return (
        <div className='relative h-full'>
            <div className="w-full h-[30vh] sm:h-[60vh] md:h-[70vh] mt-3 overflow-y-auto px-2 scroll_panel">
                {context?.cartData == null || context.cartData.length === 0 ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <img src={empty_cart} alt="Empty Cart" className="w-auto h-auto" />
                    </div>
                ) : (
                    context.cartData.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 bg-white/60 hover:bg-white/80 border border-gray-200 rounded-xl p-3 mb-3 shadow-sm transition-all duration-200"
                        >
                            <img
                                src={item.image}
                                alt="Product"
                                className="w-20 h-20 object-contain rounded-lg border"
                            />

                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                                    {item.productName.length > 40
                                        ? item.productName.slice(0, 40) + "..."
                                        : item.productName}
                                </h3>
                                <div className="mt-1 text-xs sm:text-sm text-gray-600">
                                    <span className="font-medium">Price:</span> ₹{item.price}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600">
                                    <span className="font-medium">Quantity:</span> {item.quantity}
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={() => handleRemove(item.productId)}
                                    className="text-gray-500 hover:text-red-600 transition-all text-xl"
                                    title="Remove from cart"
                                >
                                    <IoClose />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ✅ Cart Summary placed outside the map */}
            {context?.cartData?.length > 0 && (
                <div className='absolute left-0 bottom-0 w-full'>
                    <div className='flex flex-col w-full border-t px-4 pt-3 pb-2 bg-white'>
                        <div className='flex justify-between items-center w-full text-[15px] sm:text-[16px]'>
                            <p className='font-medium'>SubTotal</p>
                            <p className='font-medium text-green-500'>
                                {context?.cartData
                                    ?.map(item => parseInt(item.price || 0) * (item.quantity || 1))
                                    .reduce((acc, val) => acc + val, 0)
                                    .toLocaleString('en-US', {
                                        style: "currency",
                                        currency: "INR"
                                    })}
                            </p>
                        </div>

                        <div className='flex justify-between items-center w-full text-[15px] sm:text-[16px] pt-2 border-t mt-2'>
                            <p className='font-semibold'>Total</p>
                            <p className='font-semibold text-green-600'>
                                {context?.cartData
                                    ?.map(item => parseInt(item.price || 0) * (item.quantity || 1))
                                    .reduce((acc, val) => acc + val, 0)
                                    .toLocaleString('en-US', {
                                        style: "currency",
                                        currency: "INR"
                                    })}
                            </p>
                        </div>
                    </div>

                    <div className='flex flex-col sm:flex-row justify-between items-center w-full px-3 gap-3 py-4 bg-white'>
                        <Link to='/cart' className='w-full sm:w-1/2'>
                            <Button className='btn font-medium w-full'>VIEW CART</Button>
                        </Link>
                        <Link to='/checkout' className='w-full sm:w-1/2'>
                            <Button className='btn font-medium w-full'>CHECKOUT</Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>

    )
}

export default CartPanelCom