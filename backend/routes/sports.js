var express = require('express');
var app = express();

// connection to the db and get the sport collection
const { ObjectId } = require('mongodb');
var client = require('../connection.js');
var coll = client.getDb().collection('sport');
const { checkAdmin } = require('../middleware/auth');

app.use(express.json());

app.use(express.urlencoded());


app.get('/', async (req, res) => {
    // take all the sports from the database
    var sports = await getAllSports();

    if(sports){
        res.send(sports);
    }
});

app.post('/', checkAdmin, async (req, res) => {
    // get all the data from the request
    var data = req.body;

    // validate the data
    if (!data.name) {
        // if name is not provided, return a 400 error
        res.status(400).send('sport name is required');
    } else {
        
        var sport = {
            nome: data.name,
        };

        // add the sport to the database
        var result = await addSport(sport);

        if(result){
            res.status(201).send(sport);
        }
    }
});

app.get('/:id', async (req, res) => {
    var id = req.params.id;

    // get the sport from the database
    var sport = await getSportById(id);
    
    if(sport){
        res.status(200).send(sport);
    } else {
        res.status(404).send('Sport not found');
    }
});

app.delete('/:id', checkAdmin, async (req, res) => {
    var id = req.params.id;

    // delete the sport from the database
    var deleted = await deleteSportById(id);

    if (deleted) {
        res.send('Sport deleted');
    } else {
        res.status(404).send('Sport not found');
    }

});

// all the function needed to implement the api
async function getAllSports() {
    try {
        const sports = await coll.find({}).toArray();
        return sports;
    } catch (error) {
        console.error("Error fetching sport:", error);
        return false;
    }
}

async function getSportById(sportId) {
    try {
        const event = await coll.findOne({ _id: new ObjectId(sportId) });
        return event;
    } catch (error) {
        console.error("Error fetching sport:", error);
        return false;
    }
}

async function addSport(sportData) {
    try {
        const result = await coll.insertOne(sportData); 
        return result;
    } catch (error) {
        console.error("Error adding sport:", error);
        return false;
    }
}

async function deleteSportById(sportId) {
    try {
        const result = await coll.deleteOne({ _id: new ObjectId(sportId) });

        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting sport:", error);
        return false;
    }
}

module.exports = app;
