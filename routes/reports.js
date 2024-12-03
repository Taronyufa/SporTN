var express = require('express');
var app = express();

// connection to the db and get the event collection
const { ObjectId } = require('mongodb');
var client = require('../connection.js');
var coll = client.getDb().collection('segnalazione');

app.use(express.json());

app.use(express.urlencoded());


app.get('/', function(req, res) {
    // take the reports from the database
    var reports = getAllReports();

    if(reports){
        res.send(reports);
    }
});

app.post('/', function(req, res) {
    // get the data from the request
    data = req.body;

    // validate the data
    if (!data.name || !data.field_id || !data.image_url || !data.description || !data.user_id) {
        return res.status(400).send('Invalid data');
    } else if (!Number.isInteger(data.field_id)) {
        return res.status(400).send('Invalid field_id, must be an integer'); 
    } else if (!Number.isInteger(data.user_id)) {
        return res.status(400).send('Invalid field_id, must be an integer'); 
    } else {
        // convert the date to the correct format
        // date format: YYYY-MM-DDTHH:mm:ss.sssZ
        var date_obj = new Date().toISOString();
        
        var report = {
            titolo: data.name,
            testo: data.description,
            utente: data.user_id,
            data: date_obj,
            campo: data.field_id,
            foto_url: data.image_url,
            status: false,
        };

        // save the report in the database
        var result = addReport(report);

        if(result){
            res.status(201).send(report);
        }
    }
});

app.get('/:id', function(req, res) {
    // get the id from the request
    var id = req.params.id;

    id = parseInt(id);

    // check if the id is a number
    if (isNaN(id)) {
        res.status(400).send('Invalid id, must be an integer');
    } else {
        // get the report from the database
        var result = getReportById(id);

        if(result){
            res.send(report);
        }
    }
});

app.delete('/:id', function(req, res) {
    // get the id from the request
    var id = req.params.id;

    id = parseInt(id);

    // check if the id is a number
    if (isNaN(id)) {
        res.status(400).send('Invalid id, must be an integer');
    } else {
        // delete the report from the database
        var deleted = deleteReportById(id);

        if (deleted) {
            res.send('Report deleted');
        } else {
            res.status(404).send('Report not found');
        }
    }
});

app.put('/:id/status', function(req, res) {
    // get the id from the request
    var id = req.params.id;

    id = parseInt(id);

    // check if the id is a number
    if (isNaN(id)) {
        res.status(400).send('Invalid id, must be an integer');
    } else {
        // update the status of the report in the database
        var updated = updateStatus(id);

        if (updated) {
            res.send('Report status updated');
        } else {
            res.status(404).send('Report not found');
        }
    }
});


// all the function needed to implement the api
async function getAllReports() {
    try {
        const reports = await coll.find({}).toArray(); 
        return reports;
    } catch (error) {
        console.error("Error fetching reports:", error);
        return false;
    }
}

async function getReportById(reportId) {
    try {
        const report = await coll.findOne({ _id: reportId });
        return report;
    } catch (error) {
        console.error("Error fetching report:", error);
        return false;
    }
}

async function updateStatus(reportId) {
    try {
        const result = await coll.updateOne(
            { _id: reportId },  
            { $set: { status: true } }  
        );
        
        return result;
    } catch (error) {
        console.error("Error updating report:", error);
        return null;
    }
}

async function addReport(reportData) {
    try {
        const result = await coll.insertOne(reportData);  
        return result;
    } catch (error) {
        console.error("Error adding report:", error);
        return false;
    }
}

async function deleteReportById(reportId) {
    try {
        const result = await coll.deleteOne({ _id: reportId });

        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting report:", error);
        return false;
    }
}

module.exports = app;
