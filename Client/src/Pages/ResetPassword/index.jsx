import React, { useContext, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { IoEye } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { ClientContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/Api';

const ResetPassword = () => {

    const [isPassShow, setIspassshow] = useState(true)
    const [isPassShowCpassword, setisPassShowCpassword] = useState(true)
    const [data, setData] = useState({ password: "", confirmPassword: "" });
    const [isLoading, setIsLoading] = useState(false);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateValu = Object.values(data).every(el => el)
    const context = useContext(ClientContext);
    const navigate = useNavigate();

    const ResetHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);


        if (data.password === "") {
            context.alertBox("error", "Please enter password");
            setIsLoading(false);
            return;
        }

        if (data.confirmPassword === "") {
            context.alertBox("error", "Please enter confirm password");
            setIsLoading(false);
            return;
        }

        if (data.password !== data.confirmPassword) {
            context.alertBox("error", "Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await postData(`/v1/user/resetPassword?token=${localStorage.getItem("accessToken")}`, {
                email: localStorage.getItem("UserEmail"),
                password: data.password,
                confirmPassword: data.confirmPassword
            }, { withCreadentials: true });
            setData({ password: '', confirmPassword: "" });
            context.alertBox("success", response?.message || "Reset Password successfully...");
            setIsLoading(false);
            navigate('/Login');
        } catch (error) {
            context.alertBox("error", error?.message || "Reset Password failed...");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center pt-5">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>
                <form method='post' onSubmit={ResetHandler}>
                    <div className="mb-6 relative">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium">
                            Password
                        </label>
                        <input
                            name="password"
                            onChange={changeHandler}
                            value={data.password}
                            type={isPassShow ? "password" : "text"}
                            id="password"
                            placeholder="Enter your password"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                        ></input>
                        <Button className='absolute top-[37px] right-[12px] flex' onClick={() => setIspassshow(!isPassShow)}>{isPassShow ? <IoEyeOffSharp /> : <IoEye />}
                        </Button>
                    </div>
                    <div className="mb-6 relative">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium">
                            Confirm Password
                        </label>
                        <input
                            name="confirmPassword"
                            onChange={changeHandler}
                            value={data.confirmPassword}
                            type={isPassShowCpassword ? "password" : "text"}
                            id="confirmPassword"
                            placeholder="Enter your Confirm password"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                        ></input>
                        <Button className='absolute top-[37px] right-[12px] flex'
                            onClick={() => setisPassShowCpassword(!isPassShowCpassword)}>{isPassShowCpassword ? <IoEyeOffSharp /> : <IoEye />}
                        </Button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 button-loader flex justify-center items-center gap-3"
                        disabled={!validateValu || isLoading}
                    >
                        {isLoading ? <CircularProgress size={20} color="inherit" /> : "Reset Password"}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default ResetPassword
