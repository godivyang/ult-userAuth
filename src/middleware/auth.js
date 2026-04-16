import jwt from "jsonwebtoken";
import { getError } from "./response.js";
import { refreshTokenBeforeExpiry, refreshAccessToken } from "../routers/user.js";
// const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        let token = req.cookies?.token || req.body?.token,
            decoded;
            
        if(!token) throw new Error("No token found.");

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            const currentTime = Math.floor(Date.now() / 1000);
            const timeLeft = decoded.exp - currentTime;
            if (timeLeft < 1800) {
                req.newToken = await refreshTokenBeforeExpiry(req.cookies.refreshToken, res);
            }
        } catch (e) {
            if(req.cookies.token && req.cookies.refreshToken) {
                try {
                    const refToken = req.cookies.refreshToken;
                    decoded = jwt.verify(refToken, process.env.JWT_REFRESH_SECRET);
                    
                    let details = await refreshAccessToken(refToken, res);
                    decoded = details.decoded;
                    token = details.token;
                    // console.log("REFRESHED")
                    // req.newToken = token;
                } catch (e) {
                    throw new Error("Welcome back, you need to log in again to continue.");
                }
                // token = req.cookies.refreshToken;
            } else {
                throw new Error("All tokens expired, need to login again.");
            }
        }

        const user = {_id: decoded._id, name: decoded.name, email: decoded.email};

        if(!user) throw new Error();
        
        req.user = user;
        req.token = req.newToken || token;
        
        next();

    } catch (e) {
        res.status(401).send(getError({
            code: "AUTH_ERROR", 
            message: "User cannot be authenticated. Please try again."
        }));
    }
}

export default auth;