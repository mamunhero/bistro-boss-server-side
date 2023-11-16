const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');


// midelware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clf7ui5.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
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
    // databage er nam and collection
    const database = client.db("BistroDb");
    const menuCollection = database.collection("menu");
    const reviewCollection = database.collection("reviews");
    const cartCollection = database.collection("carts");
    // menu get 
    app.get("/menu", async (req, res)=> {
      const result = await menuCollection.find().toArray();
      res.send(result);
      console.log("menu data", result);
    })
    // menu get 
    app.get("/reviews", async (req, res)=> {
      const result = await reviewCollection.find().toArray();
      res.send(result);
      console.log("review data", result);
    })
    // carts
    app.post("/carts", async(req, res)=> {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
      console.log("cart item added to database section name cartcollection", result);
    })
    // carts get
    app.get("/carts", async(req,res)=> {
      const email = req.query.email;
      const query = {email:email}
      const result = await cartCollection.find(query).toArray();
      res.send(result);
      console.log("cart item show ui", result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get("/", (req, res)=> {
  res.send("Boss is Sitting")
})

app.listen(port, ()=> {
  console.log(`Bistro boss is sitting on port ${port}`);
})  

