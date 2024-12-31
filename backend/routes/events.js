var express = require('express');
var app = express();

// connection to the db and get the event collection
const { ObjectId } = require('mongodb');
var client = require('../connection.js');
var coll = client.getDb().collection('evento');
const { checkAdmin } = require('../middleware/auth');

app.use(express.json());

app.use(express.urlencoded());


app.get('/', async (req, res) => {
    // take the events from the database
    var events = await getAllEvents();

    if(events){ 
        res.send(events);
    }
});

app.post('/', checkAdmin, async (req, res) => {
    // get all the data from the request
    var data = req.body;

    // validate the data
    if (!data.name) {
        // if name is not provided, return a 400 error
        res.status(400).send('name is required');
    } else if (!data.location) {
        // if location is not provided, return a 400 error
        res.status(400).send('location is required');
    } else if (!data.start_datetime) {
        // if date is not provided, return a 400 error
        res.status(400).send('start datetime is required');
    } else if (!data.end_datetime) {
        // if date is not provided, return a 400 error
        res.status(400).send('end datetime is required');
    } else if (!data.description) {
        // if description is not provided, return a 400 error
        res.status(400).send('description is required');
    } else {
        
        var event = {
            nome: data.name,
            posizione: data.location,
            data_inizio: data.start_datetime,
            data_fine: data.end_datetime,
            foto_url: data.image_url,
            descrizione: data.description,
        };

        // add the event to the database
        var result = await addEvent(event);

        if(result){
            res.status(201).send(event);
        } else {
            res.status(500).send('Error adding event');
        }
    }
});

app.get('/:id', async (req, res) => {
    var id = req.params.id;

    // this is just a placeholder for the database
    var event = await getEventById(id);

    if(event){
        res.send(event);
    } else {
        res.status(404).send('Event not found');
    }
});

app.delete('/:id', checkAdmin, async (req, res) => {
    var id = req.params.id;

    // delete the public event from the database       
    var deleted = await deleteEventById(id);

    if (deleted) {
        res.send('Event deleted');
    } else {
        res.status(404).send('Event not found');
    }
});


// all the function needed to implement the api
async function getAllEvents() {
    try {
        const events = await coll.find({}).toArray(); 
        return events;
    } catch (error) {
        console.error("Error fetching event:", error);
        return false;
    }
}

async function getEventById(eventId) {
    try {
        const event = await coll.findOne({ _id: new ObjectId(eventId) });
        return event;
    } catch (error) {
        console.error("Error fetching event:", error);
        return false;
    }
}

async function addEvent(eventData) {
    try {
        const result = await coll.insertOne(eventData);  
        return result;
    } catch (error) {
        console.error("Error adding event:", error);
        return false;
    }
}

async function deleteEventById(eventId) {
    try {
        const result = await coll.deleteOne({ _id: new ObjectId(eventId) });

        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting event:", error);
        return false;
    }
}

module.exports = app;
