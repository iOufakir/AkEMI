const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const compression = require("compression");

require('dotenv').config();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306 // Use '||' instead of '|' for default port
});

/**************** Backend endpoints ****************/

// To save TEMPERATURE in the Database, this one will be invoked by Arduino HTTP CALL.
app.post('/api/environment/:environmentId/data', (req, res) => {
    const { temperature, humidity } = req.body;
    const { environmentId } = req.params;
    console.info('Received Temperature:', temperature);
    console.info('Received Humidity:', humidity);

    const sql = 'INSERT INTO environment_data (environment_id, temperature, humidity) VALUES (?, ?, ?)';
    const values = [environmentId, temperature, humidity];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting environment data:', err);
            res.status(500).json({ error: 'Failed to add environment data' });
            return;
        }
        res.json({ message: 'Environment data has been added successfully!' });
    });
});

// To get TEMPERATURE from the Database
app.get('/api/environment/:environmentId/data', (req, res) => {
    const { environmentId } = req.params;
    const sql = `SELECT temperature, humidity, name 
                FROM environment
                INNER JOIN environment_data
                ON environment.id = environment_id;`;
    pool.query(sql, [environmentId], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query: ' + err.stack);
            res.status(500).json({ error: 'Failed to fetch environment data!' });
        }
        res.json(results);
    });
});

// To save environment data in the Database
app.post('/api/environment', (req, res) => {
    const { name } = req.body;
    const sql = 'INSERT INTO environment (user_id, name) VALUES (?, ?)';
    //TODO: Temporary solution: just for DEMO
    const defaultUserId = 1;
    const values = [defaultUserId, name];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting environment data:', err);
            res.status(500).json({ error: 'Failed to add environment' });
            return;
        }
        res.json({ message: 'Environment data has been added successfully!' });
    });
});

// To receive environment data from the Database
app.get('/api/environment', (req, res) => {
    const sql = `SELECT e.id, e.name, ed.temperature, ed.humidity
    FROM environment e
    LEFT JOIN (
        SELECT ed1.*
        FROM environment_data ed1
        INNER JOIN (
            SELECT environment_id, MAX(created_at) AS latest
            FROM environment_data
            GROUP BY environment_id
        ) ed2 ON ed1.environment_id = ed2.environment_id AND ed1.created_at = ed2.latest
    ) ed ON e.id = ed.environment_id
    ORDER BY ed.created_at DESC;`;

    pool.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching environments:', err);
            res.status(500).json({ error: 'Failed to fetch environments' });
            return;
        }

        res.json(results);
    });
});

// Save plant info in the database
app.post('/api/plant', (req, res) => {
    const { name, growing_season, light_requirement, temperature_requirement, liquid_fertilizer_need } = req.body;

    const sql = 'INSERT INTO plant (user_id, name, growing_season, light_requirement, temperature_requirement, liquid_fertilizer_need) VALUES (?, ?, ?, ?, ?, ?)';
    //TODO: Temporary solution: just for DEMO
    const defaultUserId = 1;
    const values = [defaultUserId, name, growing_season, light_requirement, temperature_requirement, liquid_fertilizer_need];

    pool.query(sql, values, (err, result) => {
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

    pool.query(sql, (err, results) => {
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
    pool.query(sql, [username, password], (err, results) => {
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

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);

    // Connect to MySQL
    pool.getConnection((err, connection) => {
        if (err) {
            throw err;
        }
        console.info('Connected to MySQL database successfully!');
    });
});

// export the app for vercel serverless functions 
module.exports = app;
