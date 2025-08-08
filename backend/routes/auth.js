const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().trim()
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/login', loginValidation, handleValidationErrors, authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.post('/refresh', authController.refreshToken);

module.exports = router;