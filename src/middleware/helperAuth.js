const SSO = require("../models/SSO");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const helperAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        
        if(!token) {
            if(req.body.code) {
                token = await checkIfValidCode(req.body.code);
            } else {
                throw new Error();
            }
        }
        
        let verifyToken = await checkIfValidToken(token);
        if(!verifyToken) {
            if(req.body.code) {
                token = await checkIfValidCode(req.body.code);
                verifyToken = await checkIfValidToken(token);
            } else {
                throw new Error();
            }
        }
        const {userName, userId, email} = verifyToken;
        if(!userName) throw new Error();
        
        req.token = token;
        req.userName = userName;
        req.userId = userId;
        req.email = email;
        next();
    } catch (e) {
        res.status(401).send({ error: "Please authenticate." });
    }
}

const checkIfValidCode = async (code) => {
    try {
        const token = await SSO.verifySSOToken(code);
        return token;
    } catch (e) {
        return undefined;
    }
}

const checkIfValidToken = async (token) => {
    try {
        if(!token) return undefined;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
        if(!user) {
            return undefined;
        }
        // const code = await SSO.generateSSOToken(user._id.toString(), token);
        return {userName: user.name, userId: user._id, email: user.email};
    } catch (e) {
        return undefined;
    }
}

module.exports = helperAuth;