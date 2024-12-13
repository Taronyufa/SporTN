var express = require('express');
var app = express();

// connection to the db and get the reports collection
const { ObjectId } = require('mongodb');
var client = require('../connection.js');
var coll = client.getDb().collection('segnalazione');
const { authenticateToken, checkAdmin } = require('../middleware/auth.js');

app.use(express.json());

app.use(express.urlencoded());


app.get('/', async (req, res) => {
    // take the reports from the database
    var reports = await getAllReports();

    if(reports){
        res.send(reports);
    }
});

app.post('/', authenticateToken, async(req, res) => {
    // get the data from the request
    data = req.body;

    // validate the data
    if (!data.name || !data.field_id || !data.image_url || !data.description) {
        return res.status(400).send('Invalid data');
    } else {
        // convert the date to the correct format
        // date format: YYYY-MM-DDTHH:mm:ss.sssZ
        var date_obj = new Date().toISOString();
        
        // check that the field_id exists
        var field = await checkField(data.field_id);

        if (!field) {
            return res.status(404).send('Field not found');
        }

        var user_id = req.user.id;

        var report = {
            utente: user_id,
            titolo: data.name,
            testo: data.description,
            data: date_obj,
            campo: data.field_id,
            foto_url: data.image_url,
            status: "not resolved"
        };

        // save the report in the database
        var result = await addReport(report);

        if(result){
            res.status(201).send(report);
        } else {
            res.status(500).send('Error saving report');
        }
    }
});

app.get('/:id', async(req, res) => {
    // get the id from the request
    var id = req.params.id;

    // get the report from the database
    var report = await getReportById(id);

    if(report){
        res.send(report);
    } else {
        res.status(404).send('Report not found');
    }
});

app.delete('/:id', authenticateToken, async(req, res) => {
    // get the id from the request
    var id = req.params.id;

    // get the report from the database
    var report = await getReportById(id);

    if (!report) {
        return res.status(404).send('Report not found');
    }

    // check if the user is the owner of the report or an admin
    if (req.user.id !== report.utente && !req.user.admin) {
        return res.status(403).send('Forbidden');
    }

    // delete the report from the database
    var deleted = await deleteReportById(id);

    if (deleted) {
        res.status(200).send('Report deleted');
    } else {
        res.status(404).send('Report not found');
    }
});

app.put('/:id/status', checkAdmin, async(req, res) => {
    // get the id from the request
    var id = req.params.id;

    // get the status string from the request
    var status = req.body.status;

    if (!status) {
        return res.status(400).send('Invalid status');
    }

    // update the status of the report in the database
    var updated = await updateStatus(id, status);

    if (updated) {
        res.status(200).send('Report status updated');
    } else {
        res.status(404).send('Report not found');
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
        const report = await coll.findOne({ _id: new ObjectId(reportId) });
        return report;
    } catch (error) {
        console.error("Error fetching report:", error);
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

async function updateStatus(reportId, status) {
    try {
        const result = await coll.updateOne(
            { _id: new ObjectId(reportId) },  
            { $set: { status: status } }  
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
        const result = await coll.deleteOne({ _id: new ObjectId(reportId) });

        return result.deletedCount;
    } catch (error) {
        console.error("Error deleting report:", error);
        return false;
    }
}

module.exports = app;
