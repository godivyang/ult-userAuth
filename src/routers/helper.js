const express = require("express");
const router = new express.Router();
const helperAuth = require("../middleware/helperAuth");
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
  }),
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
    console.log(req.userId, req.email, req.userName);
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