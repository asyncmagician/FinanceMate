const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Validation middleware for handling validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Données invalides',
      details: errors.array()
    });
  }
  next();
};

// GET /api/admin/users - Get all users
router.get('/users', adminController.getAllUsers);

// GET /api/admin/users/:id - Get user by ID
router.get('/users/:id', adminController.getUserById);

// POST /api/admin/users - Create new user
router.post('/users', [
  body('email')
    .isEmail()
    .withMessage('Adresse email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  body('firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le prénom est requis'),
  body('lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le nom est requis'),
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Le rôle doit être admin ou user'),
  handleValidationErrors
], adminController.createUser);

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Adresse email invalide')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le prénom ne peut pas être vide'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le nom ne peut pas être vide'),
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Le rôle doit être admin ou user'),
  handleValidationErrors
], adminController.updateUser);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;