import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { IoEye } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/Api';

const Admin_ResetPassword = () => {

    const [isPassShow, setIspassshow] = useState(true)
    const [isPassShowCpassword, setisPassShowCpassword] = useState(true)
    const [data, setData] = useState({ password: "", confirmPassword: "" });
    const [isLoading, setIsLoading] = useState(false);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateValu = Object.values(data).every(el => el)
    const context = useContext(MyContext);
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
                <form method="post" onSubmit={ResetHandler}>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                onChange={changeHandler}
                                value={data.password}
                                type={isPassShow ? "password" : "text"}
                                id="password"
                                placeholder="Enter your New password"
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => setIspassshow(!isPassShow)}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
                            >
                                {isPassShow ? <IoEyeOffSharp size={20} /> : <IoEye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                onChange={changeHandler}
                                value={data.confirmPassword}
                                type={isPassShowCpassword ? "password" : "text"}
                                id="confirmPassword"
                                placeholder="Enter your confirm password"
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => setisPassShowCpassword(!isPassShowCpassword)}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
                            >
                                {isPassShowCpassword ? <IoEyeOffSharp size={20} /> : <IoEye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg flex justify-center items-center gap-3 hover:bg-blue-600 transition"
                        disabled={!validateValu || isLoading}
                    >
                        {isLoading ? <CircularProgress size={20} color="inherit" /> : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Admin_ResetPassword
