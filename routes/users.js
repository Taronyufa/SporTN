var express = require('express');
var app = express();

app.use(express.json());

app.use(express.urlencoded());


const validateEmail = (email) => {
    return String(email).toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


app.get('/me', function(req, res) {
    // get user id
    
    // get the user from the database

    // this is just a placeholder for the database
    var user = {
        id: 1,
        username: 'John Doe',
        email: 'email@example.com',
        profile_image_url: 'https://example.com/image.jpg',
        favorite_sports: ['Soccer', 'Basketball'],
        preferred_location: ['New York', 'Los Angeles']
    }

    res.send(user);
});

app.put('/me', function(req, res) {
    // get user id

    // get the data from the request
    var data = req.body;

    // validate the data
    if (!data.username) {
        // if username is not provided, return a 400 error
        res.status(400).send('username is required');
    } else if (!data.email) {
        // if email is not provided, return a 400 error
        res.status(400).send('email is required');
    } else if (!validateEmail(data.email)) {
        // if email is not valid, return a 400 error
        res.status(400).send('email is not valid');
    } else if (!data.profile_image_url) {
        // if profile_image_url is not provided, return a 400 error
        res.status(400).send('profile_image_url is required');
    } else if (!data.favorite_sports) {
        // if favorite_sports is not provided, return a 400 error
        res.status(400).send('favorite_sports is required');
    } else if (!data.preferred_location) {
        // if preferred_location is not provided, return a 400 error
        res.status(400).send('preferred_location is required');
    } else{
        // modify the user data in the database
        
        var modified = true;
        
        if (modified) {
            // this is just a placeholder for the database
            var user = {
                id: 1,
                username: data.username,
                email: data.email,
                profile_image_url: data.profile_image_url,
                favorite_sports: data.favorite_sports,
                preferred_location: data.preferred_location
            }
            
            res.send(user);
            
        } else {
            res.status(500).send('Error modifying user');
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
        // get the user from the database

        // this is just a placeholder for the database
        var user = {
            id: id,
            username: 'John Doe',
            email: 'email@example.com',
            profile_image_url: 'https://example.com/image.jpg',
            favorite_sports: ['Soccer', 'Basketball'],
            preferred_location: ['New York', 'Los Angeles']
        }

        res.send(user);

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
        // delete the user from the database

        // this is just a placeholder
        var deleted = true;

        if (deleted) {
            res.send('User deleted');
        } else {
            res.status(400).send('Error deleting user');
        }
    }
});


module.exports = app;
