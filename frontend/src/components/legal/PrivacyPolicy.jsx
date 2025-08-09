import { useLanguage } from '../../contexts/LanguageContext';

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  const lastUpdated = language === 'en' ? 'August 9th, 2025' : '9 août 2025';

  if (language === 'en') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-obsidian-text mb-6">Privacy Policy</h1>
        <p className="text-obsidian-text-muted mb-4">Last updated: {lastUpdated}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">1. Introduction</h2>
          <p className="text-obsidian-text-muted mb-4">
            FinanceMate ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our budget management application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-obsidian-text mb-2">Personal Information:</h3>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li>Name and email address (provided during registration)</li>
            <li>Account credentials (password is encrypted)</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-obsidian-text mb-2">Financial Information:</h3>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li>Monthly budgets and starting balances</li>
            <li>Expense descriptions and amounts</li>
            <li>Expense categories and subcategories</li>
            <li>Recurring expense templates</li>
          </ul>

          <h3 className="text-xl font-semibold text-obsidian-text mb-2">Technical Information:</h3>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li>Authentication tokens (stored in cookies)</li>
            <li>Language preference</li>
            <li>Access timestamps</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">3. How We Use Your Information</h2>
          <p className="text-obsidian-text-muted mb-2">We use your information to:</p>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li>Provide and maintain our service</li>
            <li>Calculate your monthly budget forecasts</li>
            <li>Manage your account and authentication</li>
            <li>Save your expense data for future access</li>
            <li>Remember your language preference</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">4. Data Storage and Security</h2>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li>Your data is stored on secure servers in France</li>
            <li>Passwords are encrypted using bcrypt</li>
            <li>All connections are secured with HTTPS/SSL</li>
            <li>We implement access controls and authentication</li>
            <li>Regular security updates are applied</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">5. Your Rights (GDPR)</h2>
          <p className="text-obsidian-text-muted mb-2">Under GDPR, you have the right to:</p>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li><strong>Access</strong> - Request a copy of your personal data</li>
            <li><strong>Rectification</strong> - Correct inaccurate personal data</li>
            <li><strong>Erasure</strong> - Delete your account and all associated data</li>
            <li><strong>Portability</strong> - Export your data in a machine-readable format</li>
            <li><strong>Object</strong> - Object to processing of your personal data</li>
            <li><strong>Withdraw consent</strong> - Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">6. Data Retention</h2>
          <p className="text-obsidian-text-muted mb-4">
            We retain your personal data only for as long as necessary to provide you with our service. 
            When you delete your account, all your personal data is permanently removed from our servers within 30 days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">7. Data Sharing</h2>
          <p className="text-obsidian-text-muted mb-4">
            We do NOT:
          </p>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li>Sell your personal data</li>
            <li>Share your data with third parties for marketing</li>
            <li>Transfer your data outside the EU without adequate protection</li>
          </ul>
          <p className="text-obsidian-text-muted mb-4">
            We may share data only:
          </p>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li>When required by law or legal process</li>
            <li>To protect our rights or prevent fraud</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">8. Cookies</h2>
          <p className="text-obsidian-text-muted mb-4">
            We use essential cookies for:
          </p>
          <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
            <li>Authentication (JWT tokens)</li>
            <li>Language preference</li>
            <li>Session management</li>
          </ul>
          <p className="text-obsidian-text-muted mb-4">
            These cookies are necessary for the application to function and cannot be disabled.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">9. Children's Privacy</h2>
          <p className="text-obsidian-text-muted mb-4">
            Our service is not intended for children under 16. We do not knowingly collect personal information from children under 16.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">10. Changes to This Policy</h2>
          <p className="text-obsidian-text-muted mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-obsidian-text mb-4">11. Contact Information</h2>
          <p className="text-obsidian-text-muted mb-4">
            For questions about this Privacy Policy or to exercise your rights, please contact:
          </p>
          <p className="text-obsidian-text-muted">
            Data Controller: Antony BARTOLOMUCCI<br />
            <a href="https://linkedin.com/in/bartolomucci" target="_blank" rel="noopener noreferrer" className="text-obsidian-accent hover:underline">
              LinkedIn Profile
            </a><br />
            <a href="https://github.com/asyncmagician" target="_blank" rel="noopener noreferrer" className="text-obsidian-accent hover:underline">
              GitHub: @asyncmagician
            </a>
          </p>
        </section>
      </div>
    );
  }

  // French version
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-obsidian-text mb-6">Politique de Confidentialité</h1>
      <p className="text-obsidian-text-muted mb-4">Dernière mise à jour : {lastUpdated}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">1. Introduction</h2>
        <p className="text-obsidian-text-muted mb-4">
          FinanceMate ("nous", "notre") s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre application de gestion budgétaire.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">2. Informations que nous collectons</h2>
        <h3 className="text-xl font-semibold text-obsidian-text mb-2">Informations personnelles :</h3>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li>Nom et adresse email (fournis lors de l'inscription)</li>
          <li>Identifiants de compte (mot de passe chiffré)</li>
        </ul>
        
        <h3 className="text-xl font-semibold text-obsidian-text mb-2">Informations financières :</h3>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li>Budgets mensuels et soldes de départ</li>
          <li>Descriptions et montants des dépenses</li>
          <li>Catégories et sous-catégories de dépenses</li>
          <li>Modèles de dépenses récurrentes</li>
        </ul>

        <h3 className="text-xl font-semibold text-obsidian-text mb-2">Informations techniques :</h3>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li>Jetons d'authentification (stockés dans les cookies)</li>
          <li>Préférence de langue</li>
          <li>Horodatages d'accès</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">3. Comment nous utilisons vos informations</h2>
        <p className="text-obsidian-text-muted mb-2">Nous utilisons vos informations pour :</p>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li>Fournir et maintenir notre service</li>
          <li>Calculer vos prévisions budgétaires mensuelles</li>
          <li>Gérer votre compte et l'authentification</li>
          <li>Sauvegarder vos données de dépenses pour un accès futur</li>
          <li>Mémoriser votre préférence de langue</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">4. Stockage et sécurité des données</h2>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li>Vos données sont stockées sur des serveurs sécurisés en France</li>
          <li>Les mots de passe sont chiffrés avec bcrypt</li>
          <li>Toutes les connexions sont sécurisées avec HTTPS/SSL</li>
          <li>Nous mettons en œuvre des contrôles d'accès et l'authentification</li>
          <li>Des mises à jour de sécurité régulières sont appliquées</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">5. Vos droits (RGPD)</h2>
        <p className="text-obsidian-text-muted mb-2">En vertu du RGPD, vous avez le droit de :</p>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li><strong>Accès</strong> - Demander une copie de vos données personnelles</li>
          <li><strong>Rectification</strong> - Corriger les données personnelles inexactes</li>
          <li><strong>Effacement</strong> - Supprimer votre compte et toutes les données associées</li>
          <li><strong>Portabilité</strong> - Exporter vos données dans un format lisible par machine</li>
          <li><strong>Opposition</strong> - Vous opposer au traitement de vos données personnelles</li>
          <li><strong>Retrait du consentement</strong> - Retirer votre consentement à tout moment</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">6. Conservation des données</h2>
        <p className="text-obsidian-text-muted mb-4">
          Nous conservons vos données personnelles uniquement le temps nécessaire pour vous fournir notre service. 
          Lorsque vous supprimez votre compte, toutes vos données personnelles sont définitivement supprimées de nos serveurs dans les 30 jours.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">7. Partage des données</h2>
        <p className="text-obsidian-text-muted mb-4">
          Nous ne faisons PAS :
        </p>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li>Vendre vos données personnelles</li>
          <li>Partager vos données avec des tiers à des fins marketing</li>
          <li>Transférer vos données hors de l'UE sans protection adéquate</li>
        </ul>
        <p className="text-obsidian-text-muted mb-4">
          Nous pouvons partager des données uniquement :
        </p>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li>Lorsque requis par la loi ou une procédure légale</li>
          <li>Pour protéger nos droits ou prévenir la fraude</li>
          <li>Avec votre consentement explicite</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">8. Cookies</h2>
        <p className="text-obsidian-text-muted mb-4">
          Nous utilisons des cookies essentiels pour :
        </p>
        <ul className="list-disc ml-6 text-obsidian-text-muted mb-4">
          <li>L'authentification (jetons JWT)</li>
          <li>La préférence de langue</li>
          <li>La gestion de session</li>
        </ul>
        <p className="text-obsidian-text-muted mb-4">
          Ces cookies sont nécessaires au fonctionnement de l'application et ne peuvent pas être désactivés.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">9. Protection des mineurs</h2>
        <p className="text-obsidian-text-muted mb-4">
          Notre service n'est pas destiné aux enfants de moins de 16 ans. Nous ne collectons pas sciemment d'informations personnelles d'enfants de moins de 16 ans.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">10. Modifications de cette politique</h2>
        <p className="text-obsidian-text-muted mb-4">
          Nous pouvons mettre à jour cette Politique de Confidentialité de temps en temps. Nous vous informerons de tout changement en mettant à jour la date de "Dernière mise à jour".
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-obsidian-text mb-4">11. Coordonnées</h2>
        <p className="text-obsidian-text-muted mb-4">
          Pour des questions sur cette Politique de Confidentialité ou pour exercer vos droits, veuillez utiliser le formulaire de contact dans les paramètres de votre profil ou nous contacter via :
        </p>
        <p className="text-obsidian-text-muted">
          Responsable du traitement : Antony BARTOLOMUCCI<br />
          <a href="https://linkedin.com/in/bartolomucci" target="_blank" rel="noopener noreferrer" className="text-obsidian-accent hover:underline">
            Profil LinkedIn
          </a><br />
          <a href="https://github.com/asyncmagician" target="_blank" rel="noopener noreferrer" className="text-obsidian-accent hover:underline">
            GitHub : @asyncmagician
          </a>
        </p>
      </section>
    </div>
  );
}