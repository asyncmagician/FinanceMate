import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import ExpenseListGrouped from '../expenses/ExpenseListGrouped';
import ExpenseForm from '../expenses/ExpenseForm';
import ReimbursementForm from '../expenses/ReimbursementForm';
import PrevisionnelCard from './PrevisionnelCard';
import RecurringExpenseManager from '../recurring/RecurringExpenseManager';

export default function MonthView() {
  const { year, month } = useParams();
  const { t } = useLanguage();
  const [monthData, setMonthData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [previsionnel, setPrevisionnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddReimbursement, setShowAddReimbursement] = useState(false);
  const [showRecurringManager, setShowRecurringManager] = useState(false);

  const monthNames = [
    t('months.january'), t('months.february'), t('months.march'),
    t('months.april'), t('months.may'), t('months.june'),
    t('months.july'), t('months.august'), t('months.september'),
    t('months.october'), t('months.november'), t('months.december')
  ];

  useEffect(() => {
    loadMonthData();
  }, [year, month]);

  const loadMonthData = async () => {
    setLoading(true);
    try {
      const [monthRes, expensesRes, previsionnelRes] = await Promise.all([
        api.getMonth(year, month).catch(() => null),
        api.getMonthExpenses(year, month),
        api.getPrevisionnel(year, month)
      ]);

      setMonthData(monthRes?.month || { starting_balance: 0 });
      setExpenses(expensesRes.expenses || []);
      setPrevisionnel(previsionnelRes);
    } catch (err) {
      console.error('Failed to load month data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    try {
      await api.createExpense({
        ...expense,
        date: `${year}-${String(month).padStart(2, '0')}-${String(expense.day).padStart(2, '0')}`
      });
      await loadMonthData();
      setShowAddExpense(false);
    } catch (err) {
      console.error('Failed to add expense:', err);
    }
  };

  const handleAddReimbursement = async (reimbursement) => {
    try {
      await api.createExpense({
        ...reimbursement,
        date: `${year}-${String(month).padStart(2, '0')}-${String(reimbursement.day).padStart(2, '0')}`
      });
      await loadMonthData();
      setShowAddReimbursement(false);
    } catch (err) {
      console.error('Failed to add reimbursement:', err);
    }
  };

  const handleUpdateExpense = async (id, updates) => {
    try {
      // Optimistically update the UI
      setExpenses(prevExpenses => 
        prevExpenses.map(expense => 
          expense.id === id ? { ...expense, ...updates } : expense
        )
      );
      
      // Then update the backend
      await api.updateExpense(id, updates);
      
      // Reload if it's a significant update (amount changes affect totals, is_received affects prévisionnel)
      if (updates.amount !== undefined || updates.description !== undefined || updates.category_id !== undefined || updates.is_received !== undefined) {
        await loadMonthData();
      }
    } catch (err) {
      console.error('Failed to update expense:', err);
      // Reload on error to restore correct state
      await loadMonthData();
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.deleteExpense(id);
      await loadMonthData();
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  const handleUpdateBalance = async (newBalance) => {
    try {
      await api.updateMonth(year, month, newBalance);
      await loadMonthData();
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  };

  const handleApplyRecurring = async (recurringExpenses) => {
    try {
      if (!recurringExpenses || recurringExpenses.length === 0) {
        return;
      }
      
      // Get fresh expenses data before processing
      const expensesRes = await api.getMonthExpenses(year, month);
      let currentExpenses = expensesRes.expenses || [];
      
      // Process expenses sequentially to avoid race conditions
      for (let i = 0; i < recurringExpenses.length; i++) {
        const recurring = recurringExpenses[i];
        
        const dayOfMonth = recurring.day_of_month || 1;
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        const paddedMonth = String(monthNum).padStart(2, '0');
        const paddedDay = String(dayOfMonth).padStart(2, '0');
        const dateString = `${yearNum}-${paddedMonth}-${paddedDay}`;
        
        // Check if expense already exists for this month
        const existingExpense = currentExpenses.find(e => {
          const expenseDate = e.date ? e.date.split('T')[0] : '';
          return e.description === recurring.description && expenseDate === dateString;
        });
        
        if (!existingExpense) {
          const expenseData = {
            description: recurring.description,
            amount: parseFloat(recurring.amount),
            category_id: recurring.category_id || 1,
            subcategory: recurring.subcategory || null,
            date: dateString,
            is_deducted: false
          };
          
          const newExpense = await api.createExpense(expenseData);
          // Add the new expense to our local tracking array
          currentExpenses.push({
            ...newExpense,
            description: recurring.description,
            date: dateString
          });
        }
      }
      
      await loadMonthData();
      setShowRecurringManager(false);
    } catch (err) {
      console.error('Failed to apply recurring expenses:', err);
      alert('Erreur lors de l\'application des dépenses récurrentes: ' + err.message);
    }
  };

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
        <h1 className="text-3xl font-bold text-obsidian-text">
          {monthNames[month - 1]} {year}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <PrevisionnelCard 
          previsionnel={previsionnel}
          startingBalance={monthData?.starting_balance || 0}
          onUpdateBalance={handleUpdateBalance}
        />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-obsidian-text">{t('expenses.title')}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRecurringManager(true)}
              className="btn-secondary p-2 sm:px-4"
              title={t('expenses.recurring')}
            >
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">{t('expenses.recurring')}</span>
            </button>
            <button
              onClick={() => setShowAddReimbursement(true)}
              className="btn-secondary p-2 sm:px-4"
              title={t('reimbursement.add', 'Ajouter un remboursement')}
            >
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
              <span className="hidden sm:inline">{t('reimbursement.add', 'Remboursement')}</span>
            </button>
            <button
              onClick={() => setShowAddExpense(true)}
              className="btn-primary p-2 sm:px-4"
              title={t('expenses.add')}
            >
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">{t('expenses.add')}</span>
            </button>
          </div>
        </div>

        <ExpenseListGrouped
          expenses={expenses}
          onUpdate={handleUpdateExpense}
          onEdit={handleUpdateExpense}
          onDelete={handleDeleteExpense}
        />
      </div>

      {showAddExpense && (
        <ExpenseForm
          onSubmit={handleAddExpense}
          onClose={() => setShowAddExpense(false)}
        />
      )}

      {showAddReimbursement && (
        <ReimbursementForm
          onSubmit={handleAddReimbursement}
          onClose={() => setShowAddReimbursement(false)}
        />
      )}

      {showRecurringManager && (
        <RecurringExpenseManager
          onClose={() => setShowRecurringManager(false)}
          onApply={handleApplyRecurring}
        />
      )}
    </div>
  );
}