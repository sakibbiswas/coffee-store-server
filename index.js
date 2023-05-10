const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors())
app.use(express.json())
// console.log(process.env.db_users);



const uri = `mongodb+srv://${process.env.db_users}:${process.env.db_pass}@cluster0.yk6uldw.mongodb.net/?retryWrites=true&w=majority`;
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
        const database = client.db("coffeeDB");
        const coffecolection = database.collection("coffee")


        app.post('/coffee', async (req, res) => {
            const Newcoffee = req.body;
            console.log(Newcoffee);
            const result = await coffecolection.insertOne(Newcoffee);
            res.send(result)
        })
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const updatedcoffee = req.body
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const coffee = {
                $set: {
                    name: updatedcoffee.name,
                    quantity: updatedcoffee.quantity,
                    Supplier: updatedcoffee.Supplier,
                    Taste: updatedcoffee.Taste,
                    Category: updatedcoffee.Category,
                    Details: updatedcoffee.Details,
                    photourl: updatedcoffee.photourl,

                },
            };
            const result = await coffecolection.updateOne(filter, coffee, options);
            res.send(result)

        })

        app.get('/coffee', async (req, res) => {
            const cursor = coffecolection.find();
            const result = await cursor.toArray()
            res.send(result)

        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffecolection.findOne(query);
            res.send(result);
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id);
            const query = { _id: new ObjectId(id) };
            const result = await coffecolection.deleteOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);


app.get('/', (req, res) => {
    res.send('coffee making is running')
})

app.listen(port, () => {
    console.log(` coffee API is running  on port : ${port}`)
})