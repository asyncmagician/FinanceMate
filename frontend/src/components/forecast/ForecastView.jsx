import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ForecastView() {
  const { t } = useLanguage();
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
      setRecurringExpenses(Array.isArray(recurringRes) ? recurringRes : recurringRes.recurringExpenses || []);

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
    t('months.january'), t('months.february'), t('months.march'),
    t('months.april'), t('months.may'), t('months.june'),
    t('months.july'), t('months.august'), t('months.september'),
    t('months.october'), t('months.november'), t('months.december')
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
        <div className="text-obsidian-text-muted">{t('forecast.loading', 'Chargement des prévisions...')}</div>
      </div>
    );
  }

  const chartData = {
    labels: forecast.map((_, index) => {
      const currentDate = new Date();
      const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + index + 1, 1);
      return monthNames[futureDate.getMonth()].substring(0, 3);
    }),
    datasets: [
      {
        label: t('previsionnel.title'),
        data: forecast.map(month => calculateProjectedPrevisionnel(month)),
        borderColor: 'rgb(74, 222, 128)',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: t('expenses.total', 'Dépenses totales'),
        data: forecast.map(month => -(month.fixed_total + averageVariable)),
        borderColor: 'rgb(248, 113, 113)',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a1a1aa',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(context.parsed.y);
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(161, 161, 170, 0.1)'
        },
        ticks: {
          color: '#a1a1aa'
        }
      },
      y: {
        grid: {
          color: 'rgba(161, 161, 170, 0.1)'
        },
        ticks: {
          color: '#a1a1aa',
          callback: (value) => {
            return new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 0
            }).format(value);
          }
        }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-obsidian-text">{t('forecast.title')}</h1>
        <p className="text-obsidian-text-muted mt-2">
          {t('forecast.subtitle', 'Projection de vos finances futures basée sur vos dépenses moyennes')}
        </p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-obsidian-text mb-2">
              {t('forecast.settings', 'Paramètres de prévision')}
            </h3>
            <p className="text-sm text-obsidian-text-muted">
              {t('forecast.averageVariableExpenses', 'Moyenne des dépenses variables')}: {formatCurrency(averageVariable)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-obsidian-text">{t('forecast.numberOfMonths', 'Nombre de mois')}:</label>
            <select
              value={monthsToForecast}
              onChange={(e) => setMonthsToForecast(Number(e.target.value))}
              className="input-field"
            >
              <option value={3}>{t('forecast.months3')}</option>
              <option value={6}>{t('forecast.months6')}</option>
              <option value={12}>{t('forecast.months12')}</option>
            </select>
          </div>
        </div>
      </div>

      {forecast.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-obsidian-text mb-4">
            {t('forecast.evolutionTitle', 'Évolution prévisionnelle')}
          </h3>
          <div className="h-64 sm:h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {recurringExpenses.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-obsidian-text mb-4">
            {t('forecast.plannedRecurring', 'Dépenses récurrentes prévues')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recurringExpenses.map(expense => {
              let displayAmount = parseFloat(expense.amount || 0);
              const isShared = expense.share_type && expense.share_type !== 'none';
              
              // Calculate user's portion if shared
              if (isShared) {
                if (expense.share_type === 'equal') {
                  displayAmount = displayAmount / 2;
                } else if (expense.share_type === 'percentage' && expense.share_value) {
                  displayAmount = displayAmount * (parseFloat(expense.share_value) / 100);
                } else if (expense.share_type === 'amount' && expense.share_value) {
                  displayAmount = parseFloat(expense.share_value);
                }
              }
              
              return (
                <div key={expense.id} className="flex justify-between p-3 bg-obsidian-bg rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-obsidian-text">{expense.description}</span>
                    {isShared && (
                      <span className="text-xs bg-obsidian-accent/20 text-obsidian-accent px-2 py-0.5 rounded">
                        {t('expenses.shared', 'Partagé')}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-red-400 font-semibold">
                      {formatCurrency(displayAmount)}
                    </span>
                    {isShared && (
                      <div className="text-xs text-obsidian-text-muted">
                        {t('expenses.yourPart', 'Votre part')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-obsidian-border">
            <div className="flex justify-between">
              <span className="text-obsidian-text font-semibold">
                {t('forecast.monthlyRecurringTotal', 'Total mensuel récurrent')}
              </span>
              <span className="text-red-400 font-bold text-lg">
                {formatCurrency(
                  recurringExpenses.reduce((sum, expense) => {
                    let amount = parseFloat(expense.amount || 0);
                    // Calculate user's portion if shared
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
                  }, 0)
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
                  {t('forecast.inMonths', 'Dans {{months}} mois').replace('{{months}}', index + 1)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-text-muted">{t('previsionnel.startingBalance')}</span>
                  <span className="text-obsidian-text">
                    {formatCurrency(month.starting_balance || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-text-muted">{t('expenses.fixed').replace(' Expenses', '').replace(' Dépenses', '')}</span>
                  <span className="text-red-400">
                    -{formatCurrency(month.fixed_total || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-obsidian-text-muted">{t('forecast.variablesEstimated', 'Variables (estimé)')}</span>
                  <span className="text-orange-400">
                    -{formatCurrency(averageVariable)}
                  </span>
                </div>
                
                <div className="pt-2 mt-2 border-t border-obsidian-border">
                  <div className="flex justify-between">
                    <span className="font-semibold text-obsidian-text">
                      {t('forecast.estimatedPrevisionnel', 'Prévisionnel estimé')}
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
              <strong>{t('forecast.howCalculated', 'Comment sont calculées les prévisions ?')}</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li>• {t('forecast.explanationFixed', 'Les dépenses fixes sont basées sur vos dépenses récurrentes configurées')}</li>
              <li>• {t('forecast.explanationVariable', 'Les dépenses variables sont estimées sur la moyenne des 3 derniers mois')}</li>
              <li>• {t('forecast.explanationBalance', 'Le solde de départ de chaque mois est le prévisionnel du mois précédent')}</li>
              <li>• {t('forecast.explanationReimbursements', 'Les remboursements ne sont pas inclus dans les projections futures')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}