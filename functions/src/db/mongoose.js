const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

const clientOptions = {serverApi: {
  version: "1",
  strict: true,
  deprecationErrors: true,
}};

/**
 * Connects to MongoDB using Mongoose and pings the server.
 */
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object
    // to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ping: 1});
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
run().catch(console.dir);

