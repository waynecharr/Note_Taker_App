const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3002;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get routes for the index and notes html. 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

dbFilePath = path.join(__dirname, 'db', 'db.json');

function notesUpdate(filePath, callback) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            const notesUpdated = JSON.parse(data);
            callback(null, notesUpdated);
        }
    });
}

notesUpdated = []


app.get('/api/notes', (req, res) => {
    notesUpdated(dbFilePath, (err, notes) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error reading or parsing data from the file.' });
        } else {
            res.json(notes);
        }
    });
});


app.listen(PORT, function(){
    console.log('Server is listening on: http://localhost:' + PORT)
 });