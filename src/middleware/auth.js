const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log(token)
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const verifyUser = await User.findOne({
            _id: verifyToken._id,
            "tokens.token": token
        });
        if (!verifyUser) {
            throw new Error("user not found")
        };
        req.token = token;
        req.user = verifyUser;
        req.userId = verifyUser._id;
        next()
    } catch (err) {
        res.status(401).json({
            err,
            message: "provide token"
        });
        // console.log(err)
    }
}
module.exports = auth;