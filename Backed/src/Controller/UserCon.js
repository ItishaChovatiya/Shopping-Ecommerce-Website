const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/user_model");
const { sendEmailFun } = require("../Config/SendEmail");
const VerificationEmail = require("../utilies/VerifyEmailTemplate");
const GeneratedAccessToken = require("../utilies/GenerateAccessToken");
const GeneratedRefreshToken = require("../utilies/GeneratedRefreshToken");
const { v2: cloudinary } = require("cloudinary"); //{ v2 : cloudinary } means version 2 import as cloudinary
const fs = require("fs");
const Review = require("../Model/ProductReview_Model");
const UserModel = require("../Model/user_model");


// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const Register = async (req, res) => {
  try {
    let user;

    const { Name, email, password } = req.body;
    if (!Name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists..." });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      Name,
      email,
      password: hashedPassword,
      otp: verifyCode,
      otp_expires: Date.now() + 600000,
    });

    await user.save();

    await sendEmailFun({
      sendTo: email,
      subject: "Verify Email",
      text: "text",
      html: VerificationEmail(Name, verifyCode),
    });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY
    );

    
    res.status(200).json({
      success: true,
      message: "User registered successfully ! Please verify your email.",
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const AuthWithGoogle = async (req, res) => {
  const { Name, email, avatar, mobile, signUpWithGoogle, role } = req.body;
  try {
    const isUserExist = await User.findOne({ email: email });

    if (!isUserExist) {
      const user = new User({
        Name,
        email,
        password: null,
        avatar,
        mobile,
        role: role || "USER",
        verify_email: true,
        signUpWithGoogle: signUpWithGoogle || true,
      });

      await user.save();
      const accessToken = await GeneratedAccessToken(user._id);
      const { token: refreshToken } = await GeneratedRefreshToken(user._id); // ✅ fixed


      const cookiesOption = {
        httpOnly: true,
        secure: false,
        sameSite: "None",
      };

      await res.cookie("accessToken", accessToken, cookiesOption);
      await res.cookie("refreshToken", refreshToken, cookiesOption);

      await User.findByIdAndUpdate(user?._id, {
        last_login_at: new Date(),
        refresh_token: refreshToken,
        access_token: accessToken,
      });
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          accessToken,
          refreshToken,
        },
      });
   } else {
  const accessToken = await GeneratedAccessToken(isUserExist._id);
  const  refreshToken  = await GeneratedRefreshToken(isUserExist._id); 

  const cookiesOption = {
    httpOnly: true,
    secure: false,
    sameSite: "None",
  };

  await res.cookie("accessToken", accessToken, cookiesOption);
  await res.cookie("refreshToken", refreshToken, cookiesOption);

  await User.findByIdAndUpdate(isUserExist?._id, {
    last_login_at: new Date(),
    refresh_token: refreshToken,
    access_token: accessToken,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      accessToken,
      refreshToken,
    },
  });
}

  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: true, message: error.message });
  }
};

const VerifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // console.log("VerifyEmail request body:", req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    if (!user.otp || !user.otp_expires) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated. Please request a new one.",
      });
    }
    const isValidOTP = user.otp === otp;
    const isNotExpired = user.otp_expires > Date.now();
    if (isValidOTP && isNotExpired) {
      user.verify_email = true;
      user.otp = null;
      user.otp_expires = null;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Email verified successfully.",
      });
    }
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
    if (!isNotExpired) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }
    if (!user.otp || !user.otp_expires) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated. Please request a new one.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not register..." });
    }

    if (user.status !== "Active") {
      return res
        .status(400)
        .json({ success: false, message: "User is not active" });
    }
    if (user.verify_email !== true) {
      return res.status(400).json({
        success: false,
        message: "Your email is not verify yet please First verify email...",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password..." });
    }

    const accessToken = await GeneratedAccessToken(user._id);
    const refreshToken = await GeneratedRefreshToken(user._id);

    const cookiesOption = {
      httpOnly: true,
      secure: false,
      sameSite: "None",
    };

    await res.cookie("accessToken", accessToken, cookiesOption);
    await res.cookie("refreshToken", refreshToken, cookiesOption);

    await User.findByIdAndUpdate(user?._id, {
      last_login_at: new Date(),
      refresh_token: refreshToken,
      access_token: accessToken,
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const LogOut = async (req, res) => {
  try {
    const userId = res.userId; //Come From Auth Middleware
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    await User.findByIdAndUpdate(userId, {
      access_token: "",
      refresh_token: "",
    });
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Logout not successful",
    });
  }
};

const UploadImageAvtr = async (req, res) => {
  try {
    const userId = req.userId;
    const images = req.files;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images uploaded" });
    }

    const getPublicIdFromUrl = (url) => {
      const regex = /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp|gif|png)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };
    if (user.avatar && user.avatar.length > 0) {
      const oldPublicIds = (user.avatar || [])
        .map(getPublicIdFromUrl)
        .filter(Boolean);
      if (oldPublicIds.length > 0) {
        await cloudinary.api.delete_resources(oldPublicIds, {
          resource_type: "image",
        });
      }
    }

    const uploadedImageUrls = [];

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    // Upload only the first image
    const firstImage = images[0];
    const result = await cloudinary.uploader.upload(firstImage.path, options);
    uploadedImageUrls.push(result.secure_url);
    fs.unlinkSync(firstImage.path); // Clean up

    // Set new avatar
    user.avatar = uploadedImageUrls;
    await user.save();

    res.status(200).json({
      success: true,
      _id: userId,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Avatar upload error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const RemoveImageAvtr = async (req, res) => {
  try {
    const imgURL = req.query.img;
    const urlARR = imgURL.split("/");
    const urlimg = urlARR[urlARR.length - 1];
    const imgName = urlimg.split(".")[0];

    if (imgName) {
      await cloudinary.uploader.destroy(imgName);
    }
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const UpdateUserDetail = async (req, res) => {
  try {
    const userId = req.userId;
    const { Name, email, mobile, password } = req.body;
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //if email is not same us like user email then junret otp and verify email
    let verifyCode = "";
    if (email !== userExist.email) {
      verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    //if user add password then hashed it otherwise strore it as it is into hashedPassword
    let hashedPassword = "";
    if (password) {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    } else {
      hashedPassword = userExist.password;
    }

    const update = await User.findByIdAndUpdate(
      userId,
      {
        Name: Name,
        email: email,
        mobile: mobile,
        password: hashedPassword,
        verify_email: email ? false : true,
        otp: verifyCode !== "" ? verifyCode : null,
        otp_expires: verifyCode !== "" ? Date.now() + 600000 : null,
      },
      { new: true }
    );

    if (email !== userExist.email) {
      await sendEmailFun({
        sendTo: email,
        subject: "Verify Email",
        text: "",
        html: VerificationEmail(Name, verifyCode),
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      update: update,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "Email not availble",
      });
    } else {
      let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      userExist.otp = verifyCode;
      userExist.otp_expires = Date.now() + 600000;
      await userExist.save();
      await sendEmailFun({
        sendTo: email,
        subject: "Verify Email",
        text: "",
        html: VerificationEmail(userExist.Name, verifyCode),
      });
      res.status(200).json({
        success: true,
        message: "check your email",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const VerifyForgotPasswordhandler = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({
        success: false,
        message: "Provide both otp and email",
      });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "Email not available",
      });
    }

    if (otp !== userExist.otp) {
      return res.status(400).json({
        success: false,
        message: "Invaild otp...",
      });
    }
    //toISOSTring() is method where it convert date to ISO format like 2021-01-01T00:00:00.000Z
    const currentTime = new Date().toISOString();
    if (userExist.otp_expires < currentTime) {
      return res.status(400).json({
        success: false,
        message: "Otp expired",
      });
    }

    userExist.otp = "";
    userExist.otp_expires = "";

    await userExist.save();
    return res.status(200).json({
      success: true,
      message: "OTP verify successfully...",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Provide all fields",
      });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password not match",
      });
    }
    const hashedPassword = await bcrypt.hash(confirmPassword, 10);

    userExist.password = hashedPassword;

    await userExist.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const Refreshtokenhandler = async (req, res) => {
  try {
    const refresh_token =
      req?.cookie?.refreshToken || req?.headers?.authorization?.split(" ")[1];
    console.log(refresh_token);

    if (!refresh_token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const verifyToken = await jwt.verify(
      refresh_token,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );
    if (!verifyToken) {
      return res
        .status(401)
        .json({ success: false, message: "Token is expired..." });
    }

    const userId = verifyToken._id;
    const newAccessToken = await GeneratedAccessToken(userId);
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", newAccessToken, options);
    res.json({
      success: true,
      message: "New Refresh token is successfully...",
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const GetUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log(userId);
    
    const user = await User.findById(userId).select("-password -refresh_token");
    // console.log("userData",user);
    
    //select('-password -refresh_token'); becuase we dont want to return password and refresh token in response
    return res.json({
      message: "user details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//USER ADD REVIEW
const AddReview = async (req, res) => {
  try {
    const { Name, image, rating, review, userId, productId } = req.body;

    const UserReview = new Review({
      Name,
      image,
      rating,
      review,
      userId,
      productId,
    });

    await UserReview.save();
    res.status(200).json({
      success: true,
      error: false,
      review: UserReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetUserReview = async (req, res) => {
  try {
    const productId = req.query.productId;
    const review = await Review.find({ productId: productId });

    if (!review || review.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for this product",
      });
    }
    res.status(200).json({
      success: true,
      error: false,
      message: "Review fetched successfully",
      review: review,
    });
  } catch (error) {
    console.error("❌ Error in GetUserReview:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllReview = async (req, res) => {
  try {
    const review = await Review.find();
    res.status(200).json({
      success: true,
      error: false,
      message: "Review fetched successfully",
      review: review,
    });
  } catch (error) {
    console.error("❌ Error in GetUserReview:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllUser = async (req, res) => {
  try {
    const user = await User.find();
    // console.log(user);

    res.status(200).json({
      success: true,
      error: false,
      message: "All User fetched successfully",
      user: user,
    });
  } catch (error) {
    console.error("❌ Error in GetUserReview:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const DeleteUserCon = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      error: false,
      message: "User deleted successfully",
      user: user,
    });
  } catch (error) {
    console.error("❌ Error in DeleteUserCon:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  Register,
  VerifyEmail,
  Login,
  LogOut,
  UploadImageAvtr,
  RemoveImageAvtr,
  UpdateUserDetail,
  ForgotPassword,
  VerifyForgotPasswordhandler,
  ResetPassword,
  Refreshtokenhandler,
  GetUserInfo,
  AuthWithGoogle,
  AddReview,
  GetUserReview,
  GetAllUser,
  GetAllReview,
  DeleteUserCon,
};
