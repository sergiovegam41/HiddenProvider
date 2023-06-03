const express = require('express')
require('dotenv').config()

const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
const path = require('path');
const cors = require('cors');
const fs = require('fs');


const corsOptions = {
    origin: '*', // dominio permitido
    methods: ['GET', 'POST', 'PUT'] // métodos HTTP permitidos
};
app.use(cors(corsOptions)); 


const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const DATABASE = process.env.MONGO_DATABASE || "HiddenProvider" 
const uriMongo = process.env.MONGO_URI;



const Mongoclient = new MongoClient(uriMongo, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var HiddenCollection = null
var ConfigCollection = null


Mongoclient.connect( async err => {
   
    HiddenCollection = Mongoclient.db(DATABASE).collection("Hidden");
    ConfigCollection = Mongoclient.db(DATABASE).collection("Config");
    if(err){ console.log(err) } else {
        this.ready = true
    }


    console.log("Mongo Conectado a: "+DATABASE);


    
    app.get('/ping', async function(req, res) {
        res.send(true)    
    })

    app.get('/', async function(req, res) {
 
        await HiddenCollection.insertOne({ request:req.headers });
        let file_url = await ConfigCollection.findOne({ name: "file_url" })


        res.redirect(file_url.value)
    })



    app.listen(port,() => {

        console.log(`La aplicación está corriendo en el puerto: ${port}`);
    
    });
});

const port = process.env.PORT || 3000   


