var express = require('express');
var app = express();

// connection to the db and get the user collection
const { ObjectId } = require("mongodb");
var client = require('./connection.js');
var coll = client.getDb().collection('utente');

app.use(express.json());

app.use(express.urlencoded());


const validateEmail = (email) => {
    return String(email).toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


app.get('/me', function(req, res) {


    // this is just a placeholder for the database
    var user = {
        _id: 1,
        username: 'John Doe',
        email: 'email@example.com',
        foto_profilo: 'https://example.com/image.jpg',
        sport: ['Soccer', 'Basketball'],
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
        var UpdateUser = {
            _id: userId, // got it at the top of the function
            username: data.username,
            email: data.email,
            sport: data.favorite_sports,
            foto_profilo: data.profile_image_url,
        }
           
        var modified = updateUserFields(userId, UpdateUser);
        
        if (modified) {
            // this is just a placeholder for the database
            res.send(UpdateUser);
            
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
        var user = getUserById(id);

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
        var deleted = deleteUserById(id);

        if (deleted) {
            res.send('User deleted');
        } else {
            res.status(400).send('Error deleting user');
        }
    }
});


// all the function needed to implement the api
async function createNewUser(userData) {

    // userData needs to look like this:
    // id is not necessary cuz the db will automatically chose one 
    /*

    var user = {
        username: 'John Doe',
        email: 'email@example.com',
        foto_profilo: 'https://example.com/image.jpg',
        sport: ['Soccer', 'Basketball'],
    }

    */

    try {
        const result = await coll.insertOne(userData); 
        return result;
    } catch (error) {
        console.error("Error adding user:", error);
        return false;
    }
}

async function getUserById(userId) {
    try {
        const user = await coll.findOne({ _id: userId });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return false;
    }
}

async function updateUserFields(userId, updatedUserData) {
    try {
        const result = await coll.updateOne(
            { _id: userId }, 
            { $set: updatedUserData }     
        );

        return result;
    } catch (error) {
       console.error("Error updating user:", error);
        return false;
    }
}

async function deleteUserById(userId) {
    try {
        const result = await coll.deleteOne({ _id: userId });

        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
}

module.exports = app;
