import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import ConfirmModal from '../common/ConfirmModal';

export default function ProfileView() {
  const { user, logout } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showDeleteData, setShowDeleteData] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

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
      setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' });
      return;
    }

    try {
      await api.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccessMessage('Mot de passe modifié avec succès');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrors({ general: err.message || 'Erreur lors du changement de mot de passe' });
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

  const handleImport = () => {
    alert('Fonctionnalité d\'import en cours de développement');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-obsidian-text mb-6">Profil</h1>

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
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">Informations du compte</h2>
          <div className="space-y-2 text-obsidian-text-muted">
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">Nom:</span> {user?.firstName} {user?.lastName}
            </p>
            <p>
              <span className="font-medium">Rôle:</span> {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </p>
            <p>
              <span className="font-medium">Membre depuis:</span> {new Date(user?.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Password Change */}
        <div className="card">
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">Sécurité</h2>
          
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="btn-secondary"
            >
              Changer le mot de passe
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
                  Changer le mot de passe
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
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">Gestion des données</h2>
          <div className="space-y-3">
            <button
              onClick={handleImport}
              className="btn-secondary"
            >
              Importer des données (bientôt disponible)
            </button>
            <div className="pt-3 border-t border-obsidian-border">
              <button
                onClick={() => setShowDeleteData(true)}
                className="text-orange-400 hover:text-orange-300 transition-colors"
              >
                Supprimer toutes mes données
              </button>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="card border-red-900/20">
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">Zone dangereuse</h2>
          <p className="text-obsidian-text-muted mb-4">
            Ces actions sont irréversibles. Veuillez procéder avec prudence.
          </p>
          <button
            onClick={() => setShowDeleteAccount(true)}
            className="bg-red-900/20 text-red-400 px-4 py-2 rounded hover:bg-red-900/30 transition-colors"
          >
            Supprimer mon compte
          </button>
        </div>

        {/* Creator Information */}
        <div className="card bg-obsidian-bg/50">
          <h2 className="text-xl font-semibold text-obsidian-text mb-4">À propos</h2>
          <div className="space-y-2 text-obsidian-text-muted">
            <p>
              FinanceMate est une application de gestion budgétaire personnelle développée pour simplifier 
              le suivi des dépenses mensuelles et la planification financière.
            </p>
            <p className="pt-2">
              <span className="font-medium">Version:</span> 1.0.0
            </p>
            <p>
              <span className="font-medium">Créé par:</span> Antony Mucci
            </p>
            <p>
              <span className="font-medium">Contact:</span>{' '}
              <a 
                href="mailto:support@financemate.mucci.dev" 
                className="text-obsidian-accent hover:underline"
              >
                support@financemate.mucci.dev
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showDeleteData}
        onConfirm={handleDeleteData}
        onCancel={() => setShowDeleteData(false)}
        title="Supprimer toutes les données"
        message="Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action supprimera tous vos mois, dépenses et dépenses récurrentes, mais conservera votre compte."
        confirmText="Supprimer les données"
        cancelText="Annuler"
        confirmStyle="danger"
      />

      <ConfirmModal
        isOpen={showDeleteAccount}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteAccount(false)}
        title="Supprimer le compte"
        message="Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible et supprimera toutes vos données."
        confirmText="Supprimer mon compte"
        cancelText="Annuler"
        confirmStyle="danger"
      />
    </div>
  );
}