const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3000;

require('dotenv').config();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.info('Connected to MySQL database successfully!');
});

/**************** Backend endpoints ****************/

// To save Temperature from Arduino into the Database
app.post('/api/data', (req, res) => {
    const { temperature, humidity } = req.body;

    console.info('Received Temperature:', temperature);
    console.info('Received Humidity:', humidity);

    res.json({ message: 'Data has been saved successfully!' });
});

// To receive Temperature from the Database
app.get('/api/data', (req, res) => {

    console.info("THIS IS GET REQUEST");

    res.json({ message: 'Backend endpoint reached!' });
});


// Save plant info in the database
app.post('/api/plant', (req, res) => {
    const { name, growing_season, light_requirement, temperature_requirement, liquid_fertilizer_need } = req.body;

    const sql = 'INSERT INTO plant (user_id, name, growing_season, light_requirement, temperature_requirement, liquid_fertilizer_need) VALUES (?, ?, ?, ?, ?, ?)';
    //TODO: Temporary solution: just for DEMO
    const defaultUserId = 1;
    const values = [defaultUserId, name, growing_season, light_requirement, temperature_requirement, liquid_fertilizer_need];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting plant data:', err);
            res.status(500).json({ error: 'Failed to add plant' });
            return;
        }
        res.json({ message: 'Plant added successfully!' });
    });
});

// Get all plants form the database
app.get('/api/plants', (req, res) => {
    const sql = 'SELECT * FROM plant';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching plants:', err);
            res.status(500).json({ error: 'Failed to fetch plants' });
            return;
        }

        res.json(results);
    });
});

// Authentication when the user try to login
app.post('/api/auth', (req, res) => {
    //TODO: Temporary solution: just for DEMO
    const { username, password } = req.body;
    authenticateUser(username, password, (err, authenticated) => {
        if (err) {
            console.error('Error executing MySQL query: ' + err.stack);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (authenticated) {
            res.json({ status: 200, message: 'Success' });
        } else {
            res.status(401).json({ error: 'Unauthorized!' });
        }
    });
});

// Function to authenticate user
function authenticateUser(username, password, callback) {
    const sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
    connection.query(sql, [username, password], (err, results) => {
        if (err) {
            return callback(err);
        }
        if (results.length > 0) {
            return callback(null, true);
        } else {
            return callback(null, false);
        }
    });
}

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
});
