const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI;
const user = process.env.MONGO_ATLAS_ID;
const password = process.env.MONGO_ATLAS_PASSWORD;

const atlas_uri = `mongodb+srv://${user}:${password}@cluster0.3m4yenq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(atlas_uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    
    const database = client.db('Hospital');
    const Patients = database.collection('Patients');
    return { Patients };
  } 
  catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
}

module.exports = connectDB;