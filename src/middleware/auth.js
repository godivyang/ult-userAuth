const jwt = require("jsonwebtoken");
// const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        let token = req.cookies.token || req.body.token;

        if(!token) throw new Error();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
        const user = {_id: decoded._id, name: decoded.name, email: decoded.email}

        if(!user) {
            throw new Error();
        }
        
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({
            success: false,
            details: {
                code: "AUTH_FAILED",
                message: "User cannot be authenticated. Please try again."
            }
        });
    }
}

module.exports = auth;