const expenseModel = require('../models/expenseModel');
const monthModel = require('../models/monthModel');

exports.getMonthExpenses = async (req, res) => {
  try {
    const { year, month } = req.params;
    const userId = req.user.id;

    const monthData = await monthModel.findOrCreate(userId, year, month);
    const expenses = await expenseModel.getByMonth(monthData.id);

    res.json({
      month: monthData,
      expenses
    });
  } catch (error) {
    console.error('Get month expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { description, amount, category_id, date, is_deducted, is_received } = req.body;
    
    const expenseDate = new Date(date);
    const year = expenseDate.getFullYear();
    const month = expenseDate.getMonth() + 1;
    
    const monthData = await monthModel.findOrCreate(userId, year, month);
    
    const expense = await expenseModel.create({
      month_id: monthData.id,
      description,
      amount,
      category_id,
      date,
      is_deducted: is_deducted || false,
      is_received: is_received || false
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const expense = await expenseModel.findById(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const monthData = await monthModel.findById(expense.month_id);
    if (monthData.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await expenseModel.update(id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const expense = await expenseModel.findById(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const monthData = await monthModel.findById(expense.month_id);
    if (monthData.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await expenseModel.delete(id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRecurringExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const recurring = await expenseModel.getRecurring(userId);
    res.json(recurring);
  } catch (error) {
    console.error('Get recurring expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createRecurringExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const recurring = await expenseModel.createRecurring({
      ...req.body,
      user_id: userId
    });
    res.status(201).json(recurring);
  } catch (error) {
    console.error('Create recurring expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteRecurringExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const recurring = await expenseModel.findRecurringById(id);
    if (!recurring) {
      return res.status(404).json({ error: 'Recurring expense not found' });
    }
    
    if (recurring.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await expenseModel.deleteRecurring(id);
    res.json({ message: 'Recurring expense deleted successfully' });
  } catch (error) {
    console.error('Delete recurring expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};