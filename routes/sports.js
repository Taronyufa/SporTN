var express = require('express');
var app = express();

app.use(express.json());

app.use(express.urlencoded());


app.get('/', function(req, res) {
    // take all the sports from the database

    // this is just a placeholder for the database
    var sports = {
        1: 'Tennis',
        2: 'Basketball',
        3: 'Soccer',
        4: 'Baseball',
        5: 'Golf',
    }

    res.send(sports);
});

app.post('/', function(req, res) {
    // get all the data from the request
    var data = req.body;

    // validate the data
    if (!data.name) {
        // if name is not provided, return a 400 error
        res.status(400).send('sport name is required');
    } else {
        // add the sport to the database

        // this is just a placeholder for the database
        var sport = {
            id: 6,
            name: data.name,
        };

        res.status(201).send(sport);
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
        // get the sport from the database

        // this is just a placeholder for the database
        var sport = {
            id: id,
            name: 'Soccer',
        };
        res.send(sport);
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
        // delete the sport from the database

        // this is just a placeholder for the database
        var deleted = true;

        if (deleted) {
            res.send('Sport deleted');
        } else {
            res.status(404).send('Sport not found');
        }
    }

});


module.exports = app;
