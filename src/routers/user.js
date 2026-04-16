import express from "express";
const router = new express.Router();
import User from "../models/user.js";
import auth from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import { getError, getSuccess } from "../middleware/response.js";

const tokenOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE == "true",
    sameSite: process.env.COOKIE_SAMESITE,
    maxAge: 6 * 60 * 60 * 1000
};

const refreshTokenOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE == "true",
    sameSite: process.env.COOKIE_SAMESITE,
    maxAge: 7 * 24 * 60 * 60 * 1000
}

const generateToken = (details) => {
    const token = jwt.sign(
        {...details}, 
        process.env.JWT_SECRET, 
        { expiresIn: "6h" });
    return token;
};

const generateRefreshToken = (details) => {
    const token = jwt.sign(
        {...details}, 
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: "7d" });
    return token;
};

export const refreshTokenBeforeExpiry = async (refreshToken, res) => {
    const tokenObj = await refreshAccessToken(refreshToken, res);
    return tokenObj.token;
};

export const refreshAccessToken = async (refreshToken, res) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const details = { _id: decoded._id.toString(), name: decoded.name, email: decoded.email };
        const user = await User.findById(details._id);

        if(!user.tokens.find((token) => token.token === refreshToken)) throw new Error("Refresh token invalid");

        const token = generateToken(details);
        const newRefreshToken = generateRefreshToken(details);

        res.cookie("token", token, tokenOptions);
        res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);

        user.tokens.push({ token: newRefreshToken });
        user.tokens = user.tokens.filter((token) => token.token !== refreshToken);
        await user.save();

        return {decoded: details, token};
        
    } catch (e) {
        throw e;
    }

};

router.post("/user/login", async (req, res) => {
    try {
        const user = await User.authenticate(req.body.email, req.body.password);
        const details = { _id: user._id.toString(), name: user.name, email: user.email };
        const token = generateToken(details);
        const refreshToken = generateRefreshToken(details);
        
        user.tokens.push({ token: refreshToken });
        user.tokens = user.tokens.filter((token) => token.token !== req.cookies.refreshToken);
        await user.save();
        
        res.cookie("token", token, tokenOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenOptions);
        
        res.send({
            success: true,
            data: details,
            details: {
                code: "SUCCESS",
                message: "User logged-in successfully!"
            }
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            details: {
                code: "LOGIN_FAILED",
                message: "User log-in failed. Please try again."
            }
        });
    }
});

router.post("/user/guestLogin", async (req, res) => {
    try {
        const user = await User.authenticate(process.env.GUEST_EMAIL, process.env.GUEST_PASSWORD);
        const details = { _id: user._id.toString(), name: user.name, email: user.email };
        const token = generateToken(details);
        const refreshToken = generateRefreshToken(details);

        user.tokens.push({ token: refreshToken });
        user.tokens = user.tokens.filter((token) => token.token !== req.cookies.refreshToken);
        await user.save();
        
        res.cookie("token", token, tokenOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenOptions);
        
        res.send({
            success: true,
            data: details,
            details: {
                code: "SUCCESS",
                message: "Guest signed-in successfully!"
            }
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            details: {
                code: "LOGIN_FAILED",
                message: "Guest log-in failed. Please try again."
            }
        });
    }
});

router.post("/user/signup", async (req, res) => {
    try {
        const user = new User(req.body);
        const details = { _id: user._id.toString(), name: user.name, email: user.email };
        const token = generateToken(details);
        const refreshToken = generateRefreshToken(details);

        user.tokens.push({ token: refreshToken });
        await user.save();

        res.cookie("token", token, tokenOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenOptions);

        res.send({
            success: true,
            data: details,
            details: {
                code: "SUCCESS",
                message: "User signed-in successfully!"
            }
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            details: {
                code: "SIGNUP_FAILED",
                message: "User sign-up failed. Please try again."
            }
        });
    }
});

router.get("/user/refresh", async (req, res) => {
    try {
        let refreshToken = req.cookies.refreshToken;
        const details = await refreshAccessToken(refreshToken, res);

        res.send({
            success: true,
            data: details.decoded,
            details: {
                code: "SUCCESS",
                message: "Token refreshed successfully!"
            }
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            details: {
                code: "AUTH_FAILED",
                message: "Please log-in to access the application."
            }
        });
    }
});

router.get("/user/me", auth, async (req, res) => {
    res.send({
        success: true,
        data: req.user,
        details: {
            code: "SUCCESS",
            message: "User data fetched successfully."
        }
    });
});

router.post("/user/me", auth, async (req, res) => {
    try {
        let code = "SUCCESS", 
            message = "User data fetched successfully", 
            data = req.user;
        data.newToken = req.newToken;
        res.send(getSuccess({ code, message, data }));
    } catch (e) {
        res.status(500).send(getError({
            code: "AUTH_ERROR", 
            message: "Token authentication failed."
        }));
    }
});

router.post("/user/logout", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.tokens = user.tokens.filter((token) => token.token !== req.cookies.refreshToken);
        await user.save();

        res.cookie("token", "", tokenOptions);
        res.cookie("refreshToken", "", refreshTokenOptions);

        res.send(getSuccess({ message: "Logged out successfully" }));
    } catch (e) {
        res.status(500).send(getError({
            code: "LOGOUT_ERR", 
            message: "User logout failed. Please try again."
        }));
    }
});

router.post("/user/logoutAll", auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: decoded._id });
        user.tokens = [];
        await user.save();

        res.cookie("token", "", tokenOptions);

        res.send({
            success: true,
            data: {},
            details: {
                code: "SUCCESS",
                message: "Logged out successfully from all devices."
            }
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            details: {
                code: "INTERNAL_ERROR",
                message: "User log-out from all devices failed. Please try again."
            }
        });
    }
});

router.patch("/user/me", auth, async (req, res) => {
    const allowed = ["name","email","password"];
    try {
        const changing = Object.keys(req.body);
        const flag = changing.every((key) => allowed.includes(key));
        if(!flag) res.status(400).send("Invalid key used!");
        const user = await User.findById(req.user._id);
        changing.forEach(key => user[key] = req.body[key]);
        await user.save();
        res.send({
            success: true,
            data: user,
            details: {
                code: "SUCCESS",
                message: "User data edited successfully."
            }
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            details: {
                code: "INTERNAL_ERROR",
                message: "User data edit failed. Please try again."
            }
        });
    }
});

router.delete("/user/me", auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: decoded._id });
        await user.deleteOne();
        res.send({
            success: true,
            data: user,
            details: {
                code: "SUCCESS",
                message: "User data deleted successfully."
            }
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            details: {
                code: "INTERNAL_ERROR",
                message: "User data delete failed. Please try again."
            }
        });
    }
});

router.get("/users", auth, async (req, res) => {
    try {
        // const users = await User.find({});
        // res.send(users);
        throw "NOT ALLOWED"
    } catch (e) {
        res.status(500).send({
            success: false,
            details: {
                code: "INTERNAL_ERROR",
                message: "Users data read failed. Please try again."
            }
        });
    }
});

router.get("/", async (req, res) => {
    res.send("Welcome to User Authentication app!");
});

export default router;