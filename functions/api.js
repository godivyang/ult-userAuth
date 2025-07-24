const express = require("express");
require("dotenv").config();
const userRouter = require("./src/routers/user");
const ssoRouter = require("./src/routers/SSO");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./src/db/mongoose");

const app = express();

const allowedOrigin = process.env.ULTIMATE_UTILITY_FRONTEND_URL;
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    console.log(origin);
    if (!origin) return callback(null, true);

    if (allowedOrigin === origin) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/sso", ssoRouter);

console.log("JWT_SECRET:", process.env.JWT_SECRET);

module.exports = app;
