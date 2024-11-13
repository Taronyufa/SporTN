var express = require('express');
var app = express();

app.use(express.json());

app.use(express.urlencoded());


app.get('/', function(req, res) {
    // take the reports from the database

    // this is just a placeholder for the database
    var reports = [
        {
            id: 1,
            name: 'Report 1',
            field_id: 1,
            date: '2020-01-01',
            time: '12:00',
            image_url: 'https://example.com/image.jpg',
            description: 'This is a report in Central Park',
        },
        {
            id: 2,
            name: 'Report 2',
            field_id: 2,
            date: '2020-01-02',
            time: '13:00',
            image_url: 'https://example.com/image.jpg',
            description: 'This is a report in Madison Square Garden',
        },
        {
            id: 3,
            name: 'Report 3',
            field_id: 1,
            date: '2020-01-03',
            time: '14:00',
            image_url: 'https://example.com/image.jpg',
            description: 'This is a report in Central Park',
        },
    ];

    res.send(reports);
});

app.post('/', function(req, res) {
    // get the data from the request
    data = req.body;

    // validate the data
    if (!data.name || !data.field_id || !data.image_url || !data.description) {
        return res.status(400).send('Invalid data');
    } else if (!Number.isInteger(data.field_id)) {
        return res.status(400).send('Invalid field_id, must be an integer'); 
    } else {
        // save the report in the database
        
        // convert the date to the correct format
        // date format: YYYY-MM-DD
        // time format: HH:MM:SS
        var date_obj = new Date();
        date = date_obj.toISOString().split('T')[0];
        time = date_obj.toISOString().split('T')[1].split('.')[0];
        
        // save the report in the database
        
        // this is just a placeholder
        var report = {
            id: 4,
            name: data.name,
            field_id: data.field_id,
            date: date,
            time: time,
            image_url: data.image_url,
            description: data.description,
        };
        
        res.status(201).send(report);
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

        // this is just a placeholder
        var report = {
            id: id,
            name: 'Report ' + id,
            field_id: 1,
            date: '2020-01-01',
            time: '12:00',
            image_url: 'https://example.com/image.jpg',
            description: 'This is a report in Central Park',
        };

        res.send(report);
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

        // this is just a placeholder
        var deleted = true;

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

        // this is just a placeholder
        var updated = true;

        if (updated) {
            res.send('Report status updated');
        } else {
            res.status(404).send('Report not found');
        }
    }
});


module.exports = app;
