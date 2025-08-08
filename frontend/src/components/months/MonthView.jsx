import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import ExpenseList from '../expenses/ExpenseList';
import ExpenseForm from '../expenses/ExpenseForm';
import PrevisionnelCard from './PrevisionnelCard';

export default function MonthView() {
  const { year, month } = useParams();
  const [monthData, setMonthData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [previsionnel, setPrevisionnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-obsidian-text-muted">Loading...</div>
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
          <h2 className="text-xl font-semibold text-obsidian-text">Expenses</h2>
          <button
            onClick={() => setShowAddExpense(true)}
            className="btn-primary"
          >
            Add Expense
          </button>
        </div>

        <ExpenseList
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
    </div>
  );
}