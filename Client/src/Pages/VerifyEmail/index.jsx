import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/Api';

const VerifyEmail = () => {

    const [data, setData] = useState({ email: '', otp: '' });
    const [isLoading, setIsLoading] = useState(false);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    }

    const validateValu = Object.values(data).every(el => el)
    const navigate = useNavigate();
    const context = useContext(ClientContext);
    
    const submitHandler = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        if (data.email === "") {
            context.alertBox("error", "Please enter your email id");
            return false;
        }
        if (data.otp === "") {
            context.alertBox("error", "Please enter valid otp...");
            return false;
        }

        const Action = localStorage.getItem("ActionType");

        if (Action !== "ForgotPassword") {
            postData(`/v1/user/verifyemail?token=${localStorage.getItem("accessToken")}`,data,{ withCreadentials : true }).then((response) => {
                console.log(response);

                if (response?.success === true) {
                    setData({ email: '', otp: '' });
                    context.alertBox("success", response?.message || "Email Verified...");
                    setIsLoading(false);
                    navigate("/Login")
                }
                else {
                    context.alertBox("error", response?.message || "Email Verification Failed...");
                }
            })
        }
        else{
            postData(`/v1/user/verify-forgot-password?token=${localStorage.getItem("accessToken")}`,data,{ withCreadentials : true }).then((response) => {
            if (response?.success === true) {
                setData({ email: '', otp: '' });
                context.alertBox("success", response?.message || "Email Verified...");
                setIsLoading(false);
                navigate("/ResetPass")
            }
            else {
                context.alertBox("error", response?.message || "Email Verification Failed...");
            }
        })
        }


    };
    return (
        <div className="flex items-center justify-center my-5">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4">Verify Your Email</h2>
                <p className="text-[17px] mb-5">
                    Send to: <span className="font-medium">{localStorage.getItem("UserEmail")}</span>
                </p>

                <form method='post' onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            name='email'
                            onChange={changeHandler} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">OTP</label>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            name="otp"
                            onChange={changeHandler}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 button-loader flex justify-center items-center gap-3"
                        disabled={!validateValu || isLoading}
                    >
                        {isLoading ? <CircularProgress size={20} color="inherit" /> : "Verify Email"}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default VerifyEmail;