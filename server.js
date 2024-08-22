// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { launchBrowser } = require('./index');

// Create an instance of Express
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server Working');
});

app.post('/upwork', (req, res) => { 
   launchBrowser(req, res)
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});