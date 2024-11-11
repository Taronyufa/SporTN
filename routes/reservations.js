var express = require('express');
var app = express();

app.use(express.json());

app.use(express.urlencoded());

app.get('/', function(req, res) {
    res.send('return all reservations');
});

app.post('/', function(req, res) {
    res.send('create a new reservation');
});

// get a specific reservation
app.get('/:id', function(req, res) {
    res.send('You are viewing reservation ' + req.params.id);
});

module.exports = app;
