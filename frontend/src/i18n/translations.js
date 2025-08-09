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
    
    common: {
      add: 'Ajouter',
      choose: 'Choisir'
    },
    
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
    
    // Sidebar
    sidebar: {
      dashboard: 'Tableau de bord',
      forecast: 'Prévisions',
      recurring: 'Dépenses récurrentes',
      months: 'Mois'
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
      passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
      passwordRequired: 'Mot de passe actuel requis',
      newPasswordRequired: 'Nouveau mot de passe requis',
      
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
      selectLanguage: 'Sélectionner la langue',
      comingSoon: 'Fonctionnalité bientôt disponible',
      deleteAllDataTitle: 'Supprimer toutes les données',
      deleteDataButton: 'Supprimer les données',
      deleteAccountTitle: 'Supprimer le compte',
      deleteAccountButton: 'Supprimer mon compte'
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
      spendingHistory: 'Historique des dépenses',
      overview: 'Vue d\'ensemble de vos finances',
      fixedExpenses: 'Dépenses fixes',
      variableExpenses: 'Dépenses variables',
      noExpensesThisMonth: 'Aucune dépense ce mois-ci',
      toReceiveSoon: 'À recevoir prochainement',
      noPendingReimbursements: 'Aucun remboursement en attente'
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
    
    // Previsionnel
    previsionnel: {
      title: 'Prévisionnel',
      startingBalance: 'Solde de départ',
      update: 'Mettre à jour',
      updateBalance: 'Mettre à jour le solde',
      formula: 'Calcul: Solde de départ - Dépenses fixes - Dépenses variables + Remboursements',
      amountInvalid: 'Le montant doit être un nombre valide',
      amountOutOfBounds: 'Le montant est hors limites',
      finalBalance: 'Prévisionnel final'
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
      subcategoryOther: 'Autre',
      date: 'Date',
      day: 'Jour',
      deducted: 'Déduit',
      received: 'Reçu',
      pending: 'En attente',
      noExpenses: 'Aucune dépense pour ce mois',
      total: 'Total',
      addExpenseTitle: 'Ajouter une dépense',
      descriptionPlaceholder: 'Description de la dépense',
      amountPlaceholder: 'Montant en EUR',
      customSubcategory: 'Nom personnalisé',
      customSubcategoryPlaceholder: 'Entrez le nom de la sous-catégorie',
      // Subcategories
      housing: 'Logement',
      car: 'Voiture',
      credit: 'Crédit',
      health: 'Santé',
      servers: 'Serveurs',
      subscriptions: 'Abonnements',
      groceries: 'Courses',
      restaurant: 'Restaurant',
      outings: 'Sorties',
      gas: 'Essence',
      shopping: 'Shopping',
      other: 'Autre',
      noCategory: 'Sans catégorie',
      // Validation
      descriptionRequired: 'La description est requise',
      descriptionTooLong: 'La description ne peut pas dépasser 200 caractères',
      amountRequired: 'Le montant est requis',
      amountInvalid: 'Le montant doit être un nombre valide',
      amountTooSmall: 'Le montant doit être supérieur à 0',
      amountTooLarge: 'Le montant est trop élevé',
      subcategoryRequired: 'Le nom de la sous-catégorie est requis'
    },
    
    // Forecast
    forecast: {
      title: 'Prévisions',
      months3: '3 mois',
      months6: '6 mois',
      months12: '12 mois',
      projectedBalance: 'Solde projeté',
      averageExpenses: 'Dépenses moyennes',
      explanation: 'Explication du calcul',
      loading: 'Chargement des prévisions...',
      subtitle: 'Projection de vos finances futures basée sur vos dépenses moyennes',
      settings: 'Paramètres de prévision',
      averageVariableExpenses: 'Moyenne des dépenses variables',
      numberOfMonths: 'Nombre de mois',
      evolutionTitle: 'Évolution prévisionnelle',
      plannedRecurring: 'Dépenses récurrentes prévues',
      monthlyRecurringTotal: 'Total mensuel récurrent',
      inMonths: 'Dans {{months}} mois',
      variablesEstimated: 'Variables (estimé)',
      estimatedPrevisionnel: 'Prévisionnel estimé',
      howCalculated: 'Comment sont calculées les prévisions ?',
      explanationFixed: 'Les dépenses fixes sont basées sur vos dépenses récurrentes configurées',
      explanationVariable: 'Les dépenses variables sont estimées sur la moyenne des 3 derniers mois',
      explanationBalance: 'Le solde de départ de chaque mois est le prévisionnel du mois précédent',
      explanationReimbursements: 'Les remboursements ne sont pas inclus dans les projections futures'
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
      description: 'Ces dépenses seront automatiquement ajoutées chaque mois',
      invalidDay: 'Jour invalide (1-31)',
      cancelEdit: "Annuler l'édition",
      descriptionPlaceholder: 'Description (ex: Loyer)',
      dayLabel: 'Jour',
      pageTitle: 'Dépenses Récurrentes',
      pageDescription: 'Gérez vos dépenses fixes mensuelles. Ces dépenses peuvent être appliquées automatiquement à chaque mois.',
      templates: 'Templates de dépenses',
      addRecurringExpense: 'Ajouter une dépense récurrente',
      ofMonth: 'du mois',
      howToTitle: 'Comment utiliser les dépenses récurrentes ?',
      howTo1: 'Ajoutez vos dépenses fixes mensuelles (loyer, abonnements, etc.)',
      howTo2: 'Naviguez vers un mois spécifique',
      howTo3: 'Cliquez sur "Dépenses récurrentes" puis "Appliquer au mois actuel"',
      howTo4: 'Les dépenses seront ajoutées automatiquement (sans doublon)',
      deleteTitle: 'Supprimer la dépense récurrente'
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
    
    common: {
      add: 'Add',
      choose: 'Choose'
    },
    
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
    
    // Sidebar
    sidebar: {
      dashboard: 'Dashboard',
      forecast: 'Forecast',
      recurring: 'Recurring expenses',
      months: 'Months'
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
      passwordTooShort: 'Password must be at least 6 characters',
      passwordRequired: 'Current password required',
      newPasswordRequired: 'New password required',
      
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
      selectLanguage: 'Select language',
      comingSoon: 'Coming soon',
      deleteAllDataTitle: 'Delete all data',
      deleteDataButton: 'Delete data',
      deleteAccountTitle: 'Delete account',
      deleteAccountButton: 'Delete my account'
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
      spendingHistory: 'Spending history',
      overview: 'Overview of your finances',
      fixedExpenses: 'Fixed expenses',
      variableExpenses: 'Variable expenses',
      noExpensesThisMonth: 'No expenses this month',
      toReceiveSoon: 'To receive soon',
      noPendingReimbursements: 'No pending reimbursements'
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
    
    // Previsionnel
    previsionnel: {
      title: 'Forecast',
      startingBalance: 'Starting balance',
      update: 'Update',
      updateBalance: 'Update balance',
      formula: 'Calculation: Starting balance - Fixed expenses - Variable expenses + Reimbursements',
      amountInvalid: 'Amount must be a valid number',
      amountOutOfBounds: 'Amount is out of bounds',
      finalBalance: 'Final forecast'
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
      subcategoryOther: 'Other',
      date: 'Date',
      day: 'Day',
      deducted: 'Deducted',
      received: 'Received',
      pending: 'Pending',
      noExpenses: 'No expenses for this month',
      total: 'Total',
      addExpenseTitle: 'Add expense',
      descriptionPlaceholder: 'Expense description',
      amountPlaceholder: 'Amount in EUR',
      customSubcategory: 'Custom name',
      customSubcategoryPlaceholder: 'Enter subcategory name',
      // Subcategories
      housing: 'Housing',
      car: 'Car',
      credit: 'Credit',
      health: 'Health',
      servers: 'Servers',
      subscriptions: 'Subscriptions',
      groceries: 'Groceries',
      restaurant: 'Restaurant',
      outings: 'Outings',
      gas: 'Gas',
      shopping: 'Shopping',
      other: 'Other',
      noCategory: 'No category',
      // Validation
      descriptionRequired: 'Description is required',
      descriptionTooLong: 'Description cannot exceed 200 characters',
      amountRequired: 'Amount is required',
      amountInvalid: 'Amount must be a valid number',
      amountTooSmall: 'Amount must be greater than 0',
      amountTooLarge: 'Amount is too large',
      subcategoryRequired: 'Subcategory name is required'
    },
    
    // Forecast
    forecast: {
      title: 'Forecast',
      months3: '3 months',
      months6: '6 months',
      months12: '12 months',
      projectedBalance: 'Projected balance',
      averageExpenses: 'Average expenses',
      explanation: 'Calculation explanation',
      loading: 'Loading forecast...',
      subtitle: 'Projection of your future finances based on your average expenses',
      settings: 'Forecast settings',
      averageVariableExpenses: 'Average variable expenses',
      numberOfMonths: 'Number of months',
      evolutionTitle: 'Forecast evolution',
      plannedRecurring: 'Planned recurring expenses',
      monthlyRecurringTotal: 'Monthly recurring total',
      inMonths: 'In {{months}} months',
      variablesEstimated: 'Variables (estimated)',
      estimatedPrevisionnel: 'Estimated forecast',
      howCalculated: 'How are forecasts calculated?',
      explanationFixed: 'Fixed expenses are based on your configured recurring expenses',
      explanationVariable: 'Variable expenses are estimated based on the 3-month average',
      explanationBalance: 'The starting balance of each month is the previous month\'s forecast',
      explanationReimbursements: 'Reimbursements are not included in future projections'
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
      description: 'These expenses will be automatically added each month',
      invalidDay: 'Invalid day (1-31)',
      cancelEdit: 'Cancel edit',
      descriptionPlaceholder: 'Description (e.g. Rent)',
      dayLabel: 'Day',
      pageTitle: 'Recurring Expenses',
      pageDescription: 'Manage your monthly fixed expenses. These expenses can be applied automatically each month.',
      templates: 'Expense templates',
      addRecurringExpense: 'Add a recurring expense',
      ofMonth: 'of month',
      howToTitle: 'How to use recurring expenses?',
      howTo1: 'Add your monthly fixed expenses (rent, subscriptions, etc.)',
      howTo2: 'Navigate to a specific month',
      howTo3: 'Click on "Recurring expenses" then "Apply to current month"',
      howTo4: 'Expenses will be added automatically (without duplicates)',
      deleteTitle: 'Delete recurring expense'
    },
    
    // Confirmations
    confirm: {
      deleteExpense: 'Are you sure you want to delete',
      deleteData: 'Are you sure you want to delete all your data? This will delete all your months, expenses and recurring expenses, but keep your account.',
      deleteAccount: 'Are you sure you want to permanently delete your account? This action is irreversible and will delete all your data.'
    }
  }
};