import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

const UserList = ({ users, onEditUser, onDeleteUser }) => {
  const { t, language } = useLanguage();
  const { user: currentUser } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return t('admin.neverLoggedIn');
    
    const date = new Date(dateString);
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeClass = (role) => {
    return role === 'admin' 
      ? 'bg-purple-900/20 text-purple-400 border-purple-600' 
      : 'bg-obsidian-bg-secondary text-obsidian-text-muted border-obsidian-border';
  };

  if (users.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-4xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-obsidian-text mb-2">{t('admin.noUsers')}</h3>
        <p className="text-obsidian-text-muted">Aucun utilisateur trouvé dans le système.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-obsidian-bg-secondary border-b border-obsidian-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-obsidian-text-muted uppercase tracking-wider">
                {t('admin.userDetails')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-obsidian-text-muted uppercase tracking-wider">
                {t('admin.role')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-obsidian-text-muted uppercase tracking-wider">
                {t('admin.lastLogin')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-obsidian-text-muted uppercase tracking-wider">
                {t('admin.createdAt')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-obsidian-text-muted uppercase tracking-wider">
                {t('admin.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-obsidian-bg-secondary">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-text-secondary">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                    {user.role === 'admin' ? t('admin.adminRole') : t('admin.userRole')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {formatDate(user.lastLogin)}
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEditUser(user)}
                      className="text-obsidian-accent hover:text-obsidian-text p-2 rounded-lg hover:bg-obsidian-bg-secondary transition-colors"
                      title={t('admin.edit')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteUser(user)}
                      disabled={user.id === currentUser?.id}
                      className="text-obsidian-error hover:text-red-400 p-2 rounded-lg hover:bg-obsidian-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={user.id === currentUser?.id ? t('admin.cannotDeleteSelf') : t('admin.delete')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {users.map((user) => (
          <div key={user.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary mb-1">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-text-secondary mb-2">{user.email}</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                  {user.role === 'admin' ? t('admin.adminRole') : t('admin.userRole')}
                </span>
              </div>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={() => onEditUser(user)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title={t('admin.edit')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDeleteUser(user)}
                  disabled={user.id === currentUser?.id}
                  className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={user.id === currentUser?.id ? t('admin.cannotDeleteSelf') : t('admin.delete')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs text-text-secondary">
              <div>
                <span className="font-medium">{t('admin.lastLogin')}: </span>
                {formatDate(user.lastLogin)}
              </div>
              <div>
                <span className="font-medium">{t('admin.createdAt')}: </span>
                {formatDate(user.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;