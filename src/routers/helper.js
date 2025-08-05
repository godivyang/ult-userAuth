const express = require("express");
const router = new express.Router();
const helperAuth = require("../middleware/helperAuth");
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../../theawakening-zg-firebase-adminsdk-bp2hl-054897f916.json')),
    databaseURL: "https://theawakening-zg.firebaseio.com"
  });
}

const tokenOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE == "true",
    sameSite: process.env.COOKIE_SAME_SITE,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

router.post("/typingbliss/user/me", helperAuth, async (req, res) => {
    // console.log("hello")
    console.log(req.email, req.userName);
    const customToken = await admin.auth().createCustomToken(req.userId.toString(), {
        email: req.email,
        username: req.userName,
    });
    res.cookie("token", req.token, tokenOptions);
    res.send({token: customToken, userName: req.userName});
});

router.get("/", async (req, res) => {
    res.send("Welcome to Tracking Budget app!");
});

module.exports = router;