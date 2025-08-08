import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { IoEye } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { ClientContext } from '../../App';
import { postData } from '../../utils/Api';
import CircularProgress from '@mui/material/CircularProgress';
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FireBaseapp } from '../../firebase';
import { useEffect } from 'react';

const auth = getAuth(FireBaseapp);
const googleProvider = new GoogleAuthProvider();

const Register = () => {

   const authWithGoogle = async () => {
  // 👇 Force account selection every time
  googleProvider.setCustomParameters({
    prompt: "select_account"
  });

  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      const filed = {
        email: user.providerData[0].email,
        Name: user.providerData[0].displayName,
        password: null,
        avatar: user.providerData[0].photoURL,
        mobile: user.providerData[0].phoneNumber,
        signUpWithGoogle: true,
      };

      postData(`/v1/user/authWithGoogle?token=${token}`, filed)
        .then((res) => {
          if (res?.error) {
            context.alertBox("error", res?.message || "Something went wrong!");
          } else {
            context.alertBox("success", res?.message || "Registered successfully!");
            setIsLoading(false);
            localStorage.setItem("UserEmail", filed?.email);
            localStorage.setItem("accessToken", res?.data?.accessToken);
            localStorage.setItem("refreshToken", res?.data?.refreshToken);
            context.setIsLoading(true);
            navigate('/');
          }
        })
        .catch((err) => {
          context.alertBox("error", err?.message || "Server error");
        });

    })
    .catch((error) => {
      console.error("Google Sign-in error:", error);
    });
};


    useEffect(() => {
        window.scrollTo(0,0)
    },[])
    
    const [isPassShow, setIspassshow] = useState(true)
    const [data, setData] = useState({ Name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const validateValu = Object.values(data).every(el => el)
    const navigate = useNavigate();
    const context = useContext(ClientContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (data.Name === "") {
            context.alertBox("error", "Please enter your name");
            return false;
        }
        if (data.email === "") {
            context.alertBox("error", "Please enter your email id");
            return false;
        }
        if (data.password === "") {
            context.alertBox("error", "Please enter password");
            return false;
        }

        postData("/v1/user/register", data)
            .then((res) => {
                if (res?.error) {
                    context.alertBox("error", res?.message || "Something went wrong!");
                } else {
                    setData({ Name: '', email: '', password: '' });
                    context.alertBox("success", res?.message || "Registered successfully!");
                    setIsLoading(false);
                    localStorage.setItem("UserEmail", data.email);
                    navigate('/Verify');
                }
            })
            .catch((err) => {
                context.alertBox("error", err?.message || "Server error");
            });

    };



    return (
        <div className="flex items-center justify-center mt-5">
            <div className="bg-white p-6 shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Register / Sign Up</h2>
                <form method='post' onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label htmlFor="Name" className="block">Name</label>
                        <input type="text" id="Name" name="Name" value={data.Name} disabled={isLoading === true ? true : false}
                            onChange={changeHandler} placeholder="Enter your name"
                            className="w-full px-3 py-2 border border-gray-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block">Email</label>
                        <input type="email" id="email" name="email" value={data.email} disabled={isLoading === true ? true : false}
                            onChange={changeHandler} placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block">Password</label>
                        <div className="relative">
                            <input
                                type={isPassShow ? "password" : "text"}
                                id="password"
                                name="password"
                                value={data.password}
                                disabled={isLoading === true ? true : false}
                                onChange={changeHandler}
                                placeholder="Enter your password"
                                className="w-full px-3 py-2 border border-gray-300 pr-10"
                            />
                            <Button
                                type="button"
                                className="!absolute top-1/2 right-2 transform -translate-y-1/2 p-1"
                                onClick={() => setIspassshow(!isPassShow)}
                            >
                                {isPassShow ? <IoEyeOffSharp /> : <IoEye />}
                            </Button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 button-loader flex justify-center items-center gap-3"
                        disabled={!validateValu || isLoading}
                    >
                        {isLoading ? <CircularProgress size={20} color="inherit" /> : "Register"}
                    </button>

                    <div className='flex gap-5 items-center flex-row justify-center mt-2'>
                        <p>Already have account ?  <Link to={'/login'} className='text-[rgba(105,216,105)]'>Login</Link></p>
                    </div>
                    <div>
                        <Button className="!my-2 !flex gap-1 !items-center w-full !justify-center !border !border-black py-2 !text-blue-600 text-lg" onClick={authWithGoogle}>
                            <FcGoogle className='text-3xl' /> Loign with Google
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;  
