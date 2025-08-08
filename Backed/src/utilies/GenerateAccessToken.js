const jwt = require("jsonwebtoken")

const GeneratedAccessToken = async(userID) => {
    const token = await jwt.sign({ id : userID},process.env.SECRET_KEY_ACCESS_TOKEN,{ expiresIn : "7d" });
    return token;
}

module.exports = GeneratedAccessToken