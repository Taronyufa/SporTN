

require('dotenv').config();
var express = require('express');
var app = express();
var util = require('util');
const cors = require('cors');

app.use(cors()); // Allow all origins (or configure specific origins)

app.use(express.json());
app.use(express.urlencoded());

// Serving static files
app.use(express.static('public'));

// Routes
app.get('/', function(req, res) {
    
res.send('This is the homepage');
});

var connection = require('./connection.js');
var db = connection.getDb();

// auth route, using the auth.js file
var auth = require('./routes/auth.js');
app.use('/api/auth', auth);

// users route, using the users.js file
var users = require('./routes/users.js');
app.use('/api/users', users);

// reservations route, using the reservations.js file
var reservations = require('./routes/reservations.js');
app.use('/api/reservations', reservations);

// public events route, using the events.js file
var events = require('./routes/events.js');
app.use('/api/events', events);

// sports route, using the sports.js file
var sports = require('./routes/sports.js');
app.use('/api/sports', sports);

// reports route, using the reports.js file
var reports = require('./routes/reports.js');
app.use('/api/reports', reports);

// reviews route, using the reviews.js file
var reviews = require('./routes/reviews.js');
app.use('/api/reviews', reviews);

// fields route, using the fields.js file
var fields = require('./routes/fields.js');
app.use('/api/fields', fields);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
