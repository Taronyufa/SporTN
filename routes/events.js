var express = require('express');
var app = express();

app.use(express.json());

app.use(express.urlencoded());


app.get('/', function(req, res) {
    // take the events from the database

    // this is just a placeholder for the database
    var events = [
        { 
            id: 1,
            name: 'Tennis Tournament',
            location: 'Central Park',
            start_date: '2020-01-01',
            start_time: '12:00',
            end_date: '2020-01-01',
            end_time: '16:00',
            image_url: 'https://example.com/image.jpg',
            description: 'This is a tennis tournament in Central Park',
            sports: ['Tennis']
        },
        {
            id: 2,
            name: 'Basketball Game',
            location: 'Madison Square Garden',
            start_date: '2021-01-01',
            start_time: '12:00',
            end_date: '2021-01-01',
            end_time: '16:00',
            image_url: 'https://example.com/image.jpg',
            description: 'This is a basketball game in Madison Square Garden',
            sports: ['Basketball']
        },
        {
            id: 3,
            name: 'Soccer Match',
            location: 'Yankee Stadium',
            start_date: '2022-01-01',
            start_time: '12:00',
            end_date: '2022-01-01',
            end_time: '16:00',
            image_url: 'https://example.com/image.jpg',
            description: 'This is a soccer match in Yankee Stadium',
            sports: ['Soccer']
        }
    ];

    res.send(events);
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
    } else if (new Date(data.start_date) === 'Invalid Date') {
        // if the date is not a valid date, return a 400 error
        res.status(400).send('Invalid date format');
    } else if (!data.start_time) {
        // if time is not provided, return a 400 error
        res.status(400).send('time is required');
    } else if (new Date(data.start_time) === 'Invalid Date') {
        // if the time is not a valid time, return a 400 error
        res.status(400).send('Invalid time format');
    } else if (!data.end_date) {
        // if date is not provided, return a 400 error
        res.status(400).send('date is required');
    } else if (new Date(data.end_date) === 'Invalid Date') {
        // if the date is not a valid date, return a 400 error
        res.status(400).send('Invalid date format');
    } else if (!data.end_time) {
        // if time is not provided, return a 400 error
        res.status(400).send('time is required');
    } else if (new Date(data.end_time) === 'Invalid Date') {
        // if the time is not a valid time, return a 400 error
        res.status(400).send('Invalid time format');
    } else {
        // add the event to the database

        // this is just a placeholder for the database
        var event = {
            id: 4,
            name: data.name,
            location: data.location,
            start_date: data.start_date,
            start_time: data.start_time,
            end_date: data.end_date,
            end_time: data.end_time,
            image_url: data.image_url,
            description: data.description,
        };

        res.status(201).send(event);
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

        var event = {
            id: id,
            name: 'Tennis Tournament',
            location: 'Central Park',
            start_date: '2020-01-01',
            start_time: '12:00',
            end_date: '2020-01-01',
            end_time: '16:00',
            image_url: 'https://example.com/image.jpg',
            description: 'This is a tennis tournament in Central Park',
            sports: ['Tennis']
        };
        res.send(event);
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

        // this is just a placeholder for the database
        var deleted = true;

        if (deleted) {
            res.send('Event deleted');
        } else {
            res.status(404).send('Event not found');
        }
    }

});


module.exports = app;
