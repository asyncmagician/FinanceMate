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
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #5e5ce6 0%, #4b49d8 100%); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 500; box-shadow: 0 2px 4px rgba(94, 92, 230, 0.3); }
            .button:hover { background: linear-gradient(135deg, #4b49d8 0%, #3937c0 100%); }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .link-text { color: #5e5ce6; word-break: break-all; }
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
              <p><small style="color: #666;">Ou copiez ce lien dans votre navigateur :</small></p>
              <p><small class="link-text">${resetUrl}</small></p>
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
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #5e5ce6 0%, #4b49d8 100%); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 500; box-shadow: 0 2px 4px rgba(94, 92, 230, 0.3); }
            .button:hover { background: linear-gradient(135deg, #4b49d8 0%, #3937c0 100%); }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .link-text { color: #5e5ce6; word-break: break-all; }
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
              <p><small style="color: #666;">Ou copiez ce lien dans votre navigateur :</small></p>
              <p><small class="link-text">${verifyUrl}</small></p>
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

  async sendBudgetAlert(email, userName, currentBalance, threshold, unsubscribeToken) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b35 0%, #f7542e 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; }
            .alert-box { background: #fff5f5; border-left: 4px solid #ff6b35; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #5e5ce6 0%, #4b49d8 100%); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 500; box-shadow: 0 2px 4px rgba(94, 92, 230, 0.3); }
            .button:hover { background: linear-gradient(135deg, #4b49d8 0%, #3937c0 100%); }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
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
              ${unsubscribeToken ? `<p><a href="${process.env.FRONTEND_URL}/api/unsubscribe/${unsubscribeToken}" style="color: #666; text-decoration: underline;">Se désabonner des alertes</a></p>` : ''}
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

  async sendWeeklySummary(email, userName, summaryData, unsubscribeToken) {
    const { totalExpenses, remainingBudget, expensesByCategory, weekStart, weekEnd } = summaryData;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; }
            .stat-box { background: #f8f8f8; padding: 15px; margin: 15px 0; border-radius: 6px; }
            .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #5e5ce6 0%, #4b49d8 100%); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 500; box-shadow: 0 2px 4px rgba(94, 92, 230, 0.3); }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Résumé Hebdomadaire</h1>
              <p>${weekStart} - ${weekEnd}</p>
            </div>
            <div class="content">
              <h2>Bonjour ${userName || 'Utilisateur'},</h2>
              <p>Voici votre résumé budgétaire de la semaine :</p>
              
              <div class="stat-box">
                <strong>Total des dépenses :</strong> ${totalExpenses} €<br>
                <strong>Budget restant :</strong> ${remainingBudget} €
              </div>
              
              ${expensesByCategory ? `
              <h3>Dépenses par catégorie :</h3>
              <ul>
                ${Object.entries(expensesByCategory).map(([cat, amount]) => 
                  `<li>${cat}: ${amount} €</li>`
                ).join('')}
              </ul>
              ` : ''}
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Voir le détail</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 FinanceMate - Votre gestionnaire de budget privé</p>
              ${unsubscribeToken ? `<p><a href="${process.env.FRONTEND_URL}/api/unsubscribe/${unsubscribeToken}" style="color: #666; text-decoration: underline;">Se désabonner des résumés hebdomadaires</a></p>` : ''}
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '📊 Votre résumé budgétaire hebdomadaire',
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