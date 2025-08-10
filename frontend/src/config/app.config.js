// Application Configuration
// Customize this file for your own deployment
// For production overrides, create app.config.local.js (not committed)

// Try to load local config dynamically (if exists)
// Note: For local overrides, create app.config.local.js
// and manually merge it in your deployment

export const APP_CONFIG = {
  // Application Branding
  app: {
    name: 'FinanceMate',
    version: '1.1.0',
    description: 'Privacy-focused budget manager with recurring expenses and forecasting'
  },

  // Creator/Organization Information
  // Update these with your own information if you fork this project
  creator: {
    name: 'Antony BARTOLOMUCCI',  // Leave empty to hide creator info
    linkedin: 'https://linkedin.com/in/bartolomucci',
    github: 'https://github.com/asyncmagician',
    website: 'https://mucci.dev',
    email: 'giammarino.antony@gmail.com' // For legal/contact purposes only
  },

  // Repository Information
  repository: {
    url: 'https://github.com/asyncmagician/FinanceMate',
    issues: 'https://github.com/asyncmagician/FinanceMate/issues'
  },

  // Legal Entity (for GDPR compliance)
  // This MUST be updated if you deploy your own instance
  legal: {
    dataController: 'Antony BARTOLOMUCCI', // Update with your name/organization
    dataControllerContact: 'giammarino.antony@gmail.com', // Update with your contact
    privacyOfficer: 'giammarino.antony@gmail.com' // Update with privacy contact
  },

  // Feature Flags
  features: {
    emailNotifications: true,
    weeklyReports: true,
    budgetAlerts: true,
    salaryEncryption: true,
    expenseSharing: true
  },

  // External Services
  services: {
    // Email provider (currently supports 'resend' or 'none')
    emailProvider: 'resend',
    // Add other service configurations here as needed
  },

  // UI Customization
  ui: {
    showCreatorInfo: true, // Set to true if you want to show your info
    showGitHubLink: true,   // Show GitHub link in footer
    defaultLanguage: 'fr',  // 'fr' or 'en'
    theme: 'dark'          // Currently only 'dark' is supported
  }
};

// Original Creator Information (for attribution)
// MIT License attribution - keep if forking
export const ORIGINAL_CREATOR = {
  name: 'FinanceMate Contributors',
  github: 'https://github.com/asyncmagician',
  repository: 'https://github.com/asyncmagician/FinanceMate'
};