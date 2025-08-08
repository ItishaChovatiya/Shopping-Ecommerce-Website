const express = require('express');
const { Login, Register, VerifyEmail, LogOut, UploadImageAvtr, RemoveImageAvtr, UpdateUserDetail, ForgotPassword,
    VerifyForgotPasswordhandler, ResetPassword, Refreshtokenhandler, GetUserInfo, AuthWithGoogle, AddReview, GetUserReview, 
    GetAllUser,GetAllReview,
    DeleteUserCon} = require('../../Controller/UserCon');
const Auth = require('../../Middlewares/Auth');
const upload = require('../../Middlewares/Multer');

const user_router = express.Router();


user_router.post('/register', Register);
user_router.post('/verifyemail', VerifyEmail)
user_router.post("/login", Login);
user_router.post("/authWithGoogle", AuthWithGoogle);
user_router.get("/LogOut", LogOut)
user_router.put("/uploadAVTR", Auth, upload.array("avatar", 5), UploadImageAvtr);
user_router.delete("/removeAVTR", RemoveImageAvtr)
user_router.put('/:id', Auth, UpdateUserDetail)
user_router.post('/forgotpass', ForgotPassword)
user_router.post('/verify-forgot-password', VerifyForgotPasswordhandler)
user_router.post('/resetPassword', ResetPassword)
user_router.post('/refreshToken', Refreshtokenhandler)
user_router.get("/getUserInfo",Auth, GetUserInfo)
user_router.post("/Review", Auth, AddReview)
user_router.get("/GetReviewData", GetUserReview);
user_router.get("/GetAllUserList",GetAllUser)
user_router.get("/GetAllReview",GetAllReview)
user_router.delete("/deleteUser",DeleteUserCon)



module.exports = user_router