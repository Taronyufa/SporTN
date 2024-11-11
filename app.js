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

// reservations route, using the reservations.js file
var reservations = require('./routes/reservations');
app.use('/reservations', reservations);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
