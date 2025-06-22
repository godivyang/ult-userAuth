const express = require("express");
const router = new express.Router();
const SSO = require("../models/SSO");
const auth = require("../middleware/auth");

router.get("/sso/crossAppLogin", auth, async (req, res) => {
    try {
        const token = await SSO.generateSingleSignOnToken(req.user._id.toString());
console.log("token", token);
        res.send({ token });
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;