const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  // console.log(`${req.cookies.token}`);
  try {
    const token = req.cookies.token || req.body.token;
    // console.log("token", req.body)
    // if(req.body && req.body.token) {
    //     console.log("Step 1 success", req.body.token, token);
    // }

    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_Secret);
    // console.log("decoded", decoded)
    const user = await User.findOne({
      "_id": decoded._id,
      "tokens.token": token,
    });
    // console.log("user from auth.js", user);
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({error: "Please authenticate."});
  }
};

module.exports = auth;
