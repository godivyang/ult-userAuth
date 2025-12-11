import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required to sign up!"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: (props) => `${props.value} is an invalid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate: {
            validator: (value) => !value.toLowerCase().includes("password"),
            message: (props) => `${props.value} should not contain "password"`
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        }
    }]
});

userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
});

userSchema.statics.authenticate = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user) throw new Error("User email and password did not match!");
    const match = await bcryptjs.compare(password, user.password);
    if(!match) throw new Error("User email and password did not match!");
    return user;
};

userSchema.methods.toJSON = function() {
    let userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject._id;
    return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;