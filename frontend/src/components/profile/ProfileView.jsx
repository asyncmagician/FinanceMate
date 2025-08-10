import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import ConfirmModal from '../common/ConfirmModal';

export default function ProfileView() {
  const { user, logout } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showDeleteData, setShowDeleteData] = useState(false);
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [salary, setSalary] = useState(null);
  const [salaryInput, setSalaryInput] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadSalary();
  }, []);

  const loadSalary = async () => {
    try {
      const response = await api.getSalary();
      setSalary(response.salary);
      setSalaryInput(response.salary ? String(response.salary) : '');
    } catch (err) {
      console.error('Error loading salary:', err);
    }
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    try {
      const salaryValue = salaryInput.trim() === '' ? null : parseFloat(salaryInput);
      
      if (salaryInput.trim() !== '' && (isNaN(salaryValue) || salaryValue < 0)) {
        setErrors({ salary: t('profile.salaryInvalid') });
        return;
      }

      await api.updateSalary(salaryValue);
      setSalary(salaryValue);
      setShowSalaryForm(false);
      setSuccessMessage(salaryValue ? t('profile.salaryUpdated') : t('profile.salaryRemoved'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ salary: err.message || t('profile.salaryError') });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Validation
    if (!passwordData.currentPassword) {
      setErrors({ currentPassword: 'Mot de passe actuel requis' });
      return;
    }
    if (!passwordData.newPassword) {
      setErrors({ newPassword: 'Nouveau mot de passe requis' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setErrors({ newPassword: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Les nouveaux mots de passe ne correspondent pas' });
      return;
    }

    try {
      await api.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccessMessage('Mot de passe modifié avec succès');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      if (err.message.includes('actuel')) {
        setErrors({ currentPassword: err.message });
      } else {
        setErrors({ general: err.message || 'Erreur lors du changement de mot de passe' });
      }
    }
  };

  const handleDeleteData = async () => {
    try {
      await api.deleteUserData();
      setSuccessMessage('Toutes vos données ont été supprimées');
      setShowDeleteData(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ general: 'Erreur lors de la suppression des données' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.deleteAccount();
      logout();
    } catch (err) {
      setErrors({ general: 'Erreur lors de la suppression du compte' });
      setShowDeleteAccount(false);
    }
  };

  const handleImport = (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-obsidian-text mb-6">{t('profile.title')}</h1>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-500 rounded-lg text-green-400">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
          {errors.general}
        </div>
      )}

      <div className="grid gap-6">
        {/* User Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">{t('profile.accountInfo')}</h2>
          <div className="space-y-2 text-obsidian-text-muted">
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">{t('profile.name')}:</span> {user?.firstName} {user?.lastName}
            </p>
            <p>
              <span className="font-medium">{t('profile.role')}:</span> {user?.role === 'admin' ? t('profile.admin') : t('profile.user')}
            </p>
            <p>
              <span className="font-medium">{t('profile.memberSince')}:</span> {new Date(user?.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
            </p>
          </div>
        </div>

        {/* Salary Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">{t('profile.salaryInfo')}</h2>
          
          {!showSalaryForm ? (
            <div className="space-y-4">
              <div className="text-obsidian-text-muted">
                <p>
                  <span className="font-medium">{t('profile.currentSalary')}:</span>{' '}
                  {salary ? (
                    <span className="text-obsidian-text">
                      {salary.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} {t('profile.euroSymbol')} {t('profile.perMonth')}
                    </span>
                  ) : (
                    <span className="text-obsidian-text-muted">{t('profile.noSalarySet')}</span>
                  )}
                </p>
                <p className="text-sm mt-2 text-obsidian-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {t('profile.salaryPrivacy')}
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSalaryForm(true);
                  setSalaryInput(salary ? String(salary) : '');
                  setErrors({});
                }}
                className="btn-secondary"
              >
                {salary ? t('profile.updateSalary') : t('profile.setSalary')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSalarySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  {t('profile.salaryAmount')}
                </label>
                <input
                  type="number"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  placeholder={t('profile.salaryPlaceholder')}
                  className="input-field w-full max-w-md"
                  min="0"
                  step="0.01"
                />
                <p className="text-sm text-obsidian-text-muted mt-1">
                  {t('profile.salaryOptional')}
                </p>
                {errors.salary && (
                  <p className="text-red-400 text-sm mt-1">{errors.salary}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSalaryForm(false);
                    setSalaryInput(salary ? String(salary) : '');
                    setErrors({});
                  }}
                  className="btn-secondary"
                >
                  {t('cancel')}
                </button>
                {salary && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await api.updateSalary(null);
                        setSalary(null);
                        setSalaryInput('');
                        setShowSalaryForm(false);
                        setSuccessMessage(t('profile.salaryRemoved'));
                        setTimeout(() => setSuccessMessage(''), 3000);
                      } catch (err) {
                        setErrors({ salary: err.message || t('profile.salaryError') });
                      }
                    }}
                    className="text-orange-400 hover:text-orange-300 transition-colors px-3"
                  >
                    {t('profile.removeSalary')}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Language Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">{t('profile.language')}</h2>
          <div className="flex items-center gap-3">
            <label className="text-obsidian-text-muted">
              {t('profile.selectLanguage')}:
            </label>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="input-field"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Password Change */}
        <div className="card">
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">{t('profile.security')}</h2>
          
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="btn-secondary"
            >
              {t('profile.changePassword')}
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="input-field w-full max-w-md"
                  required
                />
                {errors.currentPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="input-field w-full max-w-md"
                  required
                />
                {errors.newPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input-field w-full max-w-md"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {t('profile.changePassword')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setErrors({});
                  }}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Data Management */}
        <div className="card">
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">{t('profile.dataManagement')}</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  try {
                    const response = await api.exportUserData('json');
                    const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `financemate-export-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    setSuccessMessage(t('profile.exportSuccess', 'Données exportées avec succès'));
                    setTimeout(() => setSuccessMessage(''), 3000);
                  } catch (err) {
                    setErrors({ general: t('profile.exportError', 'Erreur lors de l\'export des données') });
                  }
                }}
                className="btn-secondary"
                title={t('profile.exportJsonTooltip', 'Exporter toutes vos données au format JSON')}
              >
                {t('profile.exportJson', 'Exporter (JSON)')}
              </button>
              <button
                onClick={async () => {
                  try {
                    const csvData = await api.exportUserDataCSV();
                    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `financemate-expenses-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    setSuccessMessage(t('profile.exportSuccess', 'Données exportées avec succès'));
                    setTimeout(() => setSuccessMessage(''), 3000);
                  } catch (err) {
                    setErrors({ general: t('profile.exportError', 'Erreur lors de l\'export des données') });
                  }
                }}
                className="btn-secondary"
                title={t('profile.exportCsvTooltip', 'Exporter vos dépenses au format CSV')}
              >
                {t('profile.exportCsv', 'Exporter (CSV)')}
              </button>
            </div>
            <button
              onClick={handleImport}
              disabled={true}
              className="btn-secondary opacity-50 cursor-not-allowed"
              title="Fonctionnalité bientôt disponible"
            >
              {t('profile.importData', 'Importer des données (bientôt disponible)')}
            </button>
            <div className="pt-3 border-t border-obsidian-border">
              <button
                onClick={() => setShowDeleteData(true)}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                {t('profile.deleteAllData')}
              </button>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="card border-red-900/20">
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">{t('profile.dangerZone')}</h2>
          <p className="text-obsidian-text-muted mb-4">
            {t('profile.dangerWarning')}
          </p>
          <button
            onClick={() => setShowDeleteAccount(true)}
            className="bg-red-900/20 text-red-400 px-4 py-2 rounded hover:bg-red-900/30 transition-colors"
          >
            {t('profile.deleteAccount')}
          </button>
        </div>

        {/* Creator Information */}
        <div className="card bg-obsidian-bg/50">
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">{t('profile.about')}</h2>
          <div className="space-y-3 text-obsidian-text-muted">
            <p>
              {t('profile.aboutText')}
            </p>
            <div className="pt-2 space-y-2">
              <p>
                <span className="font-medium">{t('profile.version')}:</span> 1.0.0
              </p>
              <p>
                <span className="font-medium">{t('profile.createdBy')}:</span> Antony BARTOLOMUCCI
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="https://linkedin.com/in/bartolomucci" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-obsidian-accent hover:underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/asyncmagician" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-obsidian-accent hover:underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a 
                  href="https://mucci.dev" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-obsidian-accent hover:underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Portfolio
                </a>
              </div>
              <p className="pt-2">
                <span className="font-medium">Code source:</span>{' '}
                <a 
                  href="https://github.com/asyncmagician/FinanceMate" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-obsidian-accent hover:underline"
                >
                  github.com/asyncmagician/FinanceMate
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showDeleteData}
        onConfirm={handleDeleteData}
        onCancel={() => setShowDeleteData(false)}
        title={t('profile.deleteAllDataTitle', 'Supprimer toutes les données')}
        message={t('confirm.deleteData')}
        confirmText={t('profile.deleteDataButton', 'Supprimer les données')}
        cancelText={t('cancel')}
        confirmStyle="danger"
      />

      <ConfirmModal
        isOpen={showDeleteAccount}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteAccount(false)}
        title={t('profile.deleteAccountTitle', 'Supprimer le compte')}
        message={t('confirm.deleteAccount')}
        confirmText={t('profile.deleteAccountButton', 'Supprimer mon compte')}
        cancelText={t('cancel')}
        confirmStyle="danger"
      />
    </div>
  );
}