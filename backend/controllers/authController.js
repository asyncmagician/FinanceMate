const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const emailService = require('../services/emailService');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Cette adresse e-mail est déjà utilisée' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
      email_verified: false,
      email_verification_token: verificationToken,
      email_verification_expires: verificationExpires
    });

    // Send verification email
    try {
      await emailService.sendEmailVerification(
        email,
        firstName,
        verificationToken
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue anyway - user can request resend
    }

    res.status(201).json({ 
      message: 'Compte créé avec succès. Veuillez vérifier votre email pour activer votre compte.',
      success: true,
      requiresVerification: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    // Check if email is verified (optional - you can make this required)
    if (!user.email_verified) {
      return res.status(403).json({ 
        error: 'Veuillez vérifier votre adresse email avant de vous connecter',
        requiresVerification: true,
        email: user.email
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Update last login timestamp
    await userModel.updateLastLogin(user.id);

    const token = generateToken(user);
    
    // Set token in HttpOnly cookie for security
    res.cookie('token', token, {
      httpOnly: true,        // Prevents JavaScript access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',    // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });
    
    res.json({
      // Don't send token in response body anymore
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.logout = async (req, res) => {
  // Clear the HttpOnly cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  res.json({ message: 'Logged out successfully' });
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      created_at: user.created_at,
      email_verified: user.email_verified
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await userModel.findByVerificationToken(token);
    if (!user) {
      return res.status(400).json({ error: 'Token de vérification invalide ou expiré' });
    }
    
    // Check if token is expired
    if (new Date() > new Date(user.email_verification_expires)) {
      return res.status(400).json({ error: 'Token de vérification expiré' });
    }
    
    // Mark email as verified
    await userModel.verifyEmail(user.id);
    
    res.json({ 
      message: 'Email vérifié avec succès',
      success: true 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification de l\'email' });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await userModel.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return res.json({ 
        message: 'Si un compte existe avec cette adresse, un email de vérification sera envoyé'
      });
    }
    
    if (user.email_verified) {
      return res.status(400).json({ error: 'Email déjà vérifié' });
    }
    
    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    await userModel.updateVerificationToken(user.id, verificationToken, verificationExpires);
    
    // Send verification email
    try {
      await emailService.sendEmailVerification(
        user.email,
        user.first_name,
        verificationToken
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
    }
    
    res.json({ 
      message: 'Email de vérification envoyé',
      success: true 
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email de vérification' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // First verify the token is valid (including expiration)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Token is still valid, no need to refresh
      return res.json({ message: 'Token still valid' });
    } catch (tokenError) {
      // Token is expired, check if it's within refresh window
      try {
        decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
          return res.status(401).json({ error: 'Invalid token format' });
        }
        
        // Allow refresh only if token expired within last 24 hours
        const expiredTime = decoded.exp * 1000;
        const now = Date.now();
        const refreshWindow = 24 * 60 * 60 * 1000; // 24 hours
        
        if (now - expiredTime > refreshWindow) {
          return res.status(401).json({ error: 'Token refresh window expired. Please login again.' });
        }
      } catch (decodeError) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
    
    const user = await userModel.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const newToken = generateToken(user);
    
    // Set new token in HttpOnly cookie
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });
    
    res.json({ message: 'Token refreshed' });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(userId, hashedPassword);
    
    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Erreur lors du changement de mot de passe' });
  }
};