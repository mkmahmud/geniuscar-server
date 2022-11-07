const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();


// JWT 
const jwt = require('jsonwebtoken');

// Middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.User_Name}:${process.env.User_Password}@cluster0.cjesyyc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT (req, res, next) {
    const authoraizetionJWT = req.headers.authoraizetion;
    
    if(!authoraizetionJWT){
        res.status(401).send({message:'Unauthorizeed User status(401)'})
    }

    const userTocken = authoraizetionJWT.split(' ')[1];
    jwt.verify(userTocken, process.env.SECREET_TOCKEN, function(err, decoded){
        if(err){
            res.status(402).send('unauthroize user status(402)')
        }
        req.decoded = decoded;
        next()
    })
}


async function run() {
    try{
        const servicesCollection = client.db('geniusCar').collection('services')
        const orderCollection = client.db('geniusCar').collection('order')


        // JWT 
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const jwtTocken = jwt.sign(user, process.env.SECREET_TOCKEN, {expiresIn:'1h'})
            res.send({jwtTocken})
            console.log(user)
        })

        // get services data 
        app.get('/services', async (req, res) => {
            const query = {}
            const coursor = servicesCollection.find(query)
            const serviceData = await coursor.toArray()
            res.send(serviceData)
        })

        // Demo Data
        app.get('/demo', async (req, res) => {
            res.send('serviceData')
        })


        // Get singel Data
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = {_id: ObjectId(id)}
            const serviceOne = await servicesCollection.findOne(query)
            res.send(serviceOne)
        })



        // Get Orders
        
        app.get('/orders', verifyJWT,  async(req, res) => {

           const userDecoded = req.decoded;
           console.log('inside order', userDecoded)

            let query = {}
            if(req.query.email){
                query = {
                    email: req.query.email 
                }
            }
            const coursor = orderCollection.find(query)
            const result = await coursor.toArray()
            res.send(result)
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


app.get('/', (req, res) => {
    res.send('Hello ')
})


app.listen(port, () => {
    console.log(`Server is runing on port ${port}`)
})