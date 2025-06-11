// const mongoose = require("mongoose");

// // mongoose.connect("mongodb://127.0.0.1:27017/ult-userauth-api");
// const user = encodeURIComponent("ult-userAuth");
// const pass = encodeURIComponent("mzqh4S4DsSriBA0o");
// const dbName = encodeURIComponent("ult-userauth-api");
// const uri = "mongodb+srv://"+user+":"+pass+"@clusterultimateutility.zkpdpon.mongodb.net/?retryWrites=true&w=majority&appName=ClusterUltimateUtility";

// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } 
//   catch (e) {
//     console.log(e);
//   }
//   finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ult-userAuth:mzqh4S4DsSriBA0o@clusterultimateutility.zkpdpon.mongodb.net/?retryWrites=true&w=majority&appName=ClusterUltimateUtility";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
