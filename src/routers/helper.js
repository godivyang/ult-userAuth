const express = require("express");
const router = new express.Router();
const helperAuth = require("../middleware/helperAuth");
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyFNBbmE2HxJeh\nJi9tpLbC+c7s0pxbd4PK3yZBYAswxTMxFrswbjEjCY0frevuCpsRBy67BHue8M+I\nvBxV+tSlDB/HSBc+ZXmMfWirlugwLz+/hhiFC6uoir1SVRpRqjwy+CvH3qGfhIFq\n4yGt3lmk8iEUAwsSXd1BG4Jyr2O+iiVPuJ4PwXMXQuV22JMuaHsdr3sltMZ4sV5G\n2zgt77iia4wJF4yoE3sA5bKIIRI1xGGxUna6E5q3umhlWJQ0Dhpyn9TIGMlZe1/8\n+2GLrOCjKjzkbUK2/2hseWvowpoFX3cPUghpdIJndDrpsd1dw3Y2uRarBuTbhnHh\nQS6Y/3hJAgMBAAECggEAEueZP+QA9QUGeMXKOqhF+5hT4nmwPhiHrel3EPEedwC0\nQMWSPR+xiS/qIp8OwQAwuoPJ7vIYooSbb39SvcDpQpUxKXFqgEX6+5JTooWcZAMc\nEBuu7i7RPAzwcLVWnC1HgzyrvyXQABRrvbpbeK72UseegdaZ3gsHYjJGrKCYZOFt\ngkMLF+ZWh+u+QU4BjEJl0ktaCIZMVUVXvCFvIjpkhfzk5r3RTjUakc3snQWmS7P3\n2A68fdnZd/Ey4OZyUuyeQlLWKmLl4Q0SoOTG34p52xmenWbOW3qG4E5eSiXa+DXB\nmTfHHtSwRBJt4A+nz0dAFXfowYFREj7mFsHYOusDhQKBgQDmXgfL3Bq+vkvPcozL\nuDuEqj5l08NZ9V8vC7Dl41+XdK7E9ilqDY2b0C0vniQ412BrEhm/+qkatxZyURhb\nUFqW9yZfA/oe4cXK1Gyc+admB4gL7bkD1DxaSEHIPc/ym86+97Z5qGH936p51a+i\nKoG1tUlzTsS7igdPazRxdTo95QKBgQDF5W0tPM6HmAhrckw1LY944t9bxVeMMSFf\nyzdM/u/PCSDW8k1oagdpZA01vsndk/4ljfO1x1Lm5GcIjmum3mLlTD46UqptIVwW\nes9MaPsY1ni0dDWe3gT9deetgph2V6DJpRpDDSMSiRsHltFhQlKZuT80xdCRohTP\nHLOzqgyKlQKBgQDh6s88hoOYEilorQ8U7n04EnkVBYLsIu2QxqdaHAzwDFclA8AD\nqHz6lELsEuu07ss41cx48IqMj4cs3wjC7F+a85Am2FCfnoyJ6J8HpvIa5kHuaNjr\nv2TcqUYR6USYyWIM+AN09cP75DBcQUp3/7WrDLmWomXfAXM/2IPazLssXQKBgAZi\n8BIMq1Ge626kQqdYsA+jqreod7nTgBM6WK+Ibq7MyZ2GNk9PVKvnCbIZVSRseUA3\nA41zQE6pQlX5WqoI9UIXIs75Cfz5naIwFm6N2MSlb0HLmktlON4BJxfnZgozq8G2\nLVHKo74eZJvrFxi/bjD91Hdchu2cQHWqpHYA3+S9AoGAUBo+wYZKxkQ30xIlY2Xm\ndBN+QvO86I8/HD/ErcuTnS0Xl4RRg54dHyjMn6Pv8hoEjfTl/4gXcSXuZkdrp7+X\nq1a4dGmhb/fEzVgNe2PpbgNR5xsdMOUbm6bQdqN5sewGZyw6XhsHlAe6/BzIEoK2\nfX6xb4bq3HnRU2YJWs5i+Bs=\n-----END PRIVATE KEY-----\n",
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
  }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const tokenOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE == "true",
    sameSite: process.env.COOKIE_SAME_SITE,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

router.post("/typingbliss/user/me", helperAuth, async (req, res) => {
    // console.log("hello")
    // console.log(req.userId, req.email, req.userName);
    const customToken = await admin.auth().createCustomToken(req.userId.toString(), {
        email: req.email,
        username: req.userName,
    });
    res.cookie("token", req.token, tokenOptions);
    res.send({token: customToken, userName: req.userName});
});

router.get("/", async (req, res) => {
    res.send("Welcome to Tracking Budget app!");
});

module.exports = router;