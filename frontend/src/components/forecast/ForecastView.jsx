import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ForecastView() {
  const [forecast, setForecast] = useState([]);
  const [averageVariable, setAverageVariable] = useState(0);
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthsToForecast, setMonthsToForecast] = useState(6);

  useEffect(() => {
    loadForecastData();
  }, [monthsToForecast]);

  const loadForecastData = async () => {
    setLoading(true);
    try {
      const [forecastRes, recurringRes] = await Promise.all([
        api.getForecast(monthsToForecast),
        api.getRecurringExpenses()
      ]);

      setForecast(forecastRes.forecast || []);
      setRecurringExpenses(recurringRes.recurringExpenses || []);

      const pastMonths = [];
      const currentDate = new Date();
      for (let i = 1; i <= 3; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        try {
          const monthData = await api.getPrevisionnel(date.getFullYear(), date.getMonth() + 1);
          pastMonths.push(monthData.variable_total);
        } catch (err) {
          console.error('Error loading past month:', err);
        }
      }
      
      if (pastMonths.length > 0) {
        const avg = pastMonths.reduce((sum, val) => sum + val, 0) / pastMonths.length;
        setAverageVariable(avg);
      }
    } catch (err) {
      console.error('Failed to load forecast data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const calculateProjectedPrevisionnel = (monthData) => {
    const startingBalance = monthData.starting_balance || 0;
    const fixedTotal = monthData.fixed_total || 0;
    const variableProjected = averageVariable;
    const reimbursements = monthData.reimbursements_received || 0;
    
    return startingBalance - (fixedTotal + variableProjected) + reimbursements;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-obsidian-text-muted">Chargement des prévisions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-obsidian-text">Prévisions</h1>
        <p className="text-obsidian-text-muted mt-2">
          Projection de vos finances futures basée sur vos dépenses moyennes
        </p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-obsidian-text mb-2">
              Paramètres de prévision
            </h3>
            <p className="text-sm text-obsidian-text-muted">
              Moyenne des dépenses variables: {formatCurrency(averageVariable)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-obsidian-text">Nombre de mois:</label>
            <select
              value={monthsToForecast}
              onChange={(e) => setMonthsToForecast(Number(e.target.value))}
              className="input-field"
            >
              <option value={3}>3 mois</option>
              <option value={6}>6 mois</option>
              <option value={12}>12 mois</option>
            </select>
          </div>
        </div>
      </div>

      {recurringExpenses.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-obsidian-text mb-4">
            Dépenses récurrentes prévues
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recurringExpenses.map(expense => (
              <div key={expense.id} className="flex justify-between p-3 bg-obsidian-bg rounded-lg">
                <span className="text-obsidian-text">{expense.description}</span>
                <span className="text-red-400 font-semibold">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-obsidian-border">
            <div className="flex justify-between">
              <span className="text-obsidian-text font-semibold">
                Total mensuel récurrent
              </span>
              <span className="text-red-400 font-bold text-lg">
                {formatCurrency(
                  recurringExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forecast.map((month, index) => {
          const projectedPrevisionnel = calculateProjectedPrevisionnel(month);
          const currentDate = new Date();
          const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + index + 1, 1);
          
          return (
            <div key={`${month.year}-${month.month}`} className="card">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-obsidian-text">
                  {monthNames[futureDate.getMonth()]} {futureDate.getFullYear()}
                </h3>
                <span className="text-sm text-obsidian-text-muted">
                  Dans {index + 1} mois
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-text-muted">Solde de départ</span>
                  <span className="text-obsidian-text">
                    {formatCurrency(month.starting_balance || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-text-muted">Dépenses fixes</span>
                  <span className="text-red-400">
                    -{formatCurrency(month.fixed_total || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-text-muted">Variables (estimé)</span>
                  <span className="text-orange-400">
                    -{formatCurrency(averageVariable)}
                  </span>
                </div>
                
                <div className="pt-2 mt-2 border-t border-obsidian-border">
                  <div className="flex justify-between">
                    <span className="font-semibold text-obsidian-text">
                      Prévisionnel estimé
                    </span>
                    <span className={`font-bold text-lg ${
                      projectedPrevisionnel >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(projectedPrevisionnel)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card mt-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-obsidian-text-muted">
            <p className="mb-2">
              <strong>Comment sont calculées les prévisions ?</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li>• Les dépenses fixes sont basées sur vos dépenses récurrentes configurées</li>
              <li>• Les dépenses variables sont estimées sur la moyenne des 3 derniers mois</li>
              <li>• Le solde de départ de chaque mois est le prévisionnel du mois précédent</li>
              <li>• Les remboursements ne sont pas inclus dans les projections futures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}