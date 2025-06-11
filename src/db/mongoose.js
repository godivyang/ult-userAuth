// const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/ult-userauth-api");


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const password = encodeURIComponent("#9qr2rgyuGOD");
// const db = "ult-userauth-api";
// const uri = "mongodb+srv://ult-userAuth:"+password+"@clusterultimateutility.zkpdpon.mongodb.net/?retryWrites=true&w=majority&appName=ClusterUltimateUtility";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     console.log("client")
//     await client.connect();
//     console.log("client")
//     // Send a ping to confirm a successful connection
//     await client.db("ult-userauth-api").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run()
// run().catch(console.dir);


const mongoose = require('mongoose');
const password = encodeURIComponent("H2n3yeVzhVKEaDpw");
const uri = `mongodb+srv://ult-userAuth:${password}@clusterultimateutility.zkpdpon.mongodb.net/?retryWrites=true&w=majority&appName=ClusterUltimateUtility`;

const clientOptions = { 
    serverApi: { 
        version: '1', 
        strict: true, 
        deprecationErrors: true 
    },
    dbName: "ult-user-auth"
};

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);

const dns = require('dns');

dns.lookup('cluster0.zkpdpon.mongodb.net', (err, address, family) => {
  if (err) {
    console.error('❌ DNS lookup failed:', err.message);
  } else {
    console.log(`✅ DNS resolved: ${address}, IPv${family}`);
  }
});
