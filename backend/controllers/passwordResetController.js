const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const emailService = require('../services/emailService');

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Find user by email
    const [users] = await pool.execute(
      'SELECT id, email, first_name FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      // Don't reveal if email exists
      return res.json({ 
        message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation.' 
      });
    }
    
    const user = users[0];
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour
    
    // Save token to database
    await pool.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [hashedToken, expires, user.id]
    );
    
    // Send email
    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        resetToken,
        user.first_name
      );
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({ 
      message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation.' 
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [hashedToken]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    res.json({ valid: true });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUppercase || !hasLowercase || !hasNumber) {
      return res.status(400).json({ 
        error: 'Password must contain uppercase, lowercase, and number' 
      });
    }
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find user with valid token
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [hashedToken]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    const userId = users[0].id;
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update password and clear reset token
    await pool.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, userId]
    );
    
    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};