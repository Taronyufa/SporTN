
const { MongoClient, ServerApiVersion } = require('mongodb');

// get uri from .env file
require('dotenv').config();
const uri = process.env.MONGODB_URI;

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
        if (isConnected()) {
            console.log("Il client è già connesso a MongoDB.");
            return;
        }

        // Connette il client al server
        await client.connect();

        // Verifica la connessione con un comando ping
        await client.db("Sportn").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        
    } catch (error) {
        console.error("Errore durante la connessione a MongoDB:", error);
        throw error;
    }
}

function isConnected() {
    return !!client && !!client.topology && client.topology.isConnected()
}

function getDb() {
    return client.db("Sportn");
}

module.exports = {getDb};

run().catch(console.dir);
