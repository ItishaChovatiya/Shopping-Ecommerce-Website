import React from 'react'
import order_placed from "../../assets/order_placed.bmp"
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'

const OrderSuccess = () => {
  return (
    <div className='w-[50%]  mx-auto'>
      
      <img src={order_placed} className='w-full h-[300px]' alt='order Placed img'></img>
      <h1 className='text-center text-green-500 text-[30px] '>Order Placed Successfully...</h1>
      <Link to={"/"}>
      <Button className="!flex !gap-3 !mx-auto !bg-green-500 !mt-3 !px-8 !py-3 !text-[16px] !text-white">Back Shopping</Button>
      </Link>
    </div>
  )
}

export default OrderSuccess