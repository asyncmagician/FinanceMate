import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || 'user',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'user',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('admin.firstNameRequired');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('admin.lastNameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('admin.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('admin.emailInvalid');
    }
    
    if (!formData.role) {
      newErrors.role = t('admin.roleRequired');
    }

    // Password validation
    if (!user && !formData.password) {
      // New user - password required
      newErrors.password = t('admin.passwordRequired');
    } else if (formData.password) {
      // Password provided - validate it
      if (formData.password.length < 8) {
        newErrors.password = t('admin.passwordTooShort');
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = t('admin.passwordTooWeak');
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('admin.passwordMismatch');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        role: formData.role
      };
      
      // Only include password if it's provided
      if (formData.password) {
        submitData.password = formData.password;
      }
      
      await onSubmit(submitData);
    } catch (err) {
      // Error handling is done in the parent component
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-text-primary">
              {user ? t('admin.editUser') : t('admin.createUser')}
            </h2>
            <button
              onClick={onCancel}
              className="text-text-secondary hover:text-text-primary p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('admin.firstName')}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-500' : 'border-border'
                }`}
                placeholder={t('admin.firstName')}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('admin.lastName')}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : 'border-border'
                }`}
                placeholder={t('admin.lastName')}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('admin.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-border'
                }`}
                placeholder={t('admin.email')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('admin.role')}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.role ? 'border-red-500' : 'border-border'
                }`}
              >
                <option value="user">{t('admin.userRole')}</option>
                <option value="admin">{t('admin.adminRole')}</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('admin.password')}
                {user && <span className="text-xs text-text-secondary ml-1">({t('admin.leaveEmptyToKeepCurrent')})</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-border'
                }`}
                placeholder={user ? t('admin.leaveEmptyToKeepCurrent') : t('admin.password')}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            {formData.password && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  {t('admin.confirmPassword')}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder={t('admin.confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-border">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('admin.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                )}
                {t('admin.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;