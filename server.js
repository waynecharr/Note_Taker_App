const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
// Installed uuid to create a unique ID. 
const { v4: uuidv4 } = require('uuid');

// Port being used for listening. 
const PORT = process.env.PORT || 3002;

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get routes for the notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Get routes from the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Shortcute for the file path directory instead of using ./db/dbjson. Had errors when I used that.
dbFilePath = path.join(__dirname, 'db', 'db.json');

// Function reads notes from db.
function readNotes(filePath, callback) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            const notes = JSON.parse(data);
            callback(null, notes);
        }
    });
}

// Function writes notes. 
function writeNotes(filePath, notes, callback) {
    fs.writeFile(filePath, JSON.stringify(notes, null, 2), 'utf-8', (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

// Gets all the ntoes from db/db.json.
app.get('/api/notes', (req, res) => {
    readNotes(dbFilePath, (err, notes) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Data cannot be read.' });
        } else {
            res.json(notes);
        }
    });
});

// Post notes to the db.json file. 
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4(); // Referenced back the unique id number. 
    readNotes(dbFilePath, (err, notes) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Date cannot be read.' });
        } else {
            notes.push(newNote);
            writeNotes(dbFilePath, notes, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Cannot write data.' });
                } else {
                    res.json(newNote);
                }
            });
        }
    });
});


// For testing purposes to listen on port 3002. 
app.listen(PORT, function(){
    console.log('Server is listening on: http://localhost:' + PORT)
 });