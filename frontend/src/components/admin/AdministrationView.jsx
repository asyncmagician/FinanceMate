import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import UserList from './UserList';
import UserForm from './UserForm';
import ConfirmModal from '../common/ConfirmModal';

const AdministrationView = () => {
  const { t } = useLanguage();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await api.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowConfirmDelete(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await api.deleteUser(userToDelete.id);
      setSuccess(t('admin.userDeleted'));
      setShowConfirmDelete(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message || 'Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (editingUser) {
        // Update user
        await api.updateUser(editingUser.id, userData);
        setSuccess(t('admin.userUpdated'));
      } else {
        // Create user
        await api.createUser(userData);
        setSuccess(t('admin.userCreated'));
      }
      setShowUserForm(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.message || 'Erreur lors de la sauvegarde de l\'utilisateur');
    }
  };

  const handleFormCancel = () => {
    setShowUserForm(false);
    setEditingUser(null);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-text-secondary">{t('admin.loadingUsers')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          {t('admin.title')}
        </h1>
        <button
          onClick={handleCreateUser}
          className="btn-primary px-3 py-1.5 text-sm"
          title={t('admin.createUser')}
        >
          <svg className="w-4 h-4 sm:mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">{t('admin.createUser')}</span>
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-400">{success}</span>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* User List */}
      <UserList
        users={users}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && userToDelete && (
        <ConfirmModal
          isOpen={showConfirmDelete}
          onConfirm={confirmDeleteUser}
          onCancel={() => {
            setShowConfirmDelete(false);
            setUserToDelete(null);
          }}
          title={t('admin.deleteUser')}
          message={`${t('admin.confirmDeleteUser')} "${userToDelete.firstName} ${userToDelete.lastName}" (${userToDelete.email})`}
        />
      )}
    </div>
  );
};

export default AdministrationView;