const express = require("express");
require("dotenv").config();
const userRouter = require("./src/routers/user");
const ssoRouter = require("./src/routers/SSO");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./src/db/mongoose");

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
    "http://localhost:3000",
    "https://ultimate-utility.web.app",
    "https://ult-trackingbudget.onrender.com"
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        // console.log(origin);
        if(!origin) return callback(null, true);

        if(allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use(userRouter);
app.use(ssoRouter);

app.listen(port, () => {
    console.log("Ultimate Utility user auth server is up on port", port);
});