const dotenv = require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

const authRoute = require('./v1.0.0/routes/authRoute');
const avvikRoute = require('./v1.0.0/routes/avvikRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', authRoute);
app.use('/api/v1', avvikRoute);

app.listen(4020, () => {
    console.log('Server is running on port 4020');
});

module.exports = app;