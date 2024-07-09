const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//sets root directory to 'public'
app.use(express.static(path.join(__dirname, 'public')));

const api = express.Router();
app.use('/api', api);

//sets up first route to index
api.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//sets up route to notes
api.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'notes.html'));
});

//allows the server to actually run
app.listen(PORT, () => {
  console.log('Server is running');
});