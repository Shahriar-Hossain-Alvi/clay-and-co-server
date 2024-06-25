require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



// start mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfte2wh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

    //create a database in mongoDB 
    //DB name = artAndCraftDB, DBcollection = artAndCraft
    const artAndCraftsCollection = client.db('artAndCraftDB').collection('artAndCraft');

    //create/send data to the DB from client side
    app.post("/craftItem", async (req, res) => {
      const newCraftItem = req.body;
      console.log('New craft item added', newCraftItem);

      const result = await artAndCraftsCollection.insertOne(newCraftItem);
      res.send(result);
    })

    //show data in the api link
    app.get("/craftItem", async (req, res) => {
      const cursor = artAndCraftsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //show a specific user in the api link
    app.get("/craftItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await artAndCraftsCollection.findOne(query);
      res.send(result);
    })

    //delete an item
    app.delete('/craftItem/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      //delete a data using id
      const query = { _id: new ObjectId(id) }
      const result = await artAndCraftsCollection.deleteOne(query);
      res.send(result);
    })

    //get the names of all subcategory
    app.get('/subCategory', async (req, res) => {
      const pipeline = [
        {
          $group: {
            _id: '$subCategory'
          }
        },
        {
          $project: {
            _id: 0,
            subCategory: '$_id'
          }
        }
      ];

      const result = await artAndCraftsCollection.aggregate(pipeline).toArray();
      res.send(result);
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





app.get('/', (req, res) => {
  res.send('Clay & Co. server is running');
})

app.listen(port, () => {
  console.log(`Clay & Co. server is running at port ${port}`);
})
