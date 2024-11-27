var express = require('express');
var app = express();

// connection to the db and get the event collection
const { ObjectId } = require('mongodb');
var client = require('./connection.js');
var coll = client.getDb().collection('campo');

app.use(express.json());

app.use(express.urlencoded());


app.get('/', function(req, res) {
    // take all the fields from the database
    var fields = getAllFields();

    if(fields){
        res.send(fields);
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
    } else if (!data.image_url) {
        // if image_url is not provided, return a 400 error
        res.status(400).send('image_url is required');
    } else if (!data.google_maps_link) {
        // if google_maps_link is not provided, return a 400 error
        res.status(400).send('google_maps_link is required');
    } else if (!data.is_available) {
        // if is_available is not provided, return a 400 error
        res.status(400).send('is_available is required');
    } else if(data.is_available !== true && data.is_available !== false) {
        res.status(400).send('Invalid value for is_available, must be true or false');
    } else if (!data.sports_supported) {
        // if sports_supported is not provided, return a 400 error
        res.status(400).send('sports_supported is required');
    } else {
        // save the field to the database
        var field = {
            nome: data.name,
            indirizzo: data.location,
            foto_url: data.image_url,
            posizione: data.google_maps_link,
            disponibile: data.is_available,
            sport_supportati: data.sports_supported
            };

        var result = addField(field);

        if(result){
            res.status(201).send(field);
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
        // get the fields from the database
        var result = getFieldById(id);
        
        if(result){
            res.send(field);
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
        // delete the field from the database
        var deleted = deleteFieldById(id);

        if (deleted) {
            res.send('Field deleted');
        } else {
            res.status(404).send('Field not found');
        }
    }

});

app.put('/:id', function(req, res) {
    var id = req.params.id;

    // cast the id to an integer
    id = parseInt(id);

    // check if the id is a number
    if (isNaN(id)) {
        res.status(400).send('Invalid id, must be an integer');
    } else {
        // get all the data from the request
        var data = req.body;

        // validate the data
        if (!data.name) {
            // if name is not provided, return a 400 error
            res.status(400).send('name is required');
        } else if (!data.location) {
            // if location is not provided, return a 400 error
            res.status(400).send('location is required');
        } else if (!data.image_url) {
            // if image_url is not provided, return a 400 error
            res.status(400).send('image_url is required');
        } else if (!data.google_maps_link) {
            // if google_maps_link is not provided, return a 400 error
            res.status(400).send('google_maps_link is required');
        } else if (!data.is_available) {
            // if is_available is not provided, return a 400 error
            res.status(400).send('is_available is required');
        } else if(data.is_available !== true && data.is_available !== false) {
            res.status(400).send('Invalid value for is_available, must be true or false');
        } else if (!data.sports_supported) {
            // if sports_supported is not provided, return a 400 error
            res.status(400).send('sports_supported is required');
        } else {
            // update the field in the database
            var field = {
                _id: id,
                nome: data.name,
                indirizzo: data.location,
                foto_url: data.image_url,
                posizione: data.google_maps_link,
                disponibile: data.is_available,
                sport_supportati: data.sports_supported
            }
                
            var modified = updateFieldFields(id, field);
            
            if(modified){
                res.send(field);
            } else {
                res.status(404).send('Field not found');
            }
        }
    }
});


// all the function needed to implement the api
async function getAllFields() {
    try {
        const events = await coll.find({}).toArray(); 
        return events;
    } catch (error) {
        console.error("Error fetching field:", error);
        return false;
    }
}

async function getFieldById(fieldid) {
    try {
        const event = await coll.findOne({ _id: fieldid });
        return event;
    } catch (error) {
        console.error("Error fetching field:", error);
        return false;
    }
}

async function addField(fieldData) {
    try {
        const result = await coll.insertOne(fieldData);  
        return result;
    } catch (error) {
        console.error("Error adding field:", error);
        return false;
    }
}

async function updateFieldFields(fieldId, updatedFieldData) {
    try {
        const result = await coll.updateOne(
            { _id: fieldId }, 
            { $set: updatedFieldData }    
        );

        return result;
    } catch (error) {
       console.error("Error updating field:", error);
        return false;
    }
}

async function deleteFieldById(fieldid) {
    try {
        const result = await coll.deleteOne({ _id: fieldid });

        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting field:", error);
        return false;
    }
}

module.exports = app;
