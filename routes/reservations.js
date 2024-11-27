var express = require('express');
var app = express();

// connection to the db and get the event collection
const { ObjectId } = require('mongodb');
var client = require('./connection.js');
var coll = client.getDb().collection('prenotazione');

app.use(express.json());

app.use(express.urlencoded());

app.get('/', function(req, res) {
    var public_only = req.query.public_only;
    var user_id = req.query.user_id;

    // cast public_only to a boolean
    if (public_only) {
        if (public_only === 'true' || public_only === 'True' || public_only === '1') {
            public_only = true;
        } else if (public_only === 'false' || public_only === 'False' || public_only === '0') {
            public_only = false;
        } else {
            res.status(400).send('Invalid value for public_only, must be true or false');
        }
    }

    // cast user_id to an integer, if it exists, if it is not a number, return a 400 error
    if (user_id) {
        user_id = parseInt(user_id);
        if (isNaN(user_id)) {
            res.status(400).send('Invalid value for user_id, must be an integer');
        }
    }

    // take the reservations from the database, and filter them with the query parameters
    var reservations = getPublicReservationsByUser(user_id);
 
    res.send(reservations);
});

app.post('/', function(req, res) {
    // get all the data from the request
    var data = req.body;

    // validate the data
    if (!data.field_id || !data.event_id) {
        // if field_id is not provided, return a 400 error
        res.status(400).send('field_id is required');
    } else if (!Number.isInteger(data.field_id) || data.field_id < 1) {
        // if field_id is not an integer or is less than 1, return a 400 error
        res.status(400).send('field_id not valid');
    } else if (!Number.isInteger(data.event_id) || data.field_id < 1) {
        // if field_id is not an integer or is less than 1, return a 400 error
        res.status(400).send('field_id not valid');
    } else if (!data.date) {
        // if date is not provided, return a 400 error
        res.status(400).send('date is required');
    } else if (new Date(data.date) === 'Invalid Date') {
        // if the date is not a valid date, return a 400 error
        res.status(400).send('Invalid date format');
    } else if (!data.start_time) {
        // if the time is not provided, return a 400 error
        res.status(400).send('start time is required');
    } else if (new Date(data.start_time) === 'Invalid Date') {
        // if the time is not a valid time, return a 400 error
        res.status(400).send('Invalid start time format');
    } else if (!data.end_time) {
        // if the time is not provided, return a 400 error
        res.status(400).send('end time is required');
    } else if (new Date(data.end_time) === 'Invalid Date') {
        // if the time is not a valid time, return a 400 error
        res.status(400).send('Invalid end time format');
    } else if (!data.participants) {
        // if the number of participants is not provided, return a 400 error
        res.status(400).send('number of participants is required');
    } else if (!Number.isInteger(data.participants) || data.participants < 1) {
        // if the number of participants is not an integer or is less than 1, return a 400 error
        res.status(400).send('number of participants not valid');
    } else if (data.is_public === undefined) {
        res.status(400).send('is_public is required');
    } else if(data.is_public !== true && data.is_public !== false) {
        res.status(400).send('Invalid value for is_public, must be true or false');
    } else if (!data.sport) {
        res.status(400).send('sport is required');
    } else {

        // before saving the reservation, check if the user_id already has a reservation at the same time
        var already_reserved = hasConflictingReservation(data.user_id, data.date, data.start_time, data.end_time);

        // before saving the reservation, check if the field is available at the specified time
        var field_available = isFieldAvailable(data.field_id, data.date, data.start_time, data.end_time);

        if (already_reserved) {
            res.status(400).send('You already have a reservation at the same time');
        } else if (!field_available) {
            res.status(400).send('The field is not available at the specified time');
        } else {
            
            var reservation = {
                utente: data.user_id,
                campo: data.field_id,
                data: data.date,
                ora_inizio: data.start_time,
                ora_fine: data.end_time,
                n_partecipanti: data.participants,
                sport: data.sport,
                pubblico: data.is_public,
                evento: data.event_id
            };
            
            // save the reservation to the database
            // if user_id or sport is not valid, the database will return an error, and we will return a 400 error
            var saved = addReservation(reservation);
            
            if (!saved) {
                res.status(500).send('Error creating reservation');
            } else {
                // get the field name from the database
                
                // this is just a placeholder
                reservation.field_name = 'Field ' + data.field_id;
                
                // return a 201 status code and send the object
                res.status(201).send(reservation);
            }
        }

    }
});

// get a specific reservation
app.get('/:id', function(req, res) {
    // get the id from the request
    var id = req.params.id;

    // cast the id to an integer
    id = parseInt(id);

    // check if the id is a number
    if (isNaN(id)) {
        res.status(400).send('Invalid id, must be an integer');
    } else {
        // get the reservation from the database
        var reservation = getReservationById(id);

        if (reservation) {
            res.send(reservation);
        } else {
            res.status(404).send('Reservation not found');
        }
    }
});

app.delete('/:id', function(req, res) {
    // get the id from the request
    var id = req.params.id;

    // cast the id to an integer
    id = parseInt(id);

    // check if the id is a number
    if (isNaN(id)) {
        res.status(400).send('Invalid id, must be an integer');
    } else {
        // delete the reservation from the database
        var deleted = deleteReservationById(id);

        if (deleted) {
            res.send('Reservation deleted');
        } else {
            res.status(404).send('Reservation not found');
        }
    }
});


// all the function needed to implement the api
async function getReservationById(reservationId) {
    try {
        const reservation = await coll.findOne({ _id: reservationId });
        return reservation;
    } catch (error) {
        console.error("Error fetching reservations:", error);
        return false;
    }
}

async function getPublicReservationsByUser(userId) {
    try {
        const reservations = await coll.find({
            user_id: userId,       // Match the specific user ID
            is_public: true        // Only public reservations
        }).toArray();

        return reservations;
    } catch (error) {
        console.error("Error fetching reservations:", error);
        return false;
    }
}

async function addReservation(reservationData) {
    try {
        const result = await coll.insertOne(reservationData);  
        return result;
    } catch (error) {
        console.error("Error adding reservations:", error);
        return false;
    }
}

async function deleteReservationById(reservationId) {
    try {
        const result = await coll.deleteOne({ _id: reservationId });

        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting reservations:", error);
        return false;
    }
}

async function hasConflictingReservation(userId, date, startTime, endTime) {
    try {
        const conflict = await coll.findOne({
            utente: userId,               // L'utente da verificare
            data: date,                   // Data della prenotazione
            $or: [                        
                {
                    ora_inizio: { $lt: endTime },  // Ora inizio
                    ora_fine: { $gt: startTime }  // Ora fine
                }
            ]
        });

        if (conflict) {
            return true; // Conflitto trovato
        }

        return false; // Nessun conflitto

    } catch (error) {
        console.error("Errore durante la verifica delle prenotazioni:", error);
        throw error;
    }
}

async function isFieldAvailable(fieldId, date, startTime, endTime) {
    try {
        const conflict = await coll.findOne({
            campo: fieldId,               // Campo da verificare
            data: date,                   // Data della prenotazione
            $or: [                        // Conflitto su intervalli di tempo
                {
                    ora_inizio: { $lt: endTime },  // Ora inizio
                    ora_fine: { $gt: startTime }  // Ora fine
                }
            ]
        });

        if (conflict) {
            return false; // Campo occupato
        }

        return true; // Campo disponibile

    } catch (error) {
        console.error("Errore durante la verifica delle disponibilità:", error);
        throw error;
    }
}

module.exports = app;
