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

function writeNotes(filePath, notes, callback) {
    fs.writeFile(filePath, JSON.stringify(notes, null, 2), 'utf-8', (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

app.get('/api/notes', (req, res) => {
    readNotes(dbFilePath, (err, notes) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Unable to read the parsed data.' });
        } else {
            res.json(notes);
        }
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4(); // Assign a unique ID using uuid

    readNotes(dbFilePath, (err, notes) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Unable to read the parsed data.' });
        } else {
            notes.push(newNote);
            writeNotes(dbFilePath, notes, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Unable to write the parsed data.' });
                } else {
                    res.json(newNote);
                }
            });
        }
    });
});


app.listen(PORT, function(){
    console.log('Server is listening on: http://localhost:' + PORT)
 });