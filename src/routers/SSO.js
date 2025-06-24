const express = require("express");
const router = new express.Router();
const SSO = require("../models/SSO");
const auth = require("../middleware/auth");

router.get("/sso/crossAppLogin", auth, async (req, res) => {
    try {
        // console.log("SSO router", req.user);
        // code is the object id for the sso token that is getting generated
        const code = await SSO.generateSSOToken(req.user._id.toString(), req.cookies.token);
// console.log("token", token);
        res.send({ code });
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post("/sso/crossAppLogin", async (req, res) => {
    try {
        const token = await SSO.verifySSOToken(req.body.code);
        res.send(token);
    } catch (e) {
        res.status(500).send({message: "Error: Token was not found."})
    }
});

module.exports = router;