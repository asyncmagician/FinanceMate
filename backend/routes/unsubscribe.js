const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Public unsubscribe route (no auth required, uses token)
router.get('/:token', userController.unsubscribeWithToken);

module.exports = router;