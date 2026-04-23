const express = require('express');

const { registerUser, loginUserHandler } = require('../controller/authController');

const router = express.Router();

// POST /auth/register - Register new user
router.post('/auth/register', registerUser);

// POST /auth/login - Login user
router.post('/auth/login', loginUserHandler);

module.exports = router;