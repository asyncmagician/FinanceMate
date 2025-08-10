const monthModel = require('../models/monthModel');
const expenseModel = require('../models/expenseModel');
const calculationService = require('../services/calculationService');
const budgetAlertService = require('../services/budgetAlertService');

exports.getUserMonths = async (req, res) => {
  try {
    const userId = req.user.id;
    const months = await monthModel.getAllByUser(userId);
    res.json(months);
  } catch (error) {
    console.error('Get user months error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const userId = req.user.id;
    
    const monthData = await monthModel.findByYearMonth(userId, year, month);
    if (!monthData) {
      return res.status(404).json({ error: 'Month not found' });
    }
    
    res.json(monthData);
  } catch (error) {
    console.error('Get month error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createMonth = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month, starting_balance } = req.body;
    
    const existingMonth = await monthModel.findByYearMonth(userId, year, month);
    if (existingMonth) {
      return res.status(409).json({ error: 'Month already exists' });
    }
    
    const monthData = await monthModel.create({
      user_id: userId,
      year,
      month,
      starting_balance
    });
    
    res.status(201).json(monthData);
  } catch (error) {
    console.error('Create month error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const userId = req.user.id;
    const { starting_balance } = req.body;
    
    const monthData = await monthModel.findByYearMonth(userId, year, month);
    if (!monthData) {
      return res.status(404).json({ error: 'Month not found' });
    }
    
    const updated = await monthModel.update(monthData.id, { starting_balance });
    res.json(updated);
  } catch (error) {
    console.error('Update month error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.calculatePrevisionnel = async (req, res) => {
  try {
    const { year, month } = req.params;
    const userId = req.user.id;
    
    const monthData = await monthModel.findOrCreate(userId, year, month);
    const expenses = await expenseModel.getByMonth(monthData.id);
    
    const previsionnel = calculationService.calculatePrevisionnel(
      monthData.starting_balance,
      expenses
    );
    
    res.json({
      starting_balance: monthData.starting_balance,
      ...previsionnel
    });
  } catch (error) {
    console.error('Calculate previsionnel error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getForecast = async (req, res) => {
  try {
    const { months } = req.params;
    const userId = req.user.id;
    const monthsCount = parseInt(months);
    
    const currentDate = new Date();
    const forecast = [];
    
    for (let i = 1; i <= monthsCount; i++) {
      const forecastDate = new Date(currentDate);
      forecastDate.setMonth(currentDate.getMonth() + i);
      
      const year = forecastDate.getFullYear();
      const month = forecastDate.getMonth() + 1;
      
      const monthData = await monthModel.findOrCreate(userId, year, month);
      const expenses = await expenseModel.getByMonth(monthData.id);
      const recurringExpenses = await expenseModel.getRecurringForMonth(userId, year, month);
      
      const allExpenses = [...expenses, ...recurringExpenses];
      const previsionnel = calculationService.calculatePrevisionnel(
        monthData.starting_balance,
        allExpenses
      );
      
      forecast.push({
        year,
        month,
        starting_balance: monthData.starting_balance,
        ...previsionnel
      });
    }
    
    res.json({ forecast });
  } catch (error) {
    console.error('Get forecast error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.setBudgetLimit = async (req, res) => {
  try {
    const { year, month } = req.params;
    const { budgetLimit, alertThreshold } = req.body;
    const userId = req.user.id;
    
    // Find or create month
    const monthData = await monthModel.findOrCreate(userId, year, month);
    
    // Update budget limit
    await monthModel.updateBudgetLimit(monthData.id, budgetLimit, alertThreshold || 80);
    
    // Check if we should send an immediate alert
    if (budgetLimit) {
      budgetAlertService.checkUserBudget(userId, year, month)
        .catch(err => console.error('Budget alert check failed:', err));
    }
    
    res.json({ 
      message: 'Budget limit updated',
      budgetLimit,
      alertThreshold: alertThreshold || 80
    });
  } catch (error) {
    console.error('Set budget limit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBudgetStatus = async (req, res) => {
  try {
    const { year, month } = req.params;
    const userId = req.user.id;
    
    const monthData = await monthModel.findByYearMonth(userId, year, month);
    if (!monthData) {
      return res.json({ 
        hasBudget: false,
        budgetLimit: null,
        spent: 0,
        remaining: null,
        percentageUsed: 0
      });
    }
    
    // Get current spending
    const expenses = await expenseModel.getByMonth(monthData.id);
    const totalSpent = expenses.reduce((sum, expense) => {
      if (expense.category_name === 'Remboursement' && !expense.is_received) {
        return sum;
      }
      return sum + parseFloat(expense.amount);
    }, 0);
    
    const budgetLimit = monthData.budget_limit ? parseFloat(monthData.budget_limit) : null;
    
    res.json({
      hasBudget: !!budgetLimit,
      budgetLimit,
      spent: totalSpent,
      remaining: budgetLimit ? budgetLimit - totalSpent : null,
      percentageUsed: budgetLimit ? (totalSpent / budgetLimit) * 100 : 0,
      alertThreshold: monthData.alert_threshold_percent || 80
    });
  } catch (error) {
    console.error('Get budget status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};