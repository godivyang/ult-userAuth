import express from "express";
import "dotenv/config";
import userRouter from "./src/routers/user.js";
import ssoRouter from "./src/routers/SSO.js";
import helperRouter from "./src/routers/helper.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./src/db/mongoose.js";

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [process.env.ULTIMATE_UTILITY_FRONTEND_URL, process.env.TYPING_BLISS_FRONTEND_URL];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
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
app.use(helperRouter);

app.listen(port, () => {
    console.log("Ultimate Utility user auth server is up on port", port);
});