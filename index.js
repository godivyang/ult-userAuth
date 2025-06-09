const express = require("express");
const userRouter = require("./src/routers/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./src/db/mongoose");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use(userRouter);

app.listen(port, () => {
    console.log("Ultimate Utility user auth server is up on port", port);
});