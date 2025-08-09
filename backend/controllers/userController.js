const userModel = require('../models/userModel');
const monthModel = require('../models/monthModel');
const expenseModel = require('../models/expenseModel');
const { validateEncryptionSetup } = require('../services/encryptionService');

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