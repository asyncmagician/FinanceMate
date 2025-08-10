const { Resend } = require('resend');
require('dotenv').config();

class EmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
        text: text || this.htmlToText(html)
      });

      if (error) {
        console.error('Email send error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email, resetToken, userName) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { background: #f4f4f4; padding: 20px; margin-top: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>FinanceMate</h1>
              <p>Réinitialisation de mot de passe</p>
            </div>
            <div class="content">
              <h2>Bonjour ${userName || 'Utilisateur'},</h2>
              <p>Vous avez demandé la réinitialisation de votre mot de passe FinanceMate.</p>
              <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
              </div>
              <p><small>Ou copiez ce lien dans votre navigateur :</small></p>
              <p><small>${resetUrl}</small></p>
              <p><strong>Ce lien expire dans 1 heure.</strong></p>
              <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
            </div>
            <div class="footer">
              <p>© 2025 FinanceMate - Votre gestionnaire de budget privé</p>
              <p>Cet email a été envoyé depuis une adresse ne pouvant pas recevoir de réponses.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe FinanceMate',
      html
    });
  }

  async sendEmailVerification(email, verificationToken, userName) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { background: #f4f4f4; padding: 20px; margin-top: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>FinanceMate</h1>
              <p>Vérification de votre adresse email</p>
            </div>
            <div class="content">
              <h2>Bienvenue ${userName || 'sur FinanceMate'} !</h2>
              <p>Merci de vous être inscrit à FinanceMate, votre gestionnaire de budget personnel.</p>
              <p>Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
              <div style="text-align: center;">
                <a href="${verifyUrl}" class="button">Vérifier mon email</a>
              </div>
              <p><small>Ou copiez ce lien dans votre navigateur :</small></p>
              <p><small>${verifyUrl}</small></p>
              <p><strong>Ce lien expire dans 24 heures.</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 FinanceMate - Votre gestionnaire de budget privé</p>
              <p>Cet email a été envoyé depuis une adresse ne pouvant pas recevoir de réponses.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Vérifiez votre email pour FinanceMate',
      html
    });
  }

  async sendBudgetAlert(email, userName, currentBalance, threshold) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff9800; color: white; padding: 20px; text-align: center; }
            .content { background: #f4f4f4; padding: 20px; margin-top: 20px; }
            .alert-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 24px; background: #1a1a1a; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Alerte Budget</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${userName || 'Utilisateur'},</h2>
              <div class="alert-box">
                <strong>Attention !</strong> Votre prévisionnel est descendu en dessous de votre seuil d'alerte.
                <br><br>
                <strong>Prévisionnel actuel :</strong> ${currentBalance} €<br>
                <strong>Seuil configuré :</strong> ${threshold} €
              </div>
              <p>Il est peut-être temps de vérifier vos dépenses et d'ajuster votre budget.</p>
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Voir mon tableau de bord</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 FinanceMate - Votre gestionnaire de budget privé</p>
              <p>Vous recevez cet email car vous avez activé les alertes budget.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '⚠️ Alerte Budget FinanceMate',
      html
    });
  }

  // Simple HTML to text converter for email clients that need plain text
  htmlToText(html) {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gs, '')
      .replace(/<script[^>]*>.*?<\/script>/gs, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

module.exports = new EmailService();