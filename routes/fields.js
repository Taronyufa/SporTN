var express = require('express');
var app = express();

app.use(express.json());

app.use(express.urlencoded());


app.get('/', function(req, res) {
    // take all the fields from the database

    // this is just a placeholder for the database
    var fields = [
        {
            field_id: 1,
            name: 'Field 1',
            location: 'Location 1',
            image_url: 'https://via.placeholder.com/150',
            google_maps_link: 'https://www.google.com/maps',
            is_available: true,
            sports_supported: ['Soccer', 'Basketball']
        },
        {
            field_id: 2,
            name: 'Field 2',
            location: 'Location 2',
            image_url: 'https://via.placeholder.com/150',
            google_maps_link: 'https://www.google.com/maps',
            is_available: false,
            sports_supported: ['Tennis', 'Volleyball']
        },
        {
            field_id: 3,
            name: 'Field 3',
            location: 'Location 3',
            image_url: 'https://via.placeholder.com/150',
            google_maps_link: 'https://www.google.com/maps',
            is_available: true,
            sports_supported: ['Soccer', 'Basketball', 'Volleyball']
        },
    ]

    res.send(fields);
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

        // this is just a placeholder for the database
        var field = {
            field_id: 4,
            name: data.name,
            location: data.location,
            image_url: data.image_url,
            google_maps_link: data.google_maps_link,
            is_available: data.is_available,
            sports_supported: data.sports_supported
        };

        res.send(field);
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
        // get the fiels from the database

        // this is just a placeholder for the database
        var field = {
            field_id: id,
            name: 'Field ' + id,
            location: 'Location 1',
            image_url: 'https://example.com/image',
            google_maps_link: 'https://www.google.com/maps',
            is_available: true,
            sports_supported: ['Soccer', 'Basketball']
        }
        res.send(field);
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

        // this is just a placeholder for the database
        var deleted = true;

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

            var modified = true;

            if (modified) {
                // this is just a placeholder for the database
                var field = {
                    field_id: id,
                    name: data.name,
                    location: data.location,
                    image_url: data.image_url,
                    google_maps_link: data.google_maps_link,
                    is_available: data.is_available,
                    sports_supported: data.sports_supported
                };

                res.send(field);
            } else {
                res.status(404).send('Field not found');
            }

            
        }
    }
});


module.exports = app;
