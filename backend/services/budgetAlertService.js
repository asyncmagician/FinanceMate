const pool = require('../config/database');
const emailService = require('./emailService');
const userModel = require('../models/userModel');

class BudgetAlertService {
  constructor() {
    this.thresholds = {
      warning: 0.8,  // 80% of budget
      critical: 0.95  // 95% of budget
    };
  }

  async checkUserBudget(userId, year, month) {
    try {
      // Get user data and preferences
      const user = await userModel.findById(userId);
      if (!user || !user.email_budget_alerts) {
        return; // User doesn't want budget alerts
      }

      // Get user's monthly budget (if set)
      const [budgetRows] = await pool.execute(
        `SELECT budget_limit FROM months 
         WHERE user_id = ? AND year = ? AND month = ?`,
        [userId, year, month]
      );

      if (!budgetRows[0]?.budget_limit) {
        return; // No budget limit set
      }

      const budgetLimit = parseFloat(budgetRows[0].budget_limit);

      // Get current month's total expenses
      const [expenseRows] = await pool.execute(
        `SELECT 
          COALESCE(SUM(
            CASE 
              WHEN c.name = 'Remboursement' AND e.is_received = FALSE THEN 0
              ELSE e.amount 
            END
          ), 0) as total_spent
         FROM expenses e
         JOIN categories c ON e.category_id = c.id
         JOIN months m ON e.month_id = m.id
         WHERE m.user_id = ? AND m.year = ? AND m.month = ?`,
        [userId, year, month]
      );

      const totalSpent = parseFloat(expenseRows[0].total_spent);
      const percentageUsed = totalSpent / budgetLimit;

      // Check if we should send an alert
      const lastAlertKey = `budget_alert_${userId}_${year}_${month}`;
      const lastAlert = await this.getLastAlert(lastAlertKey);

      if (percentageUsed >= this.thresholds.critical && lastAlert !== 'critical') {
        await this.sendCriticalAlert(user, totalSpent, budgetLimit, year, month);
        await this.setLastAlert(lastAlertKey, 'critical');
      } else if (percentageUsed >= this.thresholds.warning && !lastAlert) {
        await this.sendWarningAlert(user, totalSpent, budgetLimit, year, month);
        await this.setLastAlert(lastAlertKey, 'warning');
      }
    } catch (error) {
      console.error('Budget alert check error:', error);
    }
  }

  async sendWarningAlert(user, spent, limit, year, month) {
    const percentage = Math.round((spent / limit) * 100);
    const remaining = limit - spent;
    
    try {
      await emailService.sendBudgetAlert(
        user.email,
        user.first_name,
        {
          type: 'warning',
          percentage,
          spent: spent.toFixed(2),
          limit: limit.toFixed(2),
          remaining: remaining.toFixed(2),
          month: `${month}/${year}`
        }
      );
    } catch (error) {
      console.error('Failed to send warning alert:', error);
    }
  }

  async sendCriticalAlert(user, spent, limit, year, month) {
    const percentage = Math.round((spent / limit) * 100);
    const remaining = limit - spent;
    
    try {
      await emailService.sendBudgetAlert(
        user.email,
        user.first_name,
        {
          type: 'critical',
          percentage,
          spent: spent.toFixed(2),
          limit: limit.toFixed(2),
          remaining: remaining.toFixed(2),
          month: `${month}/${year}`
        }
      );
    } catch (error) {
      console.error('Failed to send critical alert:', error);
    }
  }

  // Store alert state in a simple cache table or memory
  // For production, you might want to use Redis or a database table
  alertCache = new Map();

  async getLastAlert(key) {
    return this.alertCache.get(key);
  }

  async setLastAlert(key, value) {
    this.alertCache.set(key, value);
    // Clear after 30 days
    setTimeout(() => {
      this.alertCache.delete(key);
    }, 30 * 24 * 60 * 60 * 1000);
  }

  // Check all users' budgets (for scheduled job)
  async checkAllUsersBudgets() {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      // Get all users with budget alerts enabled
      const [users] = await pool.execute(
        'SELECT id FROM users WHERE email_budget_alerts = TRUE'
      );

      for (const user of users) {
        await this.checkUserBudget(user.id, year, month);
      }
    } catch (error) {
      console.error('Batch budget check error:', error);
    }
  }
}

module.exports = new BudgetAlertService();