import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import ConfirmModal from '../common/ConfirmModal';
import ExpenseSharing from '../expenses/ExpenseSharing';
import HousingAffordability from '../expenses/HousingAffordability';

export default function RecurringView() {
  const { t } = useLanguage();
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [shareData, setShareData] = useState({});
  const [userSalary, setUserSalary] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: 1,
    subcategory: '',
    day_of_month: 1,
    share_type: 'none',
    share_value: null,
    share_with: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const fixedSubcategories = [
    t('expenses.housing'),
    t('expenses.car'),
    t('expenses.credit'),
    t('expenses.health'),
    t('expenses.servers'),
    t('expenses.subscriptions'),
    t('expenses.other')
  ];

  useEffect(() => {
    loadRecurringExpenses();
    loadUserSalary();
  }, []);
  
  const loadUserSalary = async () => {
    try {
      const response = await api.getSalary();
      setUserSalary(response.salary);
    } catch (err) {
      console.log('No salary configured');
    }
  };

  const loadRecurringExpenses = async () => {
    try {
      const data = await api.getRecurringExpenses();
      setRecurringExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load recurring expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = t('expenses.descriptionRequired');
    }
    
    const amountNum = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = t('expenses.amountInvalid');
    }
    
    if (formData.day_of_month < 1 || formData.day_of_month > 31) {
      newErrors.day_of_month = t('recurring.invalidDay');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Always store the full amount in the database
      const fullAmount = parseFloat(formData.amount);
      
      if (editingExpense) {
        await api.updateRecurringExpense(editingExpense.id, {
          ...formData,
          amount: fullAmount,
          share_type: shareData.share_type || 'none',
          share_value: shareData.share_value,
          share_with: shareData.share_with
        });
      } else {
        await api.createRecurringExpense({
          ...formData,
          amount: fullAmount,
          share_type: shareData.share_type || 'none',
          share_value: shareData.share_value,
          share_with: shareData.share_with,
          start_date: new Date().toISOString().split('T')[0]
        });
      }
      
      setFormData({
        description: '',
        amount: '',
        category_id: 1,
        subcategory: '',
        day_of_month: 1,
        share_type: 'none',
        share_value: null,
        share_with: null
      });
      setShareData({});
      setShowAddForm(false);
      setEditingExpense(null);
      setErrors({});
      await loadRecurringExpenses();
    } catch (err) {
      console.error('Failed to save recurring expense:', err);
    }
  };

  const handleEdit = (expense) => {
    // The amount stored is already the full amount
    const fullAmount = expense.amount;
    
    setFormData({
      description: expense.description,
      amount: fullAmount.toString(),
      category_id: expense.category_id || 1,
      subcategory: expense.subcategory || '',
      day_of_month: expense.day_of_month || 1,
      share_type: expense.share_type || 'none',
      share_value: expense.share_value || null,
      share_with: expense.share_with || null
    });
    setShareData({
      share_type: expense.share_type || 'none',
      share_value: expense.share_value || null,
      share_with: expense.share_with || null,
      user_amount: null // Will be recalculated by ExpenseSharing
    });
    setEditingExpense(expense);
    setShowAddForm(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteRecurringExpense(id);
      await loadRecurringExpenses();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete recurring expense:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  // Calculate total housing expenses from recurring
  const housingExpenses = recurringExpenses
    .filter(expense => {
      // Check both translated and hardcoded values for compatibility
      const isHousing = expense.subcategory === t('expenses.housing') || 
                       expense.subcategory === 'Logement' ||
                       expense.subcategory === 'Housing';
      return isHousing;
    })
    .reduce((sum, expense) => {
      // Calculate user's portion if shared
      let amount = parseFloat(expense.amount || 0);
      if (expense.share_type && expense.share_type !== 'none') {
        if (expense.share_type === 'equal') {
          amount = amount / 2;
        } else if (expense.share_type === 'percentage' && expense.share_value) {
          amount = amount * (parseFloat(expense.share_value) / 100);
        } else if (expense.share_type === 'amount' && expense.share_value) {
          amount = parseFloat(expense.share_value);
        }
      }
      return sum + amount;
    }, 0);
    
  // Calculate both full total and user's portion
  const expenseTotals = recurringExpenses.reduce((totals, expense) => {
    const fullAmount = parseFloat(expense.amount || 0);
    let userAmount = fullAmount;
    
    if (expense.share_type && expense.share_type !== 'none') {
      if (expense.share_type === 'equal') {
        userAmount = fullAmount / 2;
      } else if (expense.share_type === 'percentage' && expense.share_value) {
        userAmount = fullAmount * (parseFloat(expense.share_value) / 100);
      } else if (expense.share_type === 'amount' && expense.share_value) {
        userAmount = parseFloat(expense.share_value);
      }
    }
    
    return {
      full: totals.full + fullAmount,
      user: totals.user + userAmount,
      shared: totals.shared + (fullAmount - userAmount)
    };
  }, { full: 0, user: 0, shared: 0 });
  
  const totalFixedExpenses = expenseTotals.user; // For backward compatibility

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-obsidian-text-muted">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-obsidian-text">{t('recurring.pageTitle', 'Dépenses Récurrentes')}</h1>
        <p className="text-obsidian-text-muted mt-2">
          {t('recurring.pageDescription', 'Gérez vos dépenses fixes mensuelles. Ces dépenses peuvent être appliquées automatiquement à chaque mois.')}
        </p>
      </div>
      
      {/* Salary configuration prompt */}
      {!userSalary && totalFixedExpenses > 0 && (
        <div className="mb-6 card bg-obsidian-accent/10 border-obsidian-accent/30">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-obsidian-accent mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-obsidian-text mb-2">
                {t('profile.configureSalary', 'Configurez votre salaire pour une analyse complète')}
              </h3>
              <p className="text-sm text-obsidian-text-muted mb-3">
                {t('profile.configureMessage', 'Ajoutez votre salaire mensuel pour calculer votre taux d\'endettement et obtenir des recommandations personnalisées.')}
              </p>
              <button
                onClick={() => window.location.href = '/profile'}
                className="btn-primary text-sm"
              >
                {t('profile.configure', 'Configurer mon salaire')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {userSalary && totalFixedExpenses > 0 && (
        <div className="mb-6">
          <HousingAffordability 
            housingExpenses={housingExpenses}
            totalFixedExpenses={totalFixedExpenses}
            userSalary={userSalary}
            isVisible={true}
          />
        </div>
      )}

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-obsidian-text">{t('recurring.templates', 'Templates de dépenses')}</h2>
            {expenseTotals.full > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-sm text-obsidian-text-muted">
                    {t('expenses.total')} {t('expenses.fixed')}: 
                    <span className="font-bold text-yellow-400 ml-2">{formatCurrency(expenseTotals.full)}</span>
                  </span>
                  {expenseTotals.shared > 0 && (
                    <span className="text-xs text-obsidian-text-faint">
                      {t('expenses.yourPart', 'Votre part')}: {formatCurrency(expenseTotals.user)}
                      {userSalary && (
                        <span className="ml-1">
                          ({((expenseTotals.user / userSalary) * 100).toFixed(1)}% {t('profile.ofSalary', 'du salaire')})
                        </span>
                      )}
                    </span>
                  )}
                </div>
                {expenseTotals.shared > 0 && (
                  <div className="text-xs text-obsidian-accent/70 pl-0 sm:pl-4">
                    💡 {t('expenses.toBeReimbursed', 'À se faire rembourser')}: {formatCurrency(expenseTotals.shared)}
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) {
                setEditingExpense(null);
                setFormData({
                  description: '',
                  amount: '',
                  category_id: 1,
                  subcategory: '',
                  day_of_month: 1,
                  share_type: 'none',
                  share_value: null,
                  share_with: null
                });
                setShareData({});
                setErrors({});
              }
            }}
            className="btn-primary p-2 sm:px-4"
            title={editingExpense ? t('recurring.cancelEdit', 'Annuler l\'édition') : (showAddForm ? t('cancel') : t('recurring.addRecurringExpense', 'Ajouter une dépense récurrente'))}
          >
            <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={showAddForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
            </svg>
            <span className="hidden sm:inline">
              {editingExpense ? t('recurring.cancelEdit', 'Annuler l\'édition') : (showAddForm ? t('cancel') : t('recurring.addRecurringExpense', 'Ajouter une dépense récurrente'))}
            </span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="bg-obsidian-bg p-4 rounded-lg mb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  {t('expenses.description')}
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  className={`input-field w-full ${errors.description ? 'border-red-500' : ''}`}
                  placeholder={t('recurring.descriptionPlaceholder')}
                  maxLength="200"
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  {t('expenses.amount')} (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => {
                    setFormData({ ...formData, amount: e.target.value });
                    if (errors.amount) setErrors({ ...errors, amount: '' });
                  }}
                  className={`input-field w-full ${errors.amount ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  {t('expenses.subcategory')}
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">-- {t('common.choose', 'Choisir')} --</option>
                  {fixedSubcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  {t('recurring.dayOfMonth')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.day_of_month}
                  onChange={(e) => {
                    setFormData({ ...formData, day_of_month: parseInt(e.target.value) || 1 });
                    if (errors.day_of_month) setErrors({ ...errors, day_of_month: '' });
                  }}
                  className={`input-field w-full ${errors.day_of_month ? 'border-red-500' : ''}`}
                />
                {errors.day_of_month && (
                  <p className="text-red-400 text-xs mt-1">{errors.day_of_month}</p>
                )}
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <ExpenseSharing
                shareData={shareData}
                onShareChange={setShareData}
                totalAmount={parseFloat(formData.amount) || 0}
              />
            </div>

            <div className="flex gap-3 col-span-1 md:col-span-2">
              <button type="submit" className="btn-primary">
                {editingExpense ? t('edit') : t('create')}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingExpense(null);
                  setFormData({
                    description: '',
                    amount: '',
                    category_id: 1,
                    subcategory: '',
                    day_of_month: 1,
                    share_type: 'none',
                    share_value: null,
                    share_with: null
                  });
                  setShareData({});
                  setErrors({});
                }}
                className="btn-secondary"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {recurringExpenses.length === 0 ? (
            <p className="text-center py-8 text-obsidian-text-muted">
              {t('recurring.noRecurring')}
            </p>
          ) : (
            recurringExpenses.map(expense => {
              // Calculate user's portion if shared
              let displayAmount = expense.amount;
              let isShared = expense.share_type && expense.share_type !== 'none';
              
              if (isShared) {
                if (expense.share_type === 'equal') {
                  displayAmount = expense.amount / 2;
                } else if (expense.share_type === 'percentage' && expense.share_value) {
                  displayAmount = expense.amount * (parseFloat(expense.share_value) / 100);
                } else if (expense.share_type === 'amount' && expense.share_value) {
                  displayAmount = parseFloat(expense.share_value);
                }
              }
              
              return (
                <div 
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-obsidian-bg rounded-lg border border-obsidian-border hover:border-obsidian-text-faint transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-obsidian-text">
                      {expense.description}
                      {isShared && (
                        <span className="ml-2 text-xs bg-obsidian-accent/20 text-obsidian-accent px-2 py-0.5 rounded">
                          {t('expenses.shared', 'Partagé')}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-obsidian-text-muted">
                      {expense.subcategory && `${expense.subcategory} • `}
                      {t('recurring.dayLabel')} {expense.day_of_month} {t('recurring.ofMonth', 'du mois')}
                      {isShared && expense.share_with && ` • ${t('expenses.sharedWith', 'Partagé avec')} ${expense.share_with}`}
                    </div>
                    {isShared && (
                      <div className="text-xs text-obsidian-text-faint mt-1">
                        {t('expenses.fullAmount', 'Montant total')}: {formatCurrency(expense.amount)} 
                        {expense.share_type === 'equal' && ' (50/50)'}
                        {expense.share_type === 'percentage' && ` (${expense.share_value}%)`}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-lg font-bold text-yellow-400">
                        {formatCurrency(displayAmount)}
                      </span>
                      {isShared && (
                        <div className="text-xs text-obsidian-text-muted">
                          {t('expenses.yourPart', 'Votre part')}
                        </div>
                      )}
                    </div>
                  
                  <button
                    onClick={() => handleEdit(expense)}
                    className="text-obsidian-text-muted hover:text-obsidian-accent transition-colors p-2"
                    title={t('edit')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => setDeleteConfirm(expense)}
                    className="text-obsidian-text-muted hover:text-obsidian-error transition-colors p-2"
                    title={t('delete')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
            })
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-obsidian-text mb-3">
          {t('recurring.howToTitle', 'Comment utiliser les dépenses récurrentes ?')}
        </h3>
        <ol className="space-y-2 text-obsidian-text-muted">
          <li>1. {t('recurring.howTo1', 'Créez vos templates de dépenses fixes (loyer, abonnements, etc.)')}</li>
          <li>2. {t('recurring.howTo2', 'Partagez vos dépenses si nécessaire (50/50, pourcentage, montant fixe)')}</li>
          <li>3. {t('recurring.howTo3', 'Naviguez vers un mois spécifique et cliquez sur "Dépenses récurrentes"')}</li>
          <li>4. {t('recurring.howTo4', 'Sélectionnez les templates à appliquer (évite les doublons automatiquement)')}</li>
          <li>5. {t('recurring.howTo5', 'Les dépenses partagées créeront automatiquement des remboursements')}</li>
        </ol>
      </div>

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onConfirm={() => {
          if (deleteConfirm) {
            handleDelete(deleteConfirm.id);
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
        title={t('recurring.deleteTitle', 'Supprimer la dépense récurrente')}
        message={deleteConfirm ? `${t('confirm.deleteExpense')} "${deleteConfirm.description}" ?` : ''}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        confirmStyle="danger"
      />
    </div>
  );
}