import React, { useContext, useEffect, useState } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import {  postData } from '../../utils/Api';
import { useNavigate } from 'react-router-dom';


const AddAddress = () => {
    const [Data, setData] = useState({
        address_line: "",
        city: "",
        state: "",
        country: "",
        pincode: "",

    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({ ...Data, [name]: value });
    };

    const [status, setStatus] = useState(false);
    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const addressData = {
        address_line: Data.address_line,
        city: Data.city,
        state: Data.state,
        country: Data.country,
        pincode: Data.pincode,
        status: status,
        selected: false
    };


    const navigate = useNavigate();
    const submitHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('accessToken');
       postData(`/v1/address/AddAddressData/${context?.userData?._id}?token=${token}`, addressData).then((res) => {
            console.log(res);
            
            setIsLoading(false);
            setData({
                address_line: "",
                city: "",
                state: "",
                country: "",
                pincode: "",

            });
            context.alertBox("success", "Address data add successfully...")
            navigate("/Profile")
            context?.setAddress(Data);
        }).catch(() => {
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
            pincode: ""
        });
        navigate("/Profile")
    };

    const [isLoading, setIsLoading] = useState(false);
    const validateValu = Object.values(Data).every(el => el)
    const context = useContext(MyContext);



    return (
        <div className='px-[40px]'>
            <form onSubmit={submitHandler} method='post'>
                <div className="grid grid-cols-2 mb-3 gap-5">
                    <div>
                        <h3 className='text-[18px] font-[500] mb-1 mt-3'>Address_line</h3>
                        <input
                            type="text"
                            name="address_line"
                            onChange={handleInputChange}
                            className="w-full h-[40px] border border-gray-300  px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="Enter product name"
                        />
                    </div>
                    <div>
                        <h3 className='text-[18px] font-[500] mb-1 mt-3'>City</h3>
                        <input
                            type="text"
                            name="city"
                            onChange={handleInputChange}
                            className="w-full h-[40px] border border-gray-300  px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="Enter product name"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 mb-3 gap-5">
                    <div>
                        <h3 className='text-[18px] font-[500] mb-1 mt-3'>State</h3>
                        <input
                            type="text"
                            name="state"
                            onChange={handleInputChange}
                            className="w-full h-[40px] border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="Enter product name"
                        />
                    </div>
                    <div>
                        <h3 className='text-[18px] font-[500] mb-1 mt-3'>Country</h3>
                        <input
                            type="text"
                            name="country"
                            onChange={handleInputChange}
                            className="w-full h-[40px] border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="Enter product name"
                        />
                    </div>
                    <div>
                        <h3 className='text-[18px] font-[500] mb-1 mt-3'>Pincode</h3>
                        <input
                            type="text"
                            name="pincode"
                            onChange={handleInputChange}
                            className="w-full h-[40px] border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2"
                            placeholder="Enter product name"
                        />
                    </div>
                </div>
                <div className=''>
                    <h2 className='text-[18px] font-[500] mb-1 mt-3'>Status</h2>
                    <Select
                        value={status}
                        onChange={handleChange}
                        displayEmpty
                        size='small'
                        className='w-[30%]'
                    >
                        <MenuItem value="">
                            <em>Status</em>
                        </MenuItem>
                        <MenuItem value={true}>True</MenuItem>
                        <MenuItem value={false}>False</MenuItem>
                    </Select>
                </div>
                <div className='flex flex-row mt-5 gap-4'>
                    <button
                        type="submit"
                        className="w-[10%] bg-blue-500 text-white py-2 button-loader flex justify-center items-center gap-3"
                        disabled={!validateValu || isLoading}
                    >
                        {isLoading ? <CircularProgress size={20} color="inherit" /> : "Add Data"}
                    </button>
                    <button className='w-[10%] bg-blue-500 text-white py-2 button-loader flex justify-center items-center gap-3'
                        type='button' onClick={resetHandler}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default AddAddress
