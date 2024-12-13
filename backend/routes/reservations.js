var express = require('express');
var app = express();

// connection to the db and get the reservation collection
const { ObjectId } = require('mongodb');
var client = require('../connection.js');
var coll = client.getDb().collection('prenotazione');
const { authenticateToken } = require('../middleware/auth');

app.use(express.json());

app.use(express.urlencoded());

app.get('/', async (req, res) => {
    var public_only = req.query.public_only;
    var user_id = req.query.user_id;

    // cast public_only to a boolean
    if (public_only) {
        if (public_only === 'true' || public_only === 'True' || public_only === '1') {
            public_only = true;
        } else if (public_only === 'false' || public_only === 'False' || public_only === '0') {
            public_only = false;
        } else {
            return res.status(400).send('Invalid value for public_only, must be true or false');
        }
    } else {
        public_only = false;
    }

    // take the reservations from the database, and filter them with the query parameters
    var reservations = await getReservations(user_id, public_only);
 
    if (reservations){
        return res.status(200).send(reservations);
    } else {
        return res.status(500).send('Error gettin reservations');
    }
});

app.post('/', authenticateToken, async (req, res) => {
    // get all the data from the request
    var data = req.body;

    // validate the data
    if (!data.field_id) {
        // if field_id is not provided, return a 400 error
        res.status(400).send('field_id is required');
    } else if (!data.date) {
        // if date is not provided, return a 400 error
        res.status(400).send('date is required');
    } else if (new Date(data.date) === 'Invalid Date') {
        // if the date is not a valid date, return a 400 error
        res.status(400).send('Invalid date format');
    } else if (!data.start_time) {
        // if the time is not provided, return a 400 error
        res.status(400).send('start time is required');
    } else if (!data.end_time) {
        // if the time is not provided, return a 400 error
        res.status(400).send('end time is required');
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

        // check that the field_id exists
        var field_exists = await fieldExists(data.field_id);
        if (!field_exists) {
            return res.status(400).send('Field does not exist');
        }

        // check that the sport exists
        var sport_exists = await sportExists(data.sport);
        if (!sport_exists) {
            return res.status(400).send('Sport does not exist');
        }

        // get the user_id
        var user_id = req.user.id;

        // before saving the reservation, check if the user_id already has a reservation at the same time
        var already_reserved = await hasConflictingReservation(user_id, data.date, data.start_time, data.end_time);

        // before saving the reservation, check if the field is available at the specified time
        var field_available = await isFieldAvailable(data.field_id, data.date, data.start_time, data.end_time);

        if (already_reserved) {
            return res.status(400).send('You already have a reservation at the same time');
        } else if (!field_available) {
            return res.status(400).send('The field is not available at the specified time');
        } else {
            
            var reservation = {
                utente: user_id,
                campo: data.field_id,
                data: data.date,
                ora_inizio: data.start_time,
                ora_fine: data.end_time,
                n_partecipanti: data.participants,
                sport: data.sport,
                pubblico: data.is_public,
            };
            
            // save the reservation to the database
            var saved = await addReservation(reservation);
            
            if (!saved) {
                res.status(500).send('Error creating reservation');
            } else {
                // return a 201 status code and send the object
                res.status(201).send(reservation);
            }
        }

    }
});

// get a specific reservation
app.get('/:id', async (req, res) => {
    // get the id from the request
    var id = req.params.id;

    // get the reservation from the database
    var reservation = await getReservationById(id);

    if (reservation) {
        res.status(200).send(reservation);
    } else {
        res.status(404).send('Reservation not found');
    }
});

app.delete('/:id', authenticateToken, async (req, res) => {
    // get the id from the request
    var id = req.params.id;

    // get the user_id and is_admin from the request
    var user_id = req.user.id;
    var is_admin = req.user.admin;

    // get the reservation from the database
    var reservation = await getReservationById(id);

    if (!reservation) {
        return res.status(404).send('Reservation not found');
    }
    if (reservation.utente !== user_id && !is_admin) {
        return res.status(401).send('Unauthorized');
    }

    // delete the reservation from the database
    var deleted = await deleteReservationById(id);

    if (deleted && deleted > 0) {
        res.status(200).send('Reservation deleted');
    } else {
        res.status(500).send('Error deleting reservation');
    }
});


// all the function needed to implement the api
async function getReservationById(reservationId) {
    try {
        const reservation = await coll.findOne({ _id: new ObjectId(reservationId) });
        return reservation;
    } catch (error) {
        console.error("Error fetching reservations:", error);
        return false;
    }
}

async function getReservations(userId, publicOnly) {
    try {
        var reservations;

        if (userId) {
            // if user is defined, return only the reservations of that user

            if (publicOnly) {
                reservations = await coll.find({ utente: userId, pubblico: true }).toArray();
            }
            else {
                reservations = await coll.find({ utente: userId }).toArray();
            }
        } else {
            if (publicOnly) {
                reservations = await coll.find({ pubblico: true }).toArray();
            }
            else{
                reservations = await coll.find().toArray();
            }
        }

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
        const result = await coll.deleteOne({ _id: new ObjectId(reservationId) });
        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting reservations:", error);
        return false;
    }
}

async function fieldExists(fieldId) {
    try {
        var fieldCollection = client.getDb().collection('campo');
        const field = await fieldCollection.findOne({ _id: new ObjectId(fieldId) });
        return field ? true : false;
    } catch (error) {
        console.error("Error fetching field:", error);
        return false;
    }
}

async function sportExists(sportId) {
    try {
        var sportCollection = client.getDb().collection('sport');
        const sport = await sportCollection.findOne({ _id: new ObjectId(sportId) });
        return sport ? true : false;
    } catch (error) {
        console.error("Error fetching sport:", error);
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
