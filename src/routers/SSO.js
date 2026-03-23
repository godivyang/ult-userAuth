import express from "express";
const router = new express.Router();
import SSO from "../models/SSO.js";
import auth from "../middleware/auth.js";
import { getError, getSuccess } from "../middleware/response.js";

router.get("/sso/crossAppLogin", auth, async (req, res) => {
    try {
        // code is the object id for the sso token that is getting generated
        const code = await SSO.generateSSOToken(req.user._id.toString(), req.token);

        res.send(getSuccess({
            data: { code },
            code: "SUCCESS",
            message: "SSO token generated successfully."
        }));

    } catch (e) {
        // console.log(e.message, req.user)
        res.status(500).send(getError({
            code: "AUTH_ERROR",
            message: "SSO token generation failed. Please try again."
        }));
    }
});

router.post("/sso/crossAppLogin", async (req, res) => {
    try {
        const token = await SSO.verifySSOToken(req.body.code);
        res.send(getSuccess({
            message: "SSO token varified successfully.",
            data: token
        }));
    } catch (e) {
        res.status(500).send(getError({
            code: "AUTH_ERROR",
            message: "Token was not found."
        }));
    }
});

export default router;