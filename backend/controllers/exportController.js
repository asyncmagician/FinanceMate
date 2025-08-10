const monthModel = require('../models/monthModel');
const expenseModel = require('../models/expenseModel');
const userModel = require('../models/userModel');

exports.exportUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all user data including salary
    const [months, expenses, recurringExpenses, salary] = await Promise.all([
      monthModel.getAllByUser(userId),
      expenseModel.getAllByUser(userId),
      expenseModel.getRecurringByUser(userId),
      userModel.getSalary(userId)
    ]);

    // Prepare export data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        salary: salary, // Decrypted salary value (null if not set)
        memberSince: req.user.created_at
      },
      months: months.map(month => ({
        year: month.year,
        month: month.month,
        startingBalance: month.starting_balance,
        createdAt: month.created_at,
        updatedAt: month.updated_at
      })),
      expenses: expenses.map(expense => ({
        description: expense.description,
        amount: expense.amount,
        category: expense.category_type,
        subcategory: expense.subcategory,
        date: expense.date,
        isDeducted: expense.is_deducted,
        isReceived: expense.is_received,
        createdAt: expense.created_at
      })),
      recurringExpenses: recurringExpenses.map(expense => ({
        description: expense.description,
        amount: expense.amount,
        category: expense.category_type,
        subcategory: expense.subcategory,
        dayOfMonth: expense.day_of_month,
        startDate: expense.start_date,
        endDate: expense.end_date,
        isActive: expense.is_active
      })),
      summary: {
        totalMonths: months.length,
        totalExpenses: expenses.length,
        totalRecurringExpenses: recurringExpenses.length,
        totalSpent: expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
      }
    };

    // Set headers for JSON download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="financemate-export-${userId}-${Date.now()}.json"`);
    
    res.json(exportData);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
};

exports.exportUserDataCSV = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all expenses for CSV export
    const expenses = await expenseModel.getAllByUser(userId);
    
    // Create CSV header
    let csv = 'Date,Description,Amount,Category,Subcategory,Deducted,Received\n';
    
    // Add expense rows
    expenses.forEach(expense => {
      csv += `${expense.date || ''},`;
      csv += `"${expense.description.replace(/"/g, '""')}",`;
      csv += `${expense.amount},`;
      csv += `${expense.category_type},`;
      csv += `"${(expense.subcategory || '').replace(/"/g, '""')}",`;
      csv += `${expense.is_deducted ? 'Yes' : 'No'},`;
      csv += `${expense.is_received ? 'Yes' : 'No'}\n`;
    });

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="financemate-expenses-${userId}-${Date.now()}.csv"`);
    
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ error: 'Failed to export CSV data' });
  }
};