const jwt = require("jsonwebtoken");
const UserModel = require("../Model/user_model");

const GeneratedRefreshToken = async (userID) => {
    //jwt.sign({payLoad},secret_Key)
    const token = await jwt.sign({ id: userID }, process.env.SECRET_KEY_REFRESH_TOKEN, { expiresIn: "7d" });
    // const UpdateRefreshTokenUser = await UserModel.updateOne({ id: userID._id }, { refresh_token: token })
    return token;
}

module.exports = GeneratedRefreshToken