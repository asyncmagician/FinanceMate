export const translations = {
  fr: {
    // Common
    loading: 'Chargement...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    create: 'Créer',
    close: 'Fermer',
    confirm: 'Confirmer',
    back: 'Retour',
    logout: 'Déconnexion',
    
    // Auth
    login: {
      title: 'FinanceMate',
      email: 'Adresse email',
      password: 'Mot de passe',
      submit: 'Se connecter',
      register: 'Créer un compte',
      noAccount: "Pas encore de compte ?",
      invalidCredentials: 'Identifiants invalides. Veuillez vérifier votre email et mot de passe.',
      successRegistration: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
    },
    
    register: {
      title: 'Créer un compte',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Adresse email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      submit: 'Créer le compte',
      hasAccount: 'Déjà un compte ?',
      login: 'Se connecter',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
      emailTaken: 'Cette adresse e-mail est déjà utilisée',
      registrationError: 'Erreur lors de la création du compte'
    },
    
    // Profile
    profile: {
      title: 'Profil',
      accountInfo: 'Informations du compte',
      email: 'Email',
      name: 'Nom',
      role: 'Rôle',
      admin: 'Administrateur',
      user: 'Utilisateur',
      memberSince: 'Membre depuis',
      
      security: 'Sécurité',
      changePassword: 'Changer le mot de passe',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmNewPassword: 'Confirmer le nouveau mot de passe',
      passwordChanged: 'Mot de passe modifié avec succès',
      wrongPassword: 'Mot de passe actuel incorrect',
      passwordsDontMatch: 'Les nouveaux mots de passe ne correspondent pas',
      
      dataManagement: 'Gestion des données',
      importData: 'Importer des données (bientôt disponible)',
      deleteAllData: 'Supprimer toutes mes données',
      
      dangerZone: 'Zone dangereuse',
      dangerWarning: 'Ces actions sont irréversibles. Veuillez procéder avec prudence.',
      deleteAccount: 'Supprimer mon compte',
      
      about: 'À propos',
      aboutText: 'FinanceMate est une application de gestion budgétaire personnelle développée pour simplifier le suivi des dépenses mensuelles et la planification financière.',
      version: 'Version',
      createdBy: 'Créé par',
      sourceCode: 'Code source',
      
      language: 'Langue',
      selectLanguage: 'Sélectionner la langue'
    },
    
    // Dashboard
    dashboard: {
      title: 'Tableau de bord',
      currentMonth: 'Mois actuel',
      previsionnel: 'Prévisionnel',
      totalExpenses: 'Dépenses totales',
      recentExpenses: 'Dépenses récentes',
      pendingReimbursements: 'Remboursements en attente',
      quickActions: 'Actions rapides',
      addExpense: 'Ajouter une dépense',
      viewForecast: 'Voir les prévisions',
      manageRecurring: 'Gérer les récurrentes',
      spendingHistory: 'Historique des dépenses'
    },
    
    // Months
    months: {
      january: 'Janvier',
      february: 'Février',
      march: 'Mars',
      april: 'Avril',
      may: 'Mai',
      june: 'Juin',
      july: 'Juillet',
      august: 'Août',
      september: 'Septembre',
      october: 'Octobre',
      november: 'Novembre',
      december: 'Décembre'
    },
    
    // Expenses
    expenses: {
      title: 'Dépenses',
      add: 'Ajouter une dépense',
      edit: 'Modifier la dépense',
      delete: 'Supprimer la dépense',
      recurring: 'Dépenses récurrentes',
      fixed: 'Dépenses Fixes',
      variable: 'Dépenses Variables',
      reimbursement: 'Remboursements',
      description: 'Description',
      amount: 'Montant',
      category: 'Catégorie',
      subcategory: 'Sous-catégorie',
      date: 'Date',
      deducted: 'Déduit',
      received: 'Reçu',
      pending: 'En attente',
      noExpenses: 'Aucune dépense pour ce mois',
      total: 'Total'
    },
    
    // Forecast
    forecast: {
      title: 'Prévisions',
      months3: '3 mois',
      months6: '6 mois',
      months12: '12 mois',
      projectedBalance: 'Solde projeté',
      averageExpenses: 'Dépenses moyennes',
      explanation: 'Explication du calcul'
    },
    
    // Recurring
    recurring: {
      title: 'Gérer les dépenses récurrentes',
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      apply: 'Appliquer au mois actuel',
      dayOfMonth: 'Jour du mois',
      startDate: 'Date de début',
      noRecurring: 'Aucune dépense récurrente configurée',
      description: 'Ces dépenses seront automatiquement ajoutées chaque mois'
    },
    
    // Confirmations
    confirm: {
      deleteExpense: 'Voulez-vous vraiment supprimer',
      deleteData: 'Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action supprimera tous vos mois, dépenses et dépenses récurrentes, mais conservera votre compte.',
      deleteAccount: 'Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible et supprimera toutes vos données.'
    }
  },
  
  en: {
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    logout: 'Logout',
    
    // Auth
    login: {
      title: 'FinanceMate',
      email: 'Email address',
      password: 'Password',
      submit: 'Sign in',
      register: 'Create account',
      noAccount: "Don't have an account?",
      invalidCredentials: 'Invalid credentials. Please check your email and password.',
      successRegistration: 'Account created successfully! You can now sign in.'
    },
    
    register: {
      title: 'Create account',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm password',
      submit: 'Create account',
      hasAccount: 'Already have an account?',
      login: 'Sign in',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      emailTaken: 'This email address is already in use',
      registrationError: 'Error creating account'
    },
    
    // Profile
    profile: {
      title: 'Profile',
      accountInfo: 'Account information',
      email: 'Email',
      name: 'Name',
      role: 'Role',
      admin: 'Administrator',
      user: 'User',
      memberSince: 'Member since',
      
      security: 'Security',
      changePassword: 'Change password',
      currentPassword: 'Current password',
      newPassword: 'New password',
      confirmNewPassword: 'Confirm new password',
      passwordChanged: 'Password changed successfully',
      wrongPassword: 'Current password is incorrect',
      passwordsDontMatch: 'New passwords do not match',
      
      dataManagement: 'Data management',
      importData: 'Import data (coming soon)',
      deleteAllData: 'Delete all my data',
      
      dangerZone: 'Danger zone',
      dangerWarning: 'These actions are irreversible. Please proceed with caution.',
      deleteAccount: 'Delete my account',
      
      about: 'About',
      aboutText: 'FinanceMate is a personal budget management application designed to simplify monthly expense tracking and financial planning.',
      version: 'Version',
      createdBy: 'Created by',
      sourceCode: 'Source code',
      
      language: 'Language',
      selectLanguage: 'Select language'
    },
    
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      currentMonth: 'Current month',
      previsionnel: 'Forecast',
      totalExpenses: 'Total expenses',
      recentExpenses: 'Recent expenses',
      pendingReimbursements: 'Pending reimbursements',
      quickActions: 'Quick actions',
      addExpense: 'Add expense',
      viewForecast: 'View forecast',
      manageRecurring: 'Manage recurring',
      spendingHistory: 'Spending history'
    },
    
    // Months
    months: {
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December'
    },
    
    // Expenses
    expenses: {
      title: 'Expenses',
      add: 'Add expense',
      edit: 'Edit expense',
      delete: 'Delete expense',
      recurring: 'Recurring expenses',
      fixed: 'Fixed Expenses',
      variable: 'Variable Expenses',
      reimbursement: 'Reimbursements',
      description: 'Description',
      amount: 'Amount',
      category: 'Category',
      subcategory: 'Subcategory',
      date: 'Date',
      deducted: 'Deducted',
      received: 'Received',
      pending: 'Pending',
      noExpenses: 'No expenses for this month',
      total: 'Total'
    },
    
    // Forecast
    forecast: {
      title: 'Forecast',
      months3: '3 months',
      months6: '6 months',
      months12: '12 months',
      projectedBalance: 'Projected balance',
      averageExpenses: 'Average expenses',
      explanation: 'Calculation explanation'
    },
    
    // Recurring
    recurring: {
      title: 'Manage recurring expenses',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      apply: 'Apply to current month',
      dayOfMonth: 'Day of month',
      startDate: 'Start date',
      noRecurring: 'No recurring expenses configured',
      description: 'These expenses will be automatically added each month'
    },
    
    // Confirmations
    confirm: {
      deleteExpense: 'Are you sure you want to delete',
      deleteData: 'Are you sure you want to delete all your data? This will delete all your months, expenses and recurring expenses, but keep your account.',
      deleteAccount: 'Are you sure you want to permanently delete your account? This action is irreversible and will delete all your data.'
    }
  }
};