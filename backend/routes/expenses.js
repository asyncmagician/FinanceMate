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
  body('description').notEmpty().trim().isLength({ max: 255 }),
  body('amount').isFloat({ min: 0.01 }),
  body('category_id').isInt({ min: 1 }),
  body('date').isISO8601(),
  body('is_deducted').optional().isBoolean(),
  body('is_received').optional().isBoolean()
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
  expenseValidation,
  handleValidationErrors,
  expenseController.updateExpense
);

router.delete('/:id',
  param('id').isInt(),
  handleValidationErrors,
  expenseController.deleteExpense
);

router.get('/recurring', expenseController.getRecurringExpenses);
router.post('/recurring', expenseController.createRecurringExpense);
router.delete('/recurring/:id', expenseController.deleteRecurringExpense);

module.exports = router;