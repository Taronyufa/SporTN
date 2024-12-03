var express = require('express');
var app = express();

// connection to the db and get the event collection
const { ObjectId } = require('mongodb');
var client = require('../connection.js');
var coll = client.getDb().collection('evento');

app.use(express.json());

app.use(express.urlencoded());


app.get('/', function(req, res) {
    // take the events from the database
    var events = getAllEvents();

    if(events){ 
        res.send(events);
    }
});

app.post('/', function(req, res) {
    // get all the data from the request
    var data = req.body;

    // validate the data
    if (!data.name) {
        // if name is not provided, return a 400 error
        res.status(400).send('name is required');
    } else if (!data.location) {
        // if location is not provided, return a 400 error
        res.status(400).send('location is required');
    } else if (!data.start_date) {
        // if date is not provided, return a 400 error
        res.status(400).send('date is required');
    } else if (new Date(data.start_date).toISOString() === 'Invalid Date') {
        // if the date is not a valid date, return a 400 error
        res.status(400).send('Invalid date format');
    } else if (!data.end_date) {
        // if date is not provided, return a 400 error
        res.status(400).send('date is required');
    } else if (new Date(data.end_date).toISOString() === 'Invalid Date') {
        // if the date is not a valid date, return a 400 error
        res.status(400).send('Invalid date format');
    } else if (!data.end_time) {
        // if time is not provided, return a 400 error
        res.status(400).send('time is required');
    } else if (new Date(data.end_time) === 'Invalid Date') {
        // if the time is not a valid time, return a 400 error
        res.status(400).send('Invalid time format');
    } else {
        
        var event = {
            nome: data.name,
            posizione: data.location,
            data_inizio: data.start_date,
            data_fine: data.end_date,
            foto_url: data.image_url,
            descrizione: data.description,
        };

        // add the event to the database
        var result = addEvent(event);

        if(result){
            res.status(201).send(event);
        }
    }
});

app.get('/:id', function(req, res) {
    var id = req.params.id;

    // cast the id to an integer
    id = parseInt(id);

    // check if the id is a number
    if (isNaN(id)) {
        res.status(400).send('Invalid id, must be an integer');
    } else {

        // this is just a placeholder for the database
        var event = getEventById(id);

        if(event){
            res.send(event);
        }
    }

});

app.delete('/:id', function(req, res) {
    var id = req.params.id;

    // cast the id to an integer
    id = parseInt(id);

    // check if the id is a number
    if (isNaN(id)) {
        res.status(400).send('Invalid id, must be an integer');
    } else {
        // delete the public event from the database       
        var deleted =  deleteEventById(id);

        if (deleted) {
            res.send('Event deleted');
        } else {
            res.status(404).send('Event not found');
        }
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
        const event = await coll.findOne({ _id: eventId });
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
        const result = await coll.deleteOne({ _id: eventId });

        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting event:", error);
        return false;
    }
}

module.exports = app;
