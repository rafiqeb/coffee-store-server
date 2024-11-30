// 1st kaj
const express = require('express')
const cors = require('cors')

// 6th kaj
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// 2nd kaj
const app = express();
const port = process.env.PORT || 5000;

// 3rd kaj midlewere
app.use(cors())
app.use(express.json())

// 4th kaj
app.get('/', (req, res) => {
    res.send('Coffee store server is running')
})

// 6th kaj copy kore nia asha and username, password thik kora
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rlm7g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        // database e save kora
        const coffeeCollection = client.db('coffeeDB').collection('coffee')
        const userCollection = client.db('coffeeDB').collection('users')

        // 2nd kaj get kora/ read kora
        app.get('/coffee', async(req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // 4th kaj id shohokare pawa
        app.get('/coffee/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })
        
        // 1st kaj post kora/ create kora
        app.post('/coffee', async(req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee)
            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
        })

        // 5th kaj update kora/put kora
        app.put('/coffee/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = {upsert: true};
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    supply: updatedCoffee.supply,
                    category: updatedCoffee.category,
                    photo: updatedCoffee.photo,
                    quantity: updatedCoffee.quantity,
                    taste: updatedCoffee.taste,
                    details: updatedCoffee.details
                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result)
        })

        // 3rd kaj delete kora
        app.delete('/coffee/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })

        // User related Api

        app.get('/users', async(req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/users', async(req, res) => {
            const newUser = req.body;
            console.log(newUser)
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })

        app.patch('/users', async(req, res) => {
            const email = req.body.email;
            const filter = {email}
            const updatedDoc = {
                $set: {
                    lastSignInTime: req.body?.lastSignInTime
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        app.delete('/users/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// 5th kaj shesh chaking er jonno
app.listen(port, () => {
    console.log(`Coffee store server is running: ${port}`)
})