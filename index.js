const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()


// Middleware
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello ')
})

app.listen(port, () => {
    console.log(`Server is runing on port ${port}`)
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.User_Name}:${process.env.User_Password}@cluster0.cjesyyc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        const servicesCollection = client.db('geniusCar').collection('services')
        const orderCollection = client.db('geniusCar').collection('order')

        // get services data 
        app.get('/services', async (req, res) => {
            const query = {}
            const coursor = servicesCollection.find(query)
            const serviceData = await coursor.toArray()
            res.send(serviceData)
        })

        // Get singel Data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = {_id: ObjectId(id)}
            const serviceOne = await servicesCollection.findOne(query)
            res.send(serviceOne)
        })


        // Order data insert
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })

    }

    catch{

    }
}

run().catch(err => console.log(err))