const userModel = require('../models/userModel');
const monthModel = require('../models/monthModel');
const expenseModel = require('../models/expenseModel');
const { validateEncryptionSetup } = require('../services/encryptionService');
const crypto = require('crypto');

exports.deleteUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Delete all user's expenses (will cascade delete from months)
    const months = await monthModel.getByUser(userId);
    for (const month of months) {
      await expenseModel.deleteByMonth(month.id);
    }
    
    // Delete all user's months
    await monthModel.deleteByUser(userId);
    
    // Delete all recurring expenses
    await expenseModel.deleteRecurringByUser(userId);
    
    res.json({ message: 'Toutes vos données ont été supprimées avec succès' });
  } catch (error) {
    console.error('Delete user data error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression des données' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Delete all user's expenses
    const months = await monthModel.getByUser(userId);
    for (const month of months) {
      await expenseModel.deleteByMonth(month.id);
    }
    
    // Delete all user's months
    await monthModel.deleteByUser(userId);
    
    // Delete all recurring expenses
    await expenseModel.deleteRecurringByUser(userId);
    
    // Delete the user account
    await userModel.deleteById(userId);
    
    res.json({ message: 'Votre compte a été supprimé avec succès' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du compte' });
  }
};

exports.updateSalary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { salary } = req.body;
    
    // Check if encryption is properly configured
    if (!validateEncryptionSetup()) {
      return res.status(500).json({ 
        error: 'Salary encryption is not properly configured. Please contact the administrator.' 
      });
    }
    
    // Validate salary input
    if (salary !== null && salary !== undefined && salary !== '') {
      const salaryNum = parseFloat(salary);
      if (isNaN(salaryNum)) {
        return res.status(400).json({ error: 'Le salaire doit être un nombre valide' });
      }
      if (salaryNum < 0) {
        return res.status(400).json({ error: 'Le salaire ne peut pas être négatif' });
      }
      if (salaryNum > 999999) {
        return res.status(400).json({ error: 'Le salaire est trop élevé' });
      }
    }
    
    await userModel.updateSalary(userId, salary);
    
    res.json({ 
      message: salary ? 'Salaire mis à jour avec succès' : 'Salaire supprimé avec succès'
    });
  } catch (error) {
    console.error('Update salary error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du salaire' });
  }
};

exports.getSalary = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if encryption is properly configured
    if (!validateEncryptionSetup()) {
      return res.status(500).json({ 
        error: 'Salary encryption is not properly configured. Please contact the administrator.' 
      });
    }
    
    const salary = await userModel.getSalary(userId);
    res.json({ salary });
  } catch (error) {
    console.error('Get salary error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du salaire' });
  }
};

exports.getEmailPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = await userModel.getEmailPreferences(userId);
    res.json(preferences);
  } catch (error) {
    console.error('Get email preferences error:', error);
    res.status(500).json({ error: 'Error fetching email preferences' });
  }
};

exports.updateEmailPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      email_notifications, 
      email_budget_alerts, 
      email_weekly_summary 
    } = req.body;
    
    // Update preferences and consent date
    const updates = {
      email_notifications: Boolean(email_notifications),
      email_budget_alerts: Boolean(email_budget_alerts),
      email_weekly_summary: Boolean(email_weekly_summary),
      email_consent_date: new Date()
    };
    
    await userModel.updateEmailPreferences(userId, updates);
    
    res.json({ 
      message: 'Email preferences updated successfully',
      preferences: updates
    });
  } catch (error) {
    console.error('Update email preferences error:', error);
    res.status(500).json({ error: 'Error updating email preferences' });
  }
};

exports.unsubscribeWithToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ error: 'Invalid unsubscribe token' });
    }
    
    // Find user by unsubscribe token
    const user = await userModel.findByUnsubscribeToken(token);
    
    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired unsubscribe token' });
    }
    
    // Disable all optional emails
    await userModel.updateEmailPreferences(user.id, {
      email_notifications: false,
      email_budget_alerts: false,
      email_weekly_summary: false,
      email_consent_date: new Date()
    });
    
    res.json({ 
      message: 'You have been successfully unsubscribed from all optional emails',
      email: user.email 
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Error processing unsubscribe request' });
  }
};