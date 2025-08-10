import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function PrevisionnelCard({ previsionnel, startingBalance, onUpdateBalance }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [balance, setBalance] = useState(startingBalance);
  const [error, setError] = useState('');
  const [userSalary, setUserSalary] = useState(null);
  
  useEffect(() => {
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

  const handleSave = () => {
    const balanceNum = parseFloat(balance);
    
    if (isNaN(balanceNum)) {
      setError(t('previsionnel.amountInvalid', 'Le montant doit être un nombre valide'));
      return;
    }
    
    if (balanceNum < -999999 || balanceNum > 999999) {
      setError(t('previsionnel.amountOutOfBounds', 'Le montant est hors limites'));
      return;
    }
    
    onUpdateBalance(balanceNum);
    setEditing(false);
    setError('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  const BudgetHealthIndicator = ({ used, total, reimbursements }) => {
    const adjustedUsed = used - reimbursements;
    const percentage = total > 0 ? (adjustedUsed / total) * 100 : 0;
    
    const getHealthColor = () => {
      if (percentage <= 50) return 'bg-green-500';
      if (percentage <= 80) return 'bg-yellow-500';
      return 'bg-red-500';
    };
    
    const getHealthText = () => {
      if (percentage <= 50) return t('previsionnel.healthGood', 'Budget sain');
      if (percentage <= 80) return t('previsionnel.healthCaution', 'Attention au budget');
      return t('previsionnel.healthDanger', 'Budget dépassé');
    };
    
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-obsidian-text-muted">{t('previsionnel.budgetUsage', 'Utilisation du budget')}:</span>
          <span className={`font-medium ${
            percentage <= 50 ? 'text-green-400' : 
            percentage <= 80 ? 'text-yellow-400' : 
            'text-red-400'
          }`}>
            {getHealthText()}
          </span>
        </div>
        <div className="w-full bg-obsidian-bg rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getHealthColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="text-xs text-obsidian-text-muted text-center">
          {Math.round(percentage)}% {t('previsionnel.ofSalary', 'du salaire utilisé')}
        </div>
      </div>
    );
  };

  return (
    <div className="card lg:col-span-3">
      <h3 className="text-lg font-semibold text-obsidian-text mb-4">{t('previsionnel.title')}</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <div className="text-obsidian-text-muted text-sm mb-1">{t('previsionnel.startingBalance')}</div>
          {editing ? (
            <div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => {
                    setBalance(e.target.value);
                    setError('');
                  }}
                  className={`input-field text-sm px-2 py-1 ${error ? 'border-red-500' : ''}`}
                  step="0.01"
                  min="-999999"
                  max="999999"
                />
                <button onClick={handleSave} className="text-obsidian-success">
                  ✓
                </button>
                <button onClick={() => {
                  setEditing(false);
                  setError('');
                  setBalance(startingBalance);
                }} className="text-obsidian-error">
                  ✕
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-1">{error}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-obsidian-text">
                {formatCurrency(startingBalance)}
              </span>
              <button
                onClick={() => {
                  setBalance(startingBalance);
                  setEditing(true);
                }}
                className="text-obsidian-text-muted hover:text-obsidian-text"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="text-obsidian-text-muted text-sm mb-1">{t('expenses.fixed').replace(' Expenses', '').replace(' Dépenses', '')}</div>
          <div className="text-xl font-semibold text-red-400">
            -{formatCurrency(previsionnel?.fixed_total || 0)}
          </div>
        </div>

        <div>
          <div className="text-obsidian-text-muted text-sm mb-1">{t('expenses.variable').replace(' Expenses', '').replace(' Dépenses', '')}</div>
          <div className="text-xl font-semibold text-orange-400">
            -{formatCurrency(previsionnel?.variable_total || 0)}
          </div>
        </div>

        <div>
          <div className="text-obsidian-text-muted text-sm mb-1">{t('expenses.reimbursement')}</div>
          <div className="text-xl font-semibold text-green-400">
            +{formatCurrency(previsionnel?.reimbursements_received || 0)}
            {previsionnel?.reimbursements_pending > 0 && (
              <span className="text-sm text-obsidian-text-muted ml-2">
                (+{formatCurrency(previsionnel.reimbursements_pending)})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-obsidian-border">
        <div className="text-obsidian-text-muted text-sm mb-1">{t('previsionnel.finalBalance', 'Prévisionnel final')}</div>
        <div className={`text-3xl font-bold ${
          previsionnel?.previsionnel >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {formatCurrency(previsionnel?.previsionnel || 0)}
        </div>
        
        {userSalary && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-obsidian-text-muted">{t('previsionnel.afterFixed', 'Après charges fixes')}:</span>
              <span className={`font-semibold ${
                (startingBalance - (previsionnel?.fixed_total || 0)) >= userSalary * 0.5 ? 'text-green-400' : 
                (startingBalance - (previsionnel?.fixed_total || 0)) >= userSalary * 0.2 ? 'text-yellow-400' : 
                'text-red-400'
              }`}>
                {formatCurrency(startingBalance - (previsionnel?.fixed_total || 0))}
                <span className="text-obsidian-text-muted ml-1">
                  ({Math.round(((startingBalance - (previsionnel?.fixed_total || 0)) / userSalary) * 100)}%)
                </span>
              </span>
            </div>
            
            {previsionnel?.variable_total > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-obsidian-text-muted">{t('previsionnel.afterVariables', 'Après dépenses variables')}:</span>
                <span className={`font-semibold ${
                  (startingBalance - (previsionnel?.fixed_total || 0) - (previsionnel?.variable_total || 0)) >= userSalary * 0.3 ? 'text-green-400' : 
                  (startingBalance - (previsionnel?.fixed_total || 0) - (previsionnel?.variable_total || 0)) >= userSalary * 0.1 ? 'text-yellow-400' : 
                  'text-red-400'
                }`}>
                  {formatCurrency(startingBalance - (previsionnel?.fixed_total || 0) - (previsionnel?.variable_total || 0))}
                  <span className="text-obsidian-text-muted ml-1">
                    ({Math.round(((startingBalance - (previsionnel?.fixed_total || 0) - (previsionnel?.variable_total || 0)) / userSalary) * 100)}%)
                  </span>
                </span>
              </div>
            )}
            
            <div className="mt-3 pt-3 border-t border-obsidian-border/50">
              <BudgetHealthIndicator 
                used={(previsionnel?.fixed_total || 0) + (previsionnel?.variable_total || 0)}
                total={userSalary}
                reimbursements={previsionnel?.reimbursements_received || 0}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}