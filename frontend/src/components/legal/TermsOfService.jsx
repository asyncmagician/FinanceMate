import { useLanguage } from '../../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { APP_CONFIG } from '../../config/app.config';

export default function TermsOfService() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const lastUpdated = language === 'en' ? 'August 9th, 2025' : '9 août 2025';

  const Header = () => (
    <header className="bg-obsidian-bg-secondary border-b border-obsidian-border px-6 py-4 mb-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-obsidian-text-muted hover:text-obsidian-text flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === 'en' ? 'Back' : 'Retour'}
        </button>
        
        <div className="flex gap-4">
          {user ? (
            <Link to="/" className="text-obsidian-accent hover:underline">
              {language === 'en' ? 'Dashboard' : 'Tableau de bord'}
            </Link>
          ) : (
            <Link to="/login" className="text-obsidian-accent hover:underline">
              {language === 'en' ? 'Sign in' : 'Se connecter'}
            </Link>
          )}
        </div>
      </div>
    </header>
  );

  if (language === 'en') {
    return (
      <div className="min-h-screen bg-obsidian-bg">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-obsidian-text mb-6">Terms of Service</h1>
        <p className="text-obsidian-text-muted mb-4">Last updated: {lastUpdated}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">1. Acceptance of Terms</h2>
          <p className="text-obsidian-text-muted mb-4">
            By accessing and using FinanceMate ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
            If you do not agree to these Terms, please do not use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">2. Description of Service</h2>
          <p className="text-obsidian-text-muted mb-4">
            FinanceMate is a personal budget management application that helps you track expenses, manage budgets, 
            and forecast financial planning. The Service is provided "as is" and "as available."
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">3. User Account</h2>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the confidentiality of your password</li>
            <li>You are responsible for all activities under your account</li>
            <li>You must notify us immediately of any unauthorized use</li>
            <li>You must be at least 16 years old to use this Service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">4. Acceptable Use</h2>
          <p className="text-obsidian-text-muted mb-2">You agree NOT to:</p>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li>Use the Service for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Upload malicious code or viruses</li>
            <li>Use automated systems to access the Service</li>
            <li>Impersonate another person or entity</li>
            <li>Share your account with others</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">5. Data and Privacy</h2>
          <p className="text-obsidian-text-muted mb-4">
            Your use of the Service is also governed by our Privacy Policy. 
            You retain all rights to your financial data. We claim no ownership of your personal financial information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">6. Email Communications</h2>
          <p className="text-obsidian-text-muted mb-4">
            By using the Service, you understand that:
          </p>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li>Essential service emails (password reset, security alerts) cannot be disabled</li>
            <li>Optional emails (budget alerts, weekly summaries) require your explicit consent</li>
            <li>You can manage your email preferences in your profile settings at any time</li>
            <li>All emails include an unsubscribe option for optional communications</li>
            <li>We will never share your email address with third parties for marketing purposes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">7. Intellectual Property</h2>
          <p className="text-obsidian-text-muted mb-4">
            The Service and its original content (excluding user data), features, and functionality are owned by 
            {APP_CONFIG.legal.dataController} and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">8. Disclaimer of Warranties</h2>
          <p className="text-obsidian-text-muted mb-4">
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
            EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="text-obsidian-text-muted mb-4">
            We do not guarantee that the Service will be error-free, secure, or uninterrupted.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">9. Limitation of Liability</h2>
          <p className="text-obsidian-text-muted mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR USE, 
            ARISING FROM YOUR USE OF THE SERVICE.
          </p>
          <p className="text-obsidian-text-muted mb-4">
            This Service is a tool for personal budget management. We are not financial advisors. 
            Any financial decisions you make based on the Service are your sole responsibility.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">10. Indemnification</h2>
          <p className="text-obsidian-text-muted mb-4">
            You agree to indemnify and hold harmless {APP_CONFIG.legal.dataController} from any claims, damages, 
            losses, or expenses arising from your use of the Service or violation of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">11. Termination</h2>
          <p className="text-obsidian-text-muted mb-4">
            We may terminate or suspend your account at any time, without prior notice, for any reason, 
            including breach of these Terms. You may delete your account at any time through the profile settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">12. Changes to Terms</h2>
          <p className="text-obsidian-text-muted mb-4">
            We reserve the right to modify these Terms at any time. We will notify users of any material changes. 
            Your continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">13. Governing Law</h2>
          <p className="text-obsidian-text-muted mb-4">
            These Terms shall be governed by the laws of France and the European Union. 
            Any disputes shall be resolved in the courts of France.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">14. Contact Information</h2>
          <p className="text-obsidian-text-muted">
            For questions about these Terms, please contact:<br />
            {APP_CONFIG.legal.dataController}<br />
            Email: {APP_CONFIG.legal.dataControllerContact}
          </p>
        </section>
        </div>
        
        <footer className="mt-12 py-6 border-t border-obsidian-border">
          <div className="max-w-4xl mx-auto px-6 text-center text-obsidian-text-muted text-sm">
            <Link to="/privacy" className="text-obsidian-accent hover:underline mr-4">
              Privacy Policy
            </Link>
            <span>© 2025 FinanceMate</span>
          </div>
        </footer>
      </div>
    );
  }

  // French version
  return (
    <div className="min-h-screen bg-obsidian-bg">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-obsidian-text mb-6">Conditions d'Utilisation</h1>
      <p className="text-obsidian-text-muted mb-4">Dernière mise à jour : {lastUpdated}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">1. Acceptation des Conditions</h2>
        <p className="text-obsidian-text-muted mb-4">
          En accédant et en utilisant FinanceMate ("Service"), vous acceptez d'être lié par ces Conditions d'Utilisation ("Conditions"). 
          Si vous n'acceptez pas ces Conditions, veuillez ne pas utiliser le Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">2. Description du Service</h2>
        <p className="text-obsidian-text-muted mb-4">
          FinanceMate est une application de gestion budgétaire personnelle qui vous aide à suivre les dépenses, 
          gérer les budgets et prévoir la planification financière. Le Service est fourni "tel quel" et "selon disponibilité".
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">3. Compte Utilisateur</h2>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li>Vous devez fournir des informations exactes et complètes lors de la création d'un compte</li>
          <li>Vous êtes responsable de maintenir la confidentialité de votre mot de passe</li>
          <li>Vous êtes responsable de toutes les activités sous votre compte</li>
          <li>Vous devez nous notifier immédiatement de toute utilisation non autorisée</li>
          <li>Vous devez avoir au moins 16 ans pour utiliser ce Service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">4. Utilisation Acceptable</h2>
        <p className="text-obsidian-text-muted mb-2">Vous acceptez de NE PAS :</p>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li>Utiliser le Service à des fins illégales</li>
          <li>Tenter d'obtenir un accès non autorisé au Service</li>
          <li>Interférer avec ou perturber le Service</li>
          <li>Télécharger du code malveillant ou des virus</li>
          <li>Utiliser des systèmes automatisés pour accéder au Service</li>
          <li>Usurper l'identité d'une autre personne ou entité</li>
          <li>Partager votre compte avec d'autres</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">5. Données et Confidentialité</h2>
        <p className="text-obsidian-text-muted mb-4">
          Votre utilisation du Service est également régie par notre Politique de Confidentialité. 
          Vous conservez tous les droits sur vos données financières. Nous ne revendiquons aucune propriété sur vos informations financières personnelles.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">6. Communications par Email</h2>
        <p className="text-obsidian-text-muted mb-4">
          En utilisant le Service, vous comprenez que :
        </p>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li>Les emails de service essentiels (réinitialisation de mot de passe, alertes de sécurité) ne peuvent pas être désactivés</li>
          <li>Les emails optionnels (alertes budget, résumés hebdomadaires) nécessitent votre consentement explicite</li>
          <li>Vous pouvez gérer vos préférences email dans les paramètres de votre profil à tout moment</li>
          <li>Tous les emails incluent une option de désabonnement pour les communications optionnelles</li>
          <li>Nous ne partagerons jamais votre adresse email avec des tiers à des fins marketing</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">7. Propriété Intellectuelle</h2>
        <p className="text-obsidian-text-muted mb-4">
          Le Service et son contenu original (excluant les données utilisateur), ses fonctionnalités sont la propriété 
          de {APP_CONFIG.legal.dataController} et sont protégés par les lois internationales sur le droit d'auteur, les marques et autres droits de propriété intellectuelle.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">8. Exclusion de Garanties</h2>
        <p className="text-obsidian-text-muted mb-4">
          LE SERVICE EST FOURNI "TEL QUEL" SANS GARANTIES D'AUCUNE SORTE. NOUS DÉCLINONS TOUTES GARANTIES, 
          EXPRESSES OU IMPLICITES, Y COMPRIS LA QUALITÉ MARCHANDE, L'ADÉQUATION À UN USAGE PARTICULIER ET LA NON-VIOLATION.
        </p>
        <p className="text-obsidian-text-muted mb-4">
          Nous ne garantissons pas que le Service sera exempt d'erreurs, sécurisé ou ininterrompu.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">9. Limitation de Responsabilité</h2>
        <p className="text-obsidian-text-muted mb-4">
          DANS TOUTE LA MESURE PERMISE PAR LA LOI, NOUS NE SERONS PAS RESPONSABLES DES DOMMAGES INDIRECTS, 
          ACCESSOIRES, SPÉCIAUX, CONSÉCUTIFS OU PUNITIFS, Y COMPRIS LA PERTE DE PROFITS, DE DONNÉES OU D'UTILISATION, 
          DÉCOULANT DE VOTRE UTILISATION DU SERVICE.
        </p>
        <p className="text-obsidian-text-muted mb-4">
          Ce Service est un outil de gestion budgétaire personnelle. Nous ne sommes pas des conseillers financiers. 
          Toute décision financière que vous prenez basée sur le Service est de votre seule responsabilité.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">10. Indemnisation</h2>
        <p className="text-obsidian-text-muted mb-4">
          Vous acceptez d'indemniser et de dégager de toute responsabilité {APP_CONFIG.legal.dataController} de toute réclamation, 
          dommages, pertes ou dépenses découlant de votre utilisation du Service ou de la violation de ces Conditions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">11. Résiliation</h2>
        <p className="text-obsidian-text-muted mb-4">
          Nous pouvons résilier ou suspendre votre compte à tout moment, sans préavis, pour quelque raison que ce soit, 
          y compris la violation de ces Conditions. Vous pouvez supprimer votre compte à tout moment via les paramètres du profil.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">12. Modifications des Conditions</h2>
        <p className="text-obsidian-text-muted mb-4">
          Nous nous réservons le droit de modifier ces Conditions à tout moment. Nous informerons les utilisateurs de tout changement important. 
          Votre utilisation continue du Service après les changements constitue l'acceptation des nouvelles Conditions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">13. Droit Applicable</h2>
        <p className="text-obsidian-text-muted mb-4">
          Ces Conditions sont régies par les lois de France et de l'Union Européenne. 
          Tout litige sera résolu devant les tribunaux de France.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">14. Coordonnées</h2>
        <p className="text-obsidian-text-muted">
          Pour des questions sur ces Conditions, veuillez contacter :<br />
          {APP_CONFIG.legal.dataController}<br />
          Email : {APP_CONFIG.legal.dataControllerContact}
        </p>
      </section>
      </div>
      
      <footer className="mt-12 py-6 border-t border-obsidian-border">
        <div className="max-w-4xl mx-auto px-6 text-center text-obsidian-text-muted text-sm">
          <Link to="/privacy" className="text-obsidian-accent hover:underline mr-4">
            Politique de confidentialité
          </Link>
          <span>© 2025 FinanceMate</span>
        </div>
      </footer>
    </div>
  );
}