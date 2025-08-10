const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const expenseController = require('../controllers/expenseController');
const { authMiddleware } = require('../middleware/auth');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const expenseValidation = [
  body('description')
    .notEmpty().withMessage('Description requise')
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Description entre 1 et 200 caractères'),
  body('amount')
    .isFloat({ min: 0.01, max: 999999 }).withMessage('Montant entre 0.01 et 999999'),
  body('category_id')
    .isInt({ min: 1, max: 3 }).withMessage('Catégorie invalide'),
  body('subcategory')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Sous-catégorie max 100 caractères'),
  body('date')
    .isISO8601().withMessage('Date invalide'),
  body('is_deducted')
    .optional()
    .isBoolean().withMessage('Valeur booléenne requise'),
  body('is_received')
    .optional()
    .isBoolean().withMessage('Valeur booléenne requise')
];

router.use(authMiddleware);

router.get('/month/:year/:month', 
  param('year').isInt({ min: 2020, max: 2100 }),
  param('month').isInt({ min: 1, max: 12 }),
  handleValidationErrors,
  expenseController.getMonthExpenses
);

router.post('/', 
  expenseValidation, 
  handleValidationErrors, 
  expenseController.createExpense
);

router.put('/:id', 
  param('id').isInt(),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Description entre 1 et 200 caractères'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01, max: 999999 }).withMessage('Montant entre 0.01 et 999999'),
  body('subcategory')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Sous-catégorie max 100 caractères'),
  body('is_deducted')
    .optional()
    .toBoolean(),
  body('is_received')
    .optional()
    .toBoolean(),
  handleValidationErrors,
  expenseController.updateExpense
);

router.delete('/:id',
  param('id').isInt(),
  handleValidationErrors,
  expenseController.deleteExpense
);

router.get('/recurring', expenseController.getRecurringExpenses);
const recurringValidation = [
  body('description')
    .notEmpty().withMessage('Description requise')
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Description entre 1 et 200 caractères'),
  body('amount')
    .isFloat({ min: 0.01, max: 999999 }).withMessage('Montant entre 0.01 et 999999'),
  body('category_id')
    .isInt({ min: 1, max: 3 }).withMessage('Catégorie invalide'),
  body('subcategory')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Sous-catégorie max 100 caractères'),
  body('day_of_month')
    .isInt({ min: 1, max: 31 }).withMessage('Jour du mois entre 1 et 31'),
  body('start_date')
    .isISO8601().withMessage('Date de début invalide')
];

router.post('/recurring', 
  recurringValidation,
  handleValidationErrors,
  expenseController.createRecurringExpense
);

router.put('/recurring/:id',
  param('id').isInt(),
  body('description').optional().trim().isLength({ min: 1, max: 200 }),
  body('amount').optional().isFloat({ min: 0.01, max: 999999 }),
  body('subcategory').optional().trim().isLength({ max: 100 }),
  body('day_of_month').optional().isInt({ min: 1, max: 31 }),
  body('share_type').optional().isIn(['none', 'percentage', 'amount', 'equal']),
  body('share_value').optional().custom((value, { req }) => {
    // For 'equal' type, share_value should be null
    // For 'percentage' or 'amount', it should be a number
    if (req.body.share_type === 'equal' || req.body.share_type === 'none') {
      return value === null || value === undefined;
    }
    if (req.body.share_type === 'percentage') {
      return value >= 0 && value <= 100;
    }
    if (req.body.share_type === 'amount') {
      return value >= 0;
    }
    return true;
  }).withMessage('Valeur de partage invalide pour le type sélectionné'),
  body('share_with').optional().trim().isLength({ max: 255 }),
  handleValidationErrors,
  expenseController.updateRecurringExpense
);

router.delete('/recurring/:id', expenseController.deleteRecurringExpense);

module.exports = router;