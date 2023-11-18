const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get routes for the index and notes html. 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'indext.html'));
});

dbFilePath = path.join(__dirname, 'db', 'db.json');

app.listen(PORT, function(){
    console.log('Server is listening on: http://localhost:' + PORT)
 });