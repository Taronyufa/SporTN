var express = require('express');
var app = express();

app.use(express.json());

app.use(express.urlencoded());

app.get('/', function(req, res) {
    var public_only = req.query.public_only;
    var user_id = req.query.user_id;

    // cast public_only to a boolean
    if (public_only) {
        if (public_only === 'true' || public_only === 'True' || public_only === '1') {
            public_only = true;
        } else if (public_only === 'false' || public_only === 'False' || public_only === '0') {
            public_only = false;
        } else {
            res.status(400).send('Invalid value for public_only, must be true or false');
        }
    }

    // cast user_id to an integer, if it exists, if it is not a number, return a 400 error
    if (user_id) {
        user_id = parseInt(user_id);
        if (isNaN(user_id)) {
            res.status(400).send('Invalid value for user_id, must be an integer');
        }
    }

    // take the reservations from the database, and filter them with the query parameters

    // this is just a placeholder for the database
    var reservations = [
        { 
            id: 1,
            user_id: 1,
            field_id: 1,
            field_name: 'Field 1',
            date: '2020-01-01',
            start_time: '12:00',
            end_time: '14:00',
            participants: 4,
            is_public: true,
            sport: 'Tennis'
        },
        { 
            id: 2,
            user_id: 2,
            field_id: 3,
            field_name: 'Field 3',
            date: '2020-01-02',
            start_time: '13:00',
            end_time: '14:00',
            participants: 1,
            is_public: false,
            sport: 'Basketball'
        },
        { 
            id: 3,
            user_id: 2,
            field_id: 5,
            field_name: 'Field 5',
            date: '2020-01-03',
            start_time: '14:00',
            end_time: '14:00',
            participants: 6,
            is_public: true,
            sport: 'Soccer'
        },
        { 
            id: 4,
            user_id: 3,
            field_id: 1,
            field_name: 'Field 1',
            date: '2020-01-04',
            start_time: '15:00',
            end_time: '14:00',
            participants: 1,
            is_public: false,
            sport: 'Volleyball'
        }
    ];

    res.send(reservations);
});

app.post('/', function(req, res) {
    // get all the data from the request
    var data = req.body;

    // validate the data
    if (!data.field_id) {
        // if field_id is not provided, return a 400 error
        res.status(400).send('field_id is required');
    } else if (!Number.isInteger(data.field_id) || data.field_id < 1) {
        // if field_id is not an integer or is less than 1, return a 400 error
        res.status(400).send('field_id not valid');
    } else if (!data.date) {
        // if date is not provided, return a 400 error
        res.status(400).send('date is required');
    } else if (new Date(data.date) === 'Invalid Date') {
        // if the date is not a valid date, return a 400 error
        res.status(400).send('Invalid date format');
    } else if (!data.start_time) {
        // if the time is not provided, return a 400 error
        res.status(400).send('start time is required');
    } else if (new Date(data.start_time) === 'Invalid Date') {
        // if the time is not a valid time, return a 400 error
        res.status(400).send('Invalid start time format');
    } else if (!data.end_time) {
        // if the time is not provided, return a 400 error
        res.status(400).send('end time is required');
    } else if (new Date(data.end_time) === 'Invalid Date') {
        // if the time is not a valid time, return a 400 error
        res.status(400).send('Invalid end time format');
    } else if (!data.participants) {
        // if the number of participants is not provided, return a 400 error
        res.status(400).send('number of participants is required');
    } else if (!Number.isInteger(data.participants) || data.participants < 1) {
        // if the number of participants is not an integer or is less than 1, return a 400 error
        res.status(400).send('number of participants not valid');
    } else if (data.is_public === undefined) {
        res.status(400).send('is_public is required');
    } else if(data.is_public !== true && data.is_public !== false) {
        res.status(400).send('Invalid value for is_public, must be true or false');
    } else if (!data.sport) {
        res.status(400).send('sport is required');
    } else {
        // TODO: before saving the reservation, check if the user_id already has a reservation at the same time
        var already_reserved = false;

        // TODO: before saving the reservation, check if the field is available at the specified time
        var field_available = true;

        if (already_reserved) {
            res.status(400).send('You already have a reservation at the same time');
        } else if (!field_available) {
            res.status(400).send('The field is not available at the specified time');
        } else {
            // create the reservation
            
            // make a reservation object
            var reservation = {
                user_id: 4,
                field_id: data.field_id,
                date: data.date,
                start_time: data.start_time,
                end_time: data.end_time,
                participants: data.participants,
                is_public: data.is_public,
                sport: data.sport
            };
            
            // save the reservation to the database
            // if user_id or sport is not valid, the database will return an error, and we will return a 400 error
            
            // this is just a placeholder, when the database is implemented, this will be replaced
            var saved = true;
            
            if (!saved) {
                res.status(500).send('Error creating reservation');
            } else {
                // get the field name from the database
                
                // this is just a placeholder
                reservation.field_name = 'Field ' + data.field_id;
                
                // return a 201 status code and send the object
                res.status(201).send(reservation);
            }
        }

    }
});

// get a specific reservation
app.get('/:id', function(req, res) {
    // get the id from the request
    var id = req.params.id;

    // cast the id to an integer
    id = parseInt(id);

    // check if the id is a number
    if (isNaN(id)) {
        res.status(400).send('Invalid id, must be an integer');
    } else {
        // get the reservation from the database

        // this is just a placeholder for the database
        var reservation = { 
            id: id,
            user_id: 1,
            field_id: id,
            field_name: 'Field ' + id,
            date: '2020-01-01',
            start_time: '12:00',
            end_time: '14:00',
            participants: 4,
            is_public: true,
            sport: 'Tennis'
        };

        if (reservation) {
            res.send(reservation);
        } else {
            res.status(404).send('Reservation not found');
        }
    }
});

app.delete('/:id', function(req, res) {
    // get the id from the request
    var id = req.params.id;

    // cast the id to an integer
    id = parseInt(id);

    // check if the id is a number
    if (isNaN(id)) {
        res.status(400).send('Invalid id, must be an integer');
    } else {
        // delete the reservation from the database

        // this is just a placeholder for the database
        var deleted = true;

        if (deleted) {
            res.send('Reservation deleted');
        } else {
            res.status(404).send('Reservation not found');
        }
    }
});


module.exports = app;
