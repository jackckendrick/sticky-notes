const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqueIdGenerator = require('./helpers/uuid');

const app = express();
const serverPort = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define file paths
const indexPath = path.join(__dirname, '/public/index.html');
const notesPath = path.join(__dirname, '/public/notes.html');
const dbFilePath = 'db/db.json';

// Helper functions
const collectFileData = (filePath) => {
try {
const data = fs.readFileSync(filePath, 'utf8');
return JSON.parse(data);
} catch (err) {
console.error(`Error reading file: ${filePath}`, err);
return [];
}
};

const addDataToFile = (filePath, data) => {
try {
fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
console.info(`Successfully updated file: ${filePath}`);
} catch (err) {
console.error(`Error writing file: ${filePath}`, err);
}
};

// Routes
app.get('/', (req, res) => res.sendFile(indexPath));

app.get('/notes', (req, res) => res.sendFile(notesPath));

app.get('/api/notes', (req, res) => {
const notes = collectFileData(dbFilePath);
res.json(notes);
console.info(`${req.method} request received to get notes`);
});

app.post('/api/notes', (req, res) => {
const { noteHeader, noteBody } = req.body;

if (noteHeader && noteBody) {
const addedNote = {
title: noteHeader,
text: noteBody,
id: uniqueIdGenerator(),
};

} else {
    res.status(500).json('There was an error in posting the new note');
    }
    });
    
    app.delete('/api/notes/:id', (req, res) => {
    const parameterId = req.params.id;
    const notes = collectFileData(dbFilePath);
    
    const removeNotesIndex = notes.findIndex((note) => note.id === parameterId);
    if (removeNotesIndex !== -1) {
    notes.splice(removeNotesIndex, 1);
    addDataToFile(dbFilePath, notes);
    res.status(201).json('Action was successfull.');
    } else {
    res.status(404).json('Note not found');
    }
    });
    
    app.listen(serverPort, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`);
    });