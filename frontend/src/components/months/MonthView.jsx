import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import ExpenseListGrouped from '../expenses/ExpenseListGrouped';
import ExpenseForm from '../expenses/ExpenseForm';
import PrevisionnelCard from './PrevisionnelCard';
import RecurringExpenseManager from '../recurring/RecurringExpenseManager';

export default function MonthView() {
  const { year, month } = useParams();
  const [monthData, setMonthData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [previsionnel, setPrevisionnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showRecurringManager, setShowRecurringManager] = useState(false);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
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

  const handleUpdateExpense = async (id, updates) => {
    try {
      await api.updateExpense(id, updates);
      await loadMonthData();
    } catch (err) {
      console.error('Failed to update expense:', err);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (confirm('Delete this expense?')) {
      try {
        await api.deleteExpense(id);
        await loadMonthData();
      } catch (err) {
        console.error('Failed to delete expense:', err);
      }
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
      for (const recurring of recurringExpenses) {
        const expenseDate = new Date(year, month - 1, recurring.day_of_month);
        
        const existingExpense = expenses.find(e => 
          e.description === recurring.description && 
          new Date(e.date).getDate() === recurring.day_of_month
        );
        
        if (!existingExpense) {
          await api.createExpense({
            description: recurring.description,
            amount: recurring.amount,
            category_id: recurring.category_id,
            date: expenseDate.toISOString().split('T')[0],
            is_deducted: false
          });
        }
      }
      await loadMonthData();
    } catch (err) {
      console.error('Failed to apply recurring expenses:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-obsidian-text-muted">Chargement...</div>
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
          <h2 className="text-xl font-semibold text-obsidian-text">Dépenses</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRecurringManager(true)}
              className="btn-secondary"
            >
              Dépenses récurrentes
            </button>
            <button
              onClick={() => setShowAddExpense(true)}
              className="btn-primary"
            >
              Ajouter une dépense
            </button>
          </div>
        </div>

        <ExpenseListGrouped
          expenses={expenses}
          onUpdate={handleUpdateExpense}
          onDelete={handleDeleteExpense}
        />
      </div>

      {showAddExpense && (
        <ExpenseForm
          onSubmit={handleAddExpense}
          onClose={() => setShowAddExpense(false)}
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