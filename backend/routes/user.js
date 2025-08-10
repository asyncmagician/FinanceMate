const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Delete all user data (keeps account)
router.delete('/data', userController.deleteUserData);

// Delete user account (and all data)
router.delete('/account', userController.deleteAccount);

// Salary management endpoints
router.get('/salary', userController.getSalary);
router.put('/salary', userController.updateSalary);

// Email preferences endpoints
router.get('/email-preferences', userController.getEmailPreferences);
router.put('/email-preferences', userController.updateEmailPreferences);

module.exports = router;