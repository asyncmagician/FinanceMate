const userModel = require('../models/userModel');
const monthModel = require('../models/monthModel');
const expenseModel = require('../models/expenseModel');

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