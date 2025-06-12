const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    console.log(`${req.cookies.token}`);
    try {
        let token;
        // console.log(req.cookies, req.header("Authorization"))
        // if(req.header("Authorization")) {
        //     token = req.header("Authorization").replace("Bearer ", "");
        // } else if(req.cookies.token) {
            // console.log(req.cookies.token)
            token = req.cookies.token;
        // }
        if(!token) throw new Error();

        const decoded = jwt.verify(token, process.env.JWT_Secret);
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

        if(!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: "Please authenticate." });
    }
}

module.exports = auth;