const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

const tokenOptions = {
    httpOnly: true,
    secure: process.env.cookie_Secure === "true",
    sameSite: process.env.cookie_SameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

router.post("/user/signup", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        await user.generateToken();

        res.cookie("token", token, tokenOptions);

        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/user/me", auth, async (req, res) => {
    res.send(req.user);
});

router.get("/user/isValid", auth, async (req, res) => {
    res.send(req.user._id);
});

router.get("/users", auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
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
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete("/user/me", auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post("/user/login", async (req, res) => {
    try {
        const user = await User.authenticate(req.body.email, req.body.password);
        const token = await user.generateToken();
        
        res.cookie("token", token, tokenOptions);
        
        return res.send(user);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.post("/user/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.send("Logged out successfully!");
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post("/user/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send("Logged out successfully from all devices!");
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;