const jwt = require('jsonwebtoken')

const Auth = async (req, res, next) => {
    
    try {

        var token = req.cookies.accessToken || req?.headers?.authorizatoin?.split(" ")[1];
           
        if (!token) {
            token = req?.query.token
        }

        if (!token) return res.status(401).json({ msg: "Provide Token..." })

        const verify = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        if (!verify) {
            return res.status(401).json({ message: "Unauthorized Token.." })
        }
        
        req.userId = verify.id;
        next()
    }

    catch (error) {
    res.status(500).json({ message: "You Have not logIn...", success: false })
}
}
module.exports = Auth;