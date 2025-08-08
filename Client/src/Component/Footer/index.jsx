import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoIosChatboxes } from "react-icons/io";
import CartPanelCom from "../CartPanelCom/index.jsx"
import Drawer from '@mui/material/Drawer';
import { ClientContext } from '../../App';
import { IoClose } from "react-icons/io5";

const Footer = () => {
  const context = useContext(ClientContext);

  return (
    <div>
      <footer className='container'>
        <div className='flex flex-col lg:flex-row flex-wrap gap-2 py-5'>

          <div className='w-full lg:w-[25%] border-b  border-[rgba(0,0,0,0.3)] lg:border-b-0 lg:border-r pr-2'>
            <h2 className='font-semibold text-[20px] py-3'>Contact</h2>
            <p className='text-[17px] leading-6'>
              Contrary to popular belief, Lorem <br /> Ipsum is not text.
            </p>
            <Link className='block text-[17px] mt-2' to="mailto:someone@example.com">
              abc.company@gmail.com
            </Link>
            <span className='block text-[17px]'>(+91) 123467890</span>
            <div className='flex pt-2 gap-2 items-center pb-2'>
              <IoIosChatboxes className='text-[40px] text-green-500' />
              <p className='text-[16px]'>Get chat <br /> with expert</p>
            </div>
          </div>

    
          <div className='w-full sm:w-[48%] lg:w-[20%] pl-0 lg:pl-8'>
            <h2 className='font-semibold text-[20px] py-3'>Product</h2>
            <ul className='space-y-2'>
              {["Price drop", "New Product", "Best Sales", "Contact us", "Sitemap", "Store"].map((item, index) => (
                <li key={index}>
                  <Link className='block text-[16px]' to="/">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className='w-full sm:w-[48%] lg:w-[20%]'>
            <h2 className='font-semibold text-[20px] py-3'>Our Company</h2>
            <ul className='space-y-2'>
              {["Delivery", "Legal notices", "Terms and Condition of use", "About us", "Secure payment", "Login"].map((item, index) => (
                <li key={index}>
                  <Link className='block text-[16px]' to={item === "Login" ? "/login" : "/"}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className='w-full lg:w-[30%]'>
            <h2 className='font-semibold text-[20px] py-3'>Subscribe to Newsletter</h2>
            <p className='text-[17px] leading-6'>
              Contrary to popular belief, Lorem Ipsum <br />
              is not text.
            </p>
            <input
              type='email'
              placeholder='Your Email Address'
              className='block border lg:w-full sm:w-full md:w-full px-3 py-2 mt-3 outline-none text-[15px]'
            />
            <Link to="/">
              <button className='btn mt-3 text-sm md:text-base'>SUBSCRIBE</button>
            </Link>
          </div>
        </div>
      </footer>

      <div className='border-t mt-5 border-[rgba(0,0,0,0.3)]'>
        <div className='flex items-center justify-center container py-4 text-center text-sm'>
          <p>@ 2025 - Ecommerce Template</p>
        </div>
      </div>

     
      <Drawer open={context.openCartPanel} onClose={context.toggleCartPanel(false)} anchor='right' className='cartPanel'>
        <div className='flex items-center justify-between gap-4 pt-2 px-4 border-b pb-2'>
          <h4 className='text-[17px] font-medium text-green-500'>Shopping Cart ({context?.cartData?.length || '0'})</h4>
          <IoClose onClick={context.toggleCartPanel(false)} className='text-[20px] cursor-pointer' />
        </div>
        <CartPanelCom />
      </Drawer>
    </div>
  );
};

export default Footer;
