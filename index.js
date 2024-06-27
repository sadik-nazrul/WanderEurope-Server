const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5007;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('WanderEurope is Starting NOW');
});


// MongoDB Code Start

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nymxsdl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Places API
const wanderEuropeDb = client.db('wanderEurope');
const places = wanderEuropeDb.collection('places');
const subscriber = wanderEuropeDb.collection('subscriber');
const countries = wanderEuropeDb.collection('countries');
const blogs = wanderEuropeDb.collection('blogs');

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();


        // Get places
        app.get('/places', async (req, res) => {
            const cursor = places.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get single place
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await places.findOne(query);
            res.send(result);
        });


        // Get places by country (case insensitive)
        app.get('/places/place/:countryname', async (req, res) => {
            const countryname = req.params.countryname;
            const cursor = places.find({ country: new RegExp(`^${countryname}$`, 'i') });
            const result = await cursor.toArray();
            res.send(result);
        });


        // Get places by username (case insensitive)
        app.get('/places/user/:username', async (req, res) => {
            const username = req.params.username;
            const cursor = places.find({ userName: new RegExp(`^${username}$`, 'i') });
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get places by username (case insensitive)
        app.get('/places/user/:username/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await places.findOne(query);
            res.send(result);
        });

        // Delete place
        app.delete('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await places.deleteOne(query);
            res.send(result);
        })

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
                time: newPlace.time,
                visitor: newPlace.visitor,
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
                    time: updatePlace.time,
                    visitor: updatePlace.visitor,
                    shortDesc: updatePlace.shortDesc,
                }
            }
            const result = await places.updateOne(filter, place, options);
            
            res.send(result);
        });



        // Coutry Api
        // Get countries
        app.get('/countries', async(req, res) => {
            const cursor = countries.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Bologs api
        // Get blogs
        app.get('/blogs', async(req, res) => {
            const cursor = blogs.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get single blog
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await blogs.findOne(query);
            res.send(result);
        });

        // Post blog
        app.post('/blogs', async(req, res) => {
            const newBlog = req.body;
            const blog = {
                featured_img: newBlog.featured_img,
                title: newBlog.title,
                content: newBlog.content
            }
            const blogs = wanderEuropeDb.collection('blogs');
            const result = await blogs.insertOne(blog);
            res.send(result);
        });

        
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