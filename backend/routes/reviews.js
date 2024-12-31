var express = require('express');
var app = express();

// connection to the db and get the review collection
const { ObjectId } = require('mongodb');
var client = require('../connection.js');
var coll = client.getDb().collection('recensione');
const { authenticateToken } = require('../middleware/auth');

app.use(express.json());

app.use(express.urlencoded());


app.get('/', async(req, res) => {
    var field_id = req.query.field_id;

    // cast filed_id to an integer, if it exists, if it is not a number, return a 400 error
    if (field_id) {
        // get the reviews from the database for the field_id
        var reviews = await getReviewByField(field_id);
    } else{
        // take all the reviews from the database
        var reviews = await getAllReviews();      
    }

    if(reviews){
        res.status(200).send(reviews);
    } else {
        res.status(400).send('Error fetching reviews, check the field_id');
    }
});

app.post('/', authenticateToken, async(req, res) => {
    // get the data from the request
    data = req.body;

    // validate the data
    if (!data.title || !data.field_id || !data.rating || !data.description) {
        return res.status(400).send('Invalid data');
    } else if (!Number.isInteger(data.rating) || data.rating < 0 || data.rating > 5) {
        return res.status(400).send('Invalid rating, must be an integer between 1 and 5');
    } else {
        var user_id = req.user.id;

        // before saving the review, check if the user has already made a review for the field
        var already_reviewed = await hasUserReviewedField(user_id, data.field_id);

        // before saving the review, check if the user has at least one reservation in the field
        // TODO: implement the hasReservation function
        var has_reservation = true;

        if (already_reviewed) {
            return res.status(400).send('You have already reviewed this field');
        } else if (!has_reservation) {
            return res.status(400).send('You must have at least one reservation in the field to review it');
        } else{
            // check that the field_id exists
            var field = await checkField(data.field_id);

            if (!field) {
                return res.status(404).send('Field not found');
            }

            // convert the date to the correct format
            // date format: YYYY-MM-DDTHH:mm:ss.sssZ
            var date_obj = new Date().toISOString();

            
            review = {
                utente: user_id,
                titolo: data.title,
                testo: data.description,
                data: date_obj,
                campo: data.field_id,
                rating: data.rating
            };
            
            // save the review in the database
            var result = await addReview(review);
            
            if(result){
                res.status(201).send(review);
            } else {
                res.status(400).send('Error adding review');
            }
        }
    }
});

app.get('/:id', async(req, res) => {
    var id = req.params.id;

    // get the review from the database
    var review = await getReviewById(id);
    
    if(review){
        res.status(200).send(review);
    } else {
        res.status(404).send('Review not found');
    }
});

app.delete('/:id', authenticateToken, async(req, res) => {
    var id = req.params.id;

    // get the review from the database
    var review = await getReviewById(id);

    if (!review) {
        return res.status(404).send('Review not found');
    }

    // check if the user is the owner of the review or an admin
    if (req.user.id !== review.utente && !req.user.admin) {
        return res.status(403).send('Forbidden: You are not the owner of the review');
    }

    // delete the review from the database
    var deleted = await deleteReviewById(id);

    if (!deleted) {
        res.status(400).send('Error deleting review');
    } else {
        res.status(200).send('Review deleted');
    }
});


// all the function needed to implement the api
async function getAllReviews() {
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
        const review = await coll.findOne({ _id: new ObjectId(reviewId) });
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

async function checkField(fieldId) {
    try {
        const field = await client.getDb().collection('campo').findOne({ _id: new ObjectId(fieldId) });
        return field;
    } catch (error) {
        console.error("Error fetching field:", error);
        return false;
    }
}

async function deleteReviewById(reviewId) {
    try {
        const result = await coll.deleteOne({ _id: new ObjectId(reviewId) });

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
