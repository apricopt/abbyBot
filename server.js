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
    if(req.body.key) {
        if(req.body.key == "abbyBot2024"){
            launchBrowser(req, res)
        }
       
    }
    res.json("Failed Validation!")
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});