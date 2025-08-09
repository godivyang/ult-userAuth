const express = require("express");
const router = new express.Router();
const helperAuth = require("../middleware/helperAuth");
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
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
    // console.log(req.userId, req.email, req.userName);
    const customToken = await admin.auth().createCustomToken(req.userId.toString(), {
        username: req.userName,
    });
    // res.json({ customToken, userName: req.userName });
    // console.log(customToken)
    res.cookie("token", req.token, tokenOptions);
    res.send({token: customToken, userName: req.userName});
});

router.get("/", async (req, res) => {
    res.send("Welcome to Tracking Budget app!");
});

module.exports = router;