const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const monthController = require('../controllers/monthController');
const { authMiddleware } = require('../middleware/auth');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(authMiddleware);

router.get('/', monthController.getUserMonths);

router.get('/forecast/:months',
  param('months').isInt({ min: 1, max: 12 }),
  handleValidationErrors,
  monthController.getForecast
);

router.get('/:year/:month/previsionnel',
  param('year').isInt({ min: 2020, max: 2100 }),
  param('month').isInt({ min: 1, max: 12 }),
  handleValidationErrors,
  monthController.calculatePrevisionnel
);

router.get('/:year/:month',
  param('year').isInt({ min: 2020, max: 2100 }),
  param('month').isInt({ min: 1, max: 12 }),
  handleValidationErrors,
  monthController.getMonth
);

router.post('/',
  body('year').isInt({ min: 2020, max: 2100 }),
  body('month').isInt({ min: 1, max: 12 }),
  body('starting_balance').isFloat(),
  handleValidationErrors,
  monthController.createMonth
);

router.put('/:year/:month',
  param('year').isInt({ min: 2020, max: 2100 }),
  param('month').isInt({ min: 1, max: 12 }),
  body('starting_balance').isFloat(),
  handleValidationErrors,
  monthController.updateMonth
);

module.exports = router;