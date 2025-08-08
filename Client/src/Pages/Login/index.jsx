import React, { useContext, useState } from 'react';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { IoEye } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { ClientContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/Api';
import { useEffect } from 'react';

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const [isPassShow, setIspassshow] = useState(true)
  const [data, setData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateValu = Object.values(data).every(el => el)
  const context = useContext(ClientContext);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (data.email === "") {
      context.alertBox("error", "Please enter your email id");
      setIsLoading(false);
      return;
    }

    if (data.password === "") {
      context.alertBox("error", "Please enter password");
      setIsLoading(false);
      return;
    }

    try {
      const response = await postData('/v1/user/login', data);

      if (response.success === true) {
        setData({ email: '', password: '' });
        context.alertBox("success", response?.message || "Login successful");
        // console.log(response);

        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        context.setIsLoading(true);
        navigate("/");
      } else {
        context.alertBox("error", response?.message || "Invalid email or password");
        setIsLoading(false);
      }

    } catch (error) {
      context.alertBox("error", error?.message || "Something went wrong");
      setIsLoading(false);
    }
  };



  const forgotPassHandler = (e) => {
    e.preventDefault();
    if (data.email === "") {
      context.alertBox("error", "Please enter your email id");
      return false;
    }
    else {
      localStorage.setItem("UserEmail", data.email);
      localStorage.setItem("ActionType", "ForgotPassword");
      postData("/v1/user/forgotpass", { email: data.email }).then((res) => {
        if (res?.success === true) {
          context.alertBox("success", res?.message || "OTP send to your email,please first verify your email");
          navigate("/Verify")
        }
        else {
          context.alertBox("error", res?.message);
        }
      })
    }
  }

  return (
    <div className="flex justify-center pt-5">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form method='post' onSubmit={loginHandler}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium">
              Email
            </label>
            <input
              name="email"
              onChange={changeHandler}
              value={data.email}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg "
            />
          </div>
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
          <div className='flex gap-5 items-center flex-row justify-center mt-2 mb-4'>
            <button onClick={forgotPassHandler} className='text-[rgba(105,216,105)]'>Forgot Password ?</button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 button-loader flex justify-center items-center gap-3"
            disabled={!validateValu || isLoading}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : "Login"}
          </button>
          <div className='flex gap-5 items-center flex-row justify-center mt-2'>
            <p>Not Register ? <Link to={'/register'} className='text-[rgba(105,216,105)]'>Signup</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
