require('dotenv').config();
var express = require('express');
var app = express();
var util = require('util');

app.use(express.json());
app.use(express.urlencoded());

// Serving static files
app.use(express.static('public'));

// Routes
app.get('/', function(req, res) {
    res.send('This is the homepage');
});

// users route, using the users.js file
var users = require('./routes/users');
app.use('/api/users', users);

// reservations route, using the reservations.js file
var reservations = require('./routes/reservations');
app.use('/api/reservations', reservations);

// public events route, using the events.js file
var events = require('./routes/events');
app.use('/api/events', events);

// sports route, using the sports.js file
var sports = require('./routes/sports');
app.use('/api/sports', sports);

// reports route, using the reports.js file
var reports = require('./routes/reports');
app.use('/api/reports', reports);

// reviews route, using the reviews.js file
var reviews = require('./routes/reviews');
app.use('/api/reviews', reviews);

// fields route, using the fields.js file
var fields = require('./routes/fields');
app.use('/api/fields', fields);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
