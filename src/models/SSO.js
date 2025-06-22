const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ssoSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    }
});

ssoSchema.statics.generateSingleSignOnToken = async function(userID) {
    try {
        const token = jwt.sign(
            { _id: userID }, 
            process.env.JWT_Secret_SSO, 
            { expiresIn: 120 });
        
        console.log("sso token", token, userID);
        const ssoToken = new SSO({ token, userID });
        await ssoToken.save();
        console.log("sso token", token);
        return token;
    } catch (e) {
        console.log("error while creating sso token", e);
        throw new Error({message: "SSO token generation failed!"});
    }
};

const SSO = mongoose.model("SSO", ssoSchema);

module.exports = SSO;