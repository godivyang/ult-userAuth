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
        res.send({
            success: true,
            data: { code },
            details: {
                code: "SUCCESS",
                message: "SSO token generated successfully."
            }
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            details: {
                code: "AUTH_FAILED",
                message: "SSO token generation failed. Please try again."
            }
        });
    }
});

router.post("/sso/crossAppLogin", async (req, res) => {
    try {
        const token = await SSO.verifySSOToken(req.body.code);
        res.send({
            success: true,
            data: token,
            details: {
                code: "SUCCESS",
                message: "SSO token verified successfully."
            }
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            details: {
                code: "AUTH_FAILED",
                message: "Token was not found."
            }
        })
    }
});

module.exports = router;