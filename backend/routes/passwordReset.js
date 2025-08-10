const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const passwordResetController = require('../controllers/passwordResetController');
const rateLimit = require('express-rate-limit');

// Rate limiter for password reset requests
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many password reset requests, please try again later'
});

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = require('express-validator').validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Request password reset
router.post('/request',
  resetLimiter,
  body('email').isEmail().normalizeEmail(),
  handleValidationErrors,
  passwordResetController.requestPasswordReset
);

// Validate reset token
router.get('/validate/:token',
  param('token').isLength({ min: 32 }),
  handleValidationErrors,
  passwordResetController.validateResetToken
);

// Reset password
router.post('/reset',
  body('token').isLength({ min: 32 }),
  body('password').isLength({ min: 8 }),
  handleValidationErrors,
  passwordResetController.resetPassword
);

module.exports = router;