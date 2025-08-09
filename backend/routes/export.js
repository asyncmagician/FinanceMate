const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const exportController = require('../controllers/exportController');

// Export all user data as JSON
router.get('/json', authMiddleware, exportController.exportUserData);

// Export expenses as CSV
router.get('/csv', authMiddleware, exportController.exportUserDataCSV);

module.exports = router;