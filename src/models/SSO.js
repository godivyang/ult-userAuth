import mongoose from "mongoose";
import jwt from "jsonwebtoken";

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
        
        const ssoToken = new SSO({ token, userToken });
        await ssoToken.save();
        return ssoToken._id;
    } catch (e) {
        throw new Error({message: "Error: SSO token generation failed!"});
    }
};

ssoSchema.statics.verifySSOToken = async function(code) {
    try {
        // console.log(code)
        const sso = await SSO.findById(code);
        // console.log(sso);
        await sso.deleteOne();
        if(jwt.verify(sso.token, process.env.JWT_SECRET_SSO)) {
            // console.log(sso)
            return sso.userToken;
        }
        throw new Error();
    } catch (e) {
        throw new Error({message: "Error: SSO token verification failed!"});
    }
}

const SSO = mongoose.model("SSO", ssoSchema);

export default SSO;