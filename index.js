const express = require("express");
const app = express();
require('dotenv').config();
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require('mongodb');
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhxur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = process.env.PORT || 8000;
app.get('/', (req, res) => {
    res.send('Running Jewellery site')
});



async function run() {
    try {
        await client.connect();
        const database = client.db("jewellery");
        const productsCollection = database.collection("products");
        const goldCollection = database.collection("gold");
        const diamondCollection = database.collection('diamond');
        const stoneCollection = database.collection('others');
        const addOrdersCollection = database.collection('orders');
        const reviewCollection = database.collection('review');
        // get api for all product
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        app.post('/products', async (req, res) => {
            const product = req.body;
            const resultP = await productsCollection.insertOne(product);
            console.log(resultP);
            res.json(resultP)
        });
        //get api for gold products
        app.get('/gold', async (req, res) => {
            const cursor = goldCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        //get api for diamond products

        app.get('/diamond', async (req, res) => {
            const cursor = diamondCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        //get api for other products

        app.get('/others', async (req, res) => {
            const cursor = stoneCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        // //add product
        app.post('/orders', async (req, res) => {
            const product = req.body;
            const resultP = await addOrdersCollection.insertOne(product);
            console.log(resultP);
            res.json(resultP)
        });
        //get orders
        app.get('/orders', async (req, res) => {
            const cursor = addOrdersCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });
        // get api for all product
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        app.post('/review', async (req, res) => {
            const review = req.body;
            const resultR = await reviewCollection.insertOne(review);
            console.log(resultR);
            res.json(resultR);
        });
        //delete api
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addOrdersCollection.deleteOne(query);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);
app.listen(port, () => {
    console.log('Running ', port);
})