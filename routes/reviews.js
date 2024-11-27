var express = require('express');
var app = express();

// connection to the db and get the review collection
const { ObjectId } = require('mongodb');
var client = require('./connection.js');
var coll = client.getDb().collection('recensione');

app.use(express.json());

app.use(express.urlencoded());


app.get('/', function(req, res) {
    var field_id = req.query.field_id;

    // cast filed_id to an integer, if it exists, if it is not a number, return a 400 error
    if (field_id) {
        field_id = parseInt(field_id);
        if (isNaN(field_id)) {
            res.status(400).send('Invalid value for field_id, must be an integer');
        } else{
            // get the reviews from the database for the field_id
            const reviews = getReviewByField(field_id);
        }
    } else{
        // take all the reviews from the database
        var reviews = getAllRewies();      
    }

    if(reviews){
        res.send(reviews);
    }
});

app.post('/', function(req, res) {
    // get the data from the request
    data = req.body;

    // validate the data
    if (!data.title || !data.field_id || !data.rating || !data.description || !data.user_id) {
        return res.status(400).send('Invalid data');
    } else if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
        return res.status(400).send('Invalid rating, must be an integer between 1 and 5');
    } else if (!Number.isInteger(data.field_id)) {
        return res.status(400).send('Invalid field_id, must be an integer'); 
    } else if (!Number.isInteger(data.user_id)) {
        return res.status(400).send('Invalid field_id, must be an integer'); 
    } else {
        // before saving the review, check if the user has already made a review for the field
        var already_reviewed = hasUserReviewedField(data.user_id, data.field_id);

        // before saving the review, check if the user has at least one reservation in the field
        var has_reservation = true;

        if (!already_reviewed) {
            return res.status(400).send('You have already reviewed this field');
        } else if (!has_reservation) {
            return res.status(400).send('You must have at least one reservation in the field to review it');
        } else{
            // convert the date to the correct format
            // date format: YYYY-MM-DDTHH:mm:ss.sssZ
            var date_obj = new Date().toISOString();
            
            review = {
                titolo: data.title,
                testo: data.description,
                data: date_obj,
                utente: data.user_id,
                campo: data.field_id,
                rating: data.rating
            };
            
            // save the review in the database
            var result = addReview(review);
            
            if(result){
                res.status(201).send(review);
            }
        }
    }
});

app.get('/:id', function(req, res) {
    var id = req.params.id;

    // cast id to an integer, if it is not a number, return a 400 error
    id = parseInt(id);
    if (isNaN(id)) {
        res.status(400).send('Invalid value for id, must be an integer');
    } else{
        
        // get the review from the database
        var review = getReviewById(id);
        
        if(review){
            res.send(review);
        }
    }
});

app.delete('/:id', function(req, res) {
    var id = req.params.id;

    // cast id to an integer, if it is not a number, return a 400 error
    id = parseInt(id);
    if (isNaN(id)) {
        res.status(400).send('Invalid value for id, must be an integer');
    }

    // delete the review from the database
    var deleted = deleteReviewById(id);

    if (!deleted) {
        res.status(400).send('Error deleting review');
    } else {
        res.send('Review deleted');
    }
});


// all the function needed to implement the api
async function getAllRewies() {
    try {
        const reviews = await coll.find({}).toArray(); 
        return reviews;
    } catch (error) {
        console.error("Error fetching review:", error);
        return false;
    }
}

async function getReviewById(reviewId) {
    try {
        const review = await coll.findOne({ _id: reviewId });
        return review;
    } catch (error) {
        console.error("Error fetching review:", error);
        return false;
    }
}
async function getReviewByField(fieldId) {
    try {
        const review = await coll.find({ campo: fieldId }).toArray();
        return review;
    } catch (error) {
        console.error("Error fetching review:", error);
        return false;
    }
}

async function addReview(reviewData) {
    try {
        const result = await coll.insertOne(reviewData);  
        return result;
    } catch (error) {
        console.error("Error adding review:", error);
        return false;
    }
}

async function deleteReviewById(reviewId) {
    try {
        const result = await coll.deleteOne({ _id: reviewId });

        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting review:", error);
        return false;
    }
}

async function hasUserReviewedField(userId, fieldId) {
    try {
        const review = await coll.findOne({
            utente: userId,     // Filtra per l'utente specifico
            campo: fieldId      // Filtra per il campo specifico
        });

        if (review) {
            return true; // L'utente ha già fatto una recensione per il campo
        }

        return false; // L'utente non ha fatto una recensione per il campo

    } catch (error) {
        console.error("Errore durante la verifica delle recensioni:", error);
        throw error;
    }
}

module.exports = app;
