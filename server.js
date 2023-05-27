const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqueIdGenerator = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define file paths
const indexPath = path.join(__dirname, '/public/index.html');
const notesPath = path.join(__dirname, '/public/notes.html');
const dbFilePath = path.join(__dirname, '/db/db.json');


// Routes
app.get('/', (req, res) => res.sendFile(indexPath));

app.get('/notes', (req, res) => res.sendFile(notesPath));
 
app.get('/api/notes', (req, res) => {
    // res.status(200).json(`${req.method} request received to get notes`);
    fs.readFile(dbFilePath, 'utf8', (err, data) =>{
        if(err) {
           console.error(err);
        } else {
           const parsedNotes = JSON.parse(data);
           res.json(parsedNotes);
        }
    });
console.info(`${req.method} request received to get notes`);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    //Destructuring assignment for the items in the req.body
    const { title, text } = req.body;

if (title && text) {
const newNote = {
title,
text,
id: uniqueIdGenerator(),
};
//Obtain existing Notes
fs.readFile(dbFilePath, 'utf8', (err, data) =>{
 if(err) {
    console.error(err);
 } else {
    const parsedNotes = JSON.parse(data);

    parsedNotes.push(newNote)
    fs.writeFile(
        dbFilePath,
        JSON.stringify(parsedNotes, null, 2),
        (writeErr) =>
            writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated Notes!')
    );
 }
});

const response = {
    status: 'success',
    body: newNote,
  };

  console.log(response);
  res.status(201).json(response);
} else {
  res.status(500).json('Error in posting note');
}
});
    // const notes = collectFileData(dbFilePath);
//     notes.push(addedNote);
//     addDataToFile(dbFilePath, notes);
// } else {
//     res.status(500).json('There was an error in posting the new note');
//     }
//     });
    
    app.delete('/api/notes/:id', (req, res) => {
    const parameterId = req.params.id;
    fs.readFile(dbFilePath, 'utf8', (err, data) =>{
        if(err) {
           console.error(err);
        } else {
           const notes = JSON.parse(data);
           const filterNotes = notes.filter(note => note.id != parameterId);
           fs.writeFile(
            dbFilePath,
            JSON.stringify(filterNotes, null, 2),
            (writeErr) =>
                writeErr
                ? console.error(writeErr)
                : res.status(201).json(notes)
        );
        }

    });
})
    
    app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`);
    });