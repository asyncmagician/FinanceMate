const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const monthModel = require('../models/monthModel');
const expenseModel = require('../models/expenseModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    
    // Format response to exclude sensitive data
    const usersData = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      createdAt: user.created_at,
      lastLogin: user.last_login
    }));

    res.json(usersData);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Return user data without password
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      createdAt: user.created_at,
      lastLogin: user.last_login
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Cette adresse e-mail est déjà utilisée' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'user'
    });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      role: newUser.role,
      message: 'Utilisateur créé avec succès'
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName, role, password } = req.body;
    
    // Check if user exists
    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // If email is being changed, check if new email is already taken
    if (email && email !== existingUser.email) {
      const emailTaken = await userModel.findByEmail(email);
      if (emailTaken) {
        return res.status(400).json({ error: 'Cette adresse e-mail est déjà utilisée' });
      }
    }

    // Prepare update data (only include provided fields)
    const updateData = {};
    if (email) updateData.email = email;
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (role) updateData.role = role;
    
    // Handle password update if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    await userModel.update(id, updateData);
    const updatedUser = await userModel.findById(id);

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      role: updatedUser.role,
      createdAt: updatedUser.created_at,
      lastLogin: updatedUser.last_login,
      message: 'Utilisateur mis à jour avec succès'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Prevent self-deletion
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    // Delete all user's expenses first
    const months = await monthModel.getByUser(id);
    for (const month of months) {
      await expenseModel.deleteByMonth(month.id);
    }
    
    // Delete all user's months
    await monthModel.deleteByUser(id);
    
    // Delete all recurring expenses
    await expenseModel.deleteRecurringByUser(id);
    
    // Finally delete the user
    await userModel.deleteById(id);

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
};