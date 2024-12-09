var express = require('express');
var app = express();

// connection to the db and get the user collection
const { ObjectId } = require("mongodb");
var client = require('../connection.js');
var coll = client.getDb().collection('utente');
const { authenticateToken } = require('../middleware/auth');

app.use(express.json());

app.use(express.urlencoded());


const validateEmail = (email) => {
    return String(email).toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


app.get('/me', authenticateToken, async(req, res) => {
    // get the user id from the request
    var userId = req.user.id;

    // get the user from the database
    var user = await getUserById(userId);

    // not including the hashed password in the response
    delete user.hashed_password;

    if (!user) {
        return res.status(404).send('User not found');
    } else {
        res.status(200).send(user);
    }
});

app.put('/me', authenticateToken, async(req, res) => {
    // get user id
    var userId = req.user.id;

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
    } else{

        // modify the user data in the database
        var UpdateUser = {
            _id: userId, // got it at the top of the function
            username: data.username,
            email: data.email,
            sport: data.favorite_sports,
            foto_profilo: data.profile_image_url,
        }
           
        var modified = await updateUserFields(userId, UpdateUser);
        
        if (modified) {
            res.send(UpdateUser);
            
        } else {
            res.status(500).send('Error modifying user');
        }
    }
});

app.get('/:id', async(req, res) => {
    var id = req.params.id;

    // get the user from the database
    var user = await getUserById(id);

    if (!user) {
        return res.status(404).send('User not found');
    } else {
        return res.status(200).send(user);
    }

});

app.delete('/:id', authenticateToken, async(req, res) => {
    var id = req.params.id;

    // check if the user is the same as the user to be deleted or if the user is an admin
    if (req.user.id != id && !req.user.admin) {
        return res.status(403).send('Forbidden');
    }

    // delete the user from the database
    var deleted = await deleteUserById(id);

    if (deleted) {
        res.status(200).send('User deleted');
    } else {
        res.status(400).send('Error deleting user');
    }
});


// all the function needed to implement the api
async function getUserById(userId) {
    try {
        const user = await coll.findOne({ _id: new ObjectId(userId) });
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
        const result = await coll.deleteOne({ _id: new ObjectId(userId) });

        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
}

module.exports = app;
