const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); //incoming objects recognized as json
app.use(express.urlencoded({ extended: true }));

//sets root directory to 'public'
app.use(express.static(path.join(__dirname, 'public')));

//makes the start of the route /api
const api = express.Router();
app.use('/api', api);

//sets up first route to index
//localhost:3000/api
api.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//sets up route to notes
//localhost:3000/api/notes
api.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
});

//allows the server to actually run
app.listen(PORT, () => {
  console.log('Server is running');
});