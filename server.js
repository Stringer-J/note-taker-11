const express = require('express'); //lets me use express
const path = require('path'); //lets me use path
const fs = require('fs'); //lets me use fs

const app = express();  //makes 'app' an instance of express
const PORT = process.env.PORT || 3001; //sets port to 3001 regardless of actual port being used?

app.use(express.json()); //incoming objects recognized as json
app.use(express.urlencoded({ extended: true }));

//sets root directory to 'public'
app.use(express.static('public'));

//sets up first route to index
//localhost:3001/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//sets up route to notes
//localhost:3001/notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//gets the index.js file so we can use it
app.get('/assets/js/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'js', 'index.js'));
});

//gets the styles.css file so we can use it
app.get('/assets/css/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'css', 'styles.css'));
});

//gets the db.json so we can read and write notes to and from it
// app.get('/api/notes', (req, res) => {
//   const filePath= res.sendFile(path.join(__dirname, 'db', 'db.json'));
//   console.log(filePath);
//   console.log(__dirname);
// });

app.get('/api/notes', (req, res) => {
  const filePath = path.join(__dirname, 'db', 'db.json');
  console.log(filePath);  // Log the file path to check if it's correct
  console.log(__dirname); // Log the directory name

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(err.status).end();
    }
  });
});

//creates an array for saving notes to
let notes = [];

//function that load notes you already saved
const loadNotes = () => {
  const filePath = path.resolve(__dirname, 'db', 'db.json');
  const data = fs.readFileSync(filePath, 'utf8');
  notes = JSON.parse(data);
};

loadNotes(); //actually rund the load function

//function that writes notes to db.json
const saveNotes = () => {
  const filePath = path.resolve(__dirname, 'db', 'db.json');
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8'); //writes file, stringifies 'notes' and makes the output object look nicer for people
};

//function that generates an id for each note
const generateId = (array) => {

  const maxId = array.reduce((max, item) => (item.id > max ? item.id : max), 0);
  let nextId = maxId + 1;
  return array.map(item => ({
    ...item,
    id: item.id ? item.id : nextId++
  }));
};

//post request that actually adds each note to db.json
app.post('/api/notes', (req, res) => {

  const { title, text } = req.body; //makes an object that used the user text for title and text
  const newNote = { //creates newNote with null id to be changed later and the title and text from before
    id: null, title, text
  };

  notes.push(newNote); //pushes newNote object to the notes array i made earlier

  const notesWithId = generateId(notes);
  const updatedNote = notesWithId.find(note => note.title === newNote.title && note.text === newNote.text);
  newNote.id = updatedNote.id;

  saveNotes(notesWithId);

  console.log('new note added:', newNote);
  res.status(201).json(newNote);
});

//allows the server to actually run
app.listen(PORT, () => {
  console.log('Server is running');
});