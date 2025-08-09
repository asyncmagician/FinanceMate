const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const exportController = require('../controllers/exportController');

// Export all user data as JSON
router.get('/json', authenticateToken, exportController.exportUserData);

// Export expenses as CSV
router.get('/csv', authenticateToken, exportController.exportUserDataCSV);

module.exports = router;