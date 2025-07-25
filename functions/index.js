const functions = require("firebase-functions");
require("firebase-functions/logger/compat");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = require("./api");

// Export the express app as an HTTP function
exports.api = functions.https.onRequest(app);
