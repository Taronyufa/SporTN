var express = require('express');
var app = express();

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

            // this is just a placeholder for the database
            var reviews = [
                {
                    id: 1,
                    name: 'Review 1',
                    field_id: field_id,
                    date: '2020-01-01',
                    time: '12:00',
                    rating: 4,
                    description: 'This is a review in Central Park',
                },
                {
                    id: 2,
                    name: 'Review 2',
                    field_id: field_id,
                    date: '2020-01-02',
                    time: '13:00',
                    rating: 5,
                    description: 'This is a review in Madison Square Garden',
                },
                {
                    id: 3,
                    name: 'Review 3',
                    field_id: field_id,
                    date: '2020-01-03',
                    time: '14:00',
                    rating: 3,
                    description: 'This is a review in Central Park',
                },
            ];
        }
    } else{
        // take all the reviews from the database
        
        // this is just a placeholder for the database
        var reviews = [
            {
                id: 1,
                name: 'Review 1',
                field_id: 1,
                date: '2020-01-01',
                time: '12:00',
                rating: 4,
                description: 'This is a review in Central Park',
            },
            {
                id: 2,
                name: 'Review 2',
                field_id: 2,
                date: '2020-01-02',
                time: '13:00',
                rating: 5,
                description: 'This is a review in Madison Square Garden',
            },
            {
                id: 3,
                name: 'Review 3',
                field_id: 1,
                date: '2020-01-03',
                time: '14:00',
                rating: 3,
                description: 'This is a review in Central Park',
            },
        ];
    }

    res.send(reviews);
});

app.post('/', function(req, res) {
    // get the data from the request
    data = req.body;

    // validate the data
    if (!data.title || !data.field_id || !data.rating || !data.description) {
        return res.status(400).send('Invalid data');
    } else if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
        return res.status(400).send('Invalid rating, must be an integer between 1 and 5');
    } else if (!Number.isInteger(data.field_id)) {
        return res.status(400).send('Invalid field_id, must be an integer'); 
    } else {
        // TODO: before saving the review, check if the user has already made a review for the field
        var already_reviewed = true;

        // TODO: before saving the review, check if the user has at least one reservation in the field
        var has_reservation = true;

        if (!already_reviewed) {
            return res.status(400).send('You have already reviewed this field');
        } else if (!has_reservation) {
            return res.status(400).send('You must have at least one reservation in the field to review it');
        } else{
            // save the review in the database
            
            // convert the date to the correct format
            // date format: YYYY-MM-DD
            // time format: HH:MM:SS
            var date_obj = new Date();
            date = date_obj.toISOString().split('T')[0];
            time = date_obj.toISOString().split('T')[1].split('.')[0];
            
            // save the review in the database
            
            // this is just a placeholder
            review = {
                id: 4,
                name: data.title,
                field_id: data.field_id,
                date: date,
                time: time,
                rating: data.rating,
                description: data.description,
            };
            
            res.status(201).send(review);
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
        
        // this is just a placeholder for the database
        var review = {
            id: id,
            name: 'Review ' + id,
            field_id: 1,
            date: '2020-01-01',
            time: '12:00',
            rating: 4,
            description: 'This is a review in Central Park',
        };
        
        res.send(review);
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

    // this is just a placeholder
    var deleted = true;

    if (!deleted) {
        res.status(400).send('Error deleting review');
    } else {
        res.send('Review deleted');
    }
});


module.exports = app;
