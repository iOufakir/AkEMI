const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse JSON bodies
app.use(bodyParser.json());


/**************** Backend endpoints ****************/
app.get('/api/data', (req, res) => {
    
    console.info("THIS IS GET REQUEST");

    res.json({ message: 'Backend endpoint reached!' });
});

app.post('/api/data', (req, res) => {
    const { temperature, humidity } = req.body;

    console.log('Received Temperature:', temperature);
    console.log('Received Humidity:', humidity);

    res.json({ message: 'Data has been saved successfully!' });
});


// Authentication
app.post('/api/auth', (req, res) => {
    console.info("AUTH CALLED!");

    res.json({ message: 'Authentication called!' });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
});
