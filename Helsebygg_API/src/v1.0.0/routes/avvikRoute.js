const express = require('express');

const { getAvvik, getAvvikByIdHandler, createAvvikHandler, getAvvikByStatusHandler, updateAvvikStatusHandler } = require('../controller/avvikController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /avvik - Get all avvik
router.get('/avvik', getAvvik);

// GET /avvik/:id - Get avvik by ID
router.get('/avvik/:id', getAvvikByIdHandler);

// POST /avvik - Create new avvik
router.post('/avvik', createAvvikHandler);

// GET /avvik/status/:id - Get avvik by status
router.get('/avvik/status/:id', getAvvikByStatusHandler);

// PUT /avvik/:id/status - Update avvik status
router.put('/avvik/:id/status', authenticateToken, authorizeRoles('Admin'), updateAvvikStatusHandler);

module.exports = router;