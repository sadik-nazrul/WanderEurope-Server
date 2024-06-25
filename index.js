const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5007;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('WanderEurope is Starting NOW');
});


// MongoDB Code Start

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nymxsdl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const wanderEuropeDb = client.db('wanderEurope');
const places = wanderEuropeDb.collection('places');
const subscriber = wanderEuropeDb.collection('subscriber');

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Places API
        // Get places
        app.get('/places', async (req, res) => {
            const cursor = places.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get place
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await places.findOne(query);
            res.send(result);
        });

        // Add place
        app.post('/places', async (req, res) => {
            const newPlace = req.body;
            const place = {
                thumb: newPlace.thumb,
                spotName: newPlace.spotName,
                country: newPlace.country,
                location: newPlace.location,
                cost: newPlace.cost,
                seasonality: newPlace.seasonality,
                shortDesc: newPlace.shortDesc,
                userEmail: newPlace.userEmail,
                userName: newPlace.userName,
            }
            const places = wanderEuropeDb.collection('places');
            const result = await places.insertOne(place);
            res.send(result);
        });

        // update place
        app.put('/updateplace/:id', async (req, res) => {
            const id = req.params.id;
            const updatePlace = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const place = {
                $set: {
                    thumb: updatePlace.thumb,
                    spotName: updatePlace.spotName,
                    country: updatePlace.country,
                    location: updatePlace.location,
                    cost: updatePlace.cost,
                    seasonality: updatePlace.seasonality,
                    shortDesc: updatePlace.shortDesc,
                }
            }
            const result = await places.updateOne(filter, place, options);
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
run().catch(console.log);


app.listen(port, () => {
    console.log(`WanderEurope Listening from port ${port}`);
});