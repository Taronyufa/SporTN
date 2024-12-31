var express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var app = express();

// connection to the db
const { ObjectId } = require('mongodb');
var client = require('../connection.js');
var coll = client.getDb().collection('utente');

app.use(express.json());

app.use(express.urlencoded());


const validateEmail = (email) => {
    return String(email).toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

app.post('/register', async (req, res) => {
    // get all the data from the request
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
    } else if (!data.password) {
        // if password is not provided, return a 400 error
        res.status(400).send('password is required');
    } else {
        // check if the email is already in the database
        var user = await coll.findOne({ email: data.email });
        
        if (user) {
            return res.status(409).send('email already exists');
        }

        // check if the username is already in the database
        var user = await coll.findOne({ username: data.username });

        // if the username exists, return a 409 error
        if (user) {
            res.status(409).send('username already exists');
        } else {
            // if the user does not exist, create the user

            // Hash the password
            const hashed_password = await bcrypt.hash(data.password, 10);

            var user = {
                username: data.username,
                email: data.email,
                hashed_password: hashed_password,
                admin: false
            };

            // add the user to the database
            coll.insertOne(user);

            res.status(201).send(user);
        }
    }
});


app.post('/login', async (req, res) => {
    var data = req.body;

    // validate the data
    if (!data.email) {
        res.status(400).send('email is required');
    } else if (!data.password) {
        res.status(400).send('password is required');
    } else {
        // check if the user exists
        var user = await coll.findOne({ email: data.email });

        if (!user) {
            // if the user does not exist, return a 404 error
            res.status(404).send('user not found');
        } else {
            // check if the password is correct
            var valid = await bcrypt.compare(data.password, user.hashed_password);

            if (valid) {
                // user authenticated -> create a token
                var payload = { email: user.email, id: user._id, admin: user.admin, username: user.username };
                var options = { expiresIn: 86400 } // expires in 24 hours
                var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
                res.json({ success: true, 
                    message: 'Enjoy your token!',
                    token: token,
                    email: user.email,
                    id: user._id,
                    admin: user.admin,
                    self: "api/v1/" + user._id
                });
            } else {
                // if the password is not correct, return a 401 error
                res.status(401).send('invalid password');
            }
        }
    }

});


module.exports = app;
