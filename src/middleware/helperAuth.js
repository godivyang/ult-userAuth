import SSO from "../models/SSO.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import axios from "axios";
const axiosInstance = axios.create({
    baseURL: process.env.ULTIMATE_UTILITY_AUTH_URL,
    withCredentials: true
});

const helperAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        
        if(req.body?.code || !token) {
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
        const {name, _id, email} = verifyToken || {};
        if(!name) throw new Error();
        
        req.token = token;
        req.userName = name;
        req.userId = _id;
        req.email = email;
        next();
    } catch (e) {
        res.status(401).send({ error: "Please authenticate." });
    }
}

const checkIfValidCode = async (code) => {
    try {
        const response = await axiosInstance.post("/sso/crossAppLogin", { code });
        return response.data.data;
    } catch (e) {
        return undefined;
    };
}

const checkIfValidToken = async (token) => {
    try {
        const response = await axiosInstance.post("/user/me", { token });
        return response.data.data;
    } catch (e) {
        return undefined;
    }
}

export default helperAuth;