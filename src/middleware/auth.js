import jwt from "jsonwebtoken";
import { getError } from "./response.js";
// const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        let token = req.cookies?.token || req.cookies?.refreshToken || req.body?.token,
            decoded;
            
        if(!token) throw new Error("No token found.");

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            if(req.cookies.token && req.cookies.refreshToken) {
                token = req.cookies.refreshToken;
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            }
            throw new Error();
        }

        const user = {_id: decoded._id, name: decoded.name, email: decoded.email};

        if(!user) throw new Error();
        
        req.user = user;
        req.token = token;
        
        next();

    } catch (e) {
        res.status(401).send(getError({
            code: "AUTH_ERROR", 
            message: "User cannot be authenticated. Please try again."
        }));
    }
}

export default auth;