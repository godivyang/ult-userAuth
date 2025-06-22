const express = require("express");
const router = new express.Router();
const SSO = require("../models/SSO");
const auth = require("../middleware/auth");

router.get("/user/crossAppLogin", auth, async (req, res) => {
    try {
        const sso = await SSO.generateSingleSignOnToken(req.user._id);

        res.send(sso);
    } catch (e) {
        res.send(e);
    }
});

module.exports = router;