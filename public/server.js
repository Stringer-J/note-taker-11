const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); //incoming objects recognized as json
app.use(express.urlencoded({ extended: true }));

//sets root directory to 'public'
app.use(express.static(path.join(__dirname, 'public')));

//sets up first route to index
//localhost:3000/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//sets up route to notes
//localhost:3000/notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
});

app.get('/assets/js/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'js', 'index.js'));
});

app.get('/assets/css/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'css', 'styles.css'));
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../db', 'db.json'));
});

let notes = [];

const saveNotes = () => {
  const filePath = path.resolve(__dirname, '../db/db.json');
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
};

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  const newNote = {
    title, text
  };
  notes.push(newNote);
  saveNotes();
  console.log('new note added:', newNote);
  res.status(201).json(newNote);
});

//allows the server to actually run
app.listen(PORT, () => {
  console.log('Server is running');
});