const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ssoSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userToken: {
        type: String,
        required: true
    }
});

ssoSchema.statics.generateSSOToken = async function(userID, userToken) {
    try {
        const token = jwt.sign(
            { _id: userID }, 
            process.env.JWT_SECRET_SSO, 
            { expiresIn: 120 });
        
        // console.log("sso token", token, userID);
        const ssoToken = new SSO({ token, userToken });
        await ssoToken.save();
        // console.log("sso token", token);
        return ssoToken._id;
    } catch (e) {
        // console.log("error while creating sso token", e);
        throw new Error({message: "Error: SSO token generation failed!"});
    }
};

ssoSchema.statics.verifySSOToken = async function(code) {
    try {
        // console.log(code)
        const sso = await SSO.findById(code);
        // console.log(sso);
        if(jwt.verify(sso.token, process.env.JWT_SECRET_SSO)) {
            // console.log(sso)
            await sso.deleteOne();
            return sso.userToken;
        }
        throw new Error();
    } catch (e) {
        throw new Error({message: "Error: SSO token verification failed!"});
    }
}

const SSO = mongoose.model("SSO", ssoSchema);

module.exports = SSO;