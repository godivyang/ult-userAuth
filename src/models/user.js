const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
            required: true
        }
    }]
});

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

userSchema.methods.generateToken = async function() {
    const token = jwt.sign(
        { _id: this._id.toString() }, 
        "awakening_ult_userauth", 
        { expiresIn: "1w" });
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

userSchema.methods.toJSON = function() {
    let userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject._id;
    return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;