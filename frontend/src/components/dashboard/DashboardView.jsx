import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardView() {
  const [currentMonthData, setCurrentMonthData] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [previsionnelRes, expensesRes] = await Promise.all([
        api.getPrevisionnel(currentYear, currentMonth),
        api.getMonthExpenses(currentYear, currentMonth)
      ]);

      setCurrentMonthData(previsionnelRes);
      
      const sortedExpenses = (expensesRes.expenses || [])
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentExpenses(sortedExpenses);

      const last3Months = [];
      for (let i = 0; i < 3; i++) {
        const date = new Date(currentYear, currentMonth - 1 - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        
        try {
          const monthPrevisionnel = await api.getPrevisionnel(year, month);
          last3Months.push({
            year,
            month,
            total: monthPrevisionnel.fixed_total + monthPrevisionnel.variable_total
          });
        } catch (err) {
          last3Months.push({ year, month, total: 0 });
        }
      }
      
      setMonthlyTotals(last3Months);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long'
    });
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

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
        <h1 className="text-3xl font-bold text-obsidian-text">Tableau de bord</h1>
        <p className="text-obsidian-text-muted mt-2">
          Vue d'ensemble de vos finances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="card">
          <h3 className="text-lg font-semibold text-obsidian-text mb-4">
            Mois actuel - {monthNames[currentMonth - 1]} {currentYear}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-obsidian-text-muted">Prévisionnel</span>
              <span className={`font-bold ${
                currentMonthData?.previsionnel >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(currentMonthData?.previsionnel || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-obsidian-text-muted">Dépenses fixes</span>
              <span className="text-red-400">
                {formatCurrency(currentMonthData?.fixed_total || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-obsidian-text-muted">Dépenses variables</span>
              <span className="text-orange-400">
                {formatCurrency(currentMonthData?.variable_total || 0)}
              </span>
            </div>
            <div className="pt-3 border-t border-obsidian-border">
              <button
                onClick={() => navigate(`/month/${currentYear}/${currentMonth}`)}
                className="btn-primary w-full"
              >
                Voir le mois complet
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-obsidian-text mb-4">
            Dernières dépenses
          </h3>
          <div className="space-y-2">
            {recentExpenses.length > 0 ? (
              recentExpenses.map(expense => (
                <div key={expense.id} className="flex justify-between text-sm">
                  <div className="flex-1 truncate text-obsidian-text">
                    {expense.description}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-semibold">
                      {formatCurrency(expense.amount)}
                    </span>
                    <span className="text-obsidian-text-muted text-xs">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-obsidian-text-muted text-sm">
                Aucune dépense ce mois-ci
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-obsidian-text mb-4">
            Historique des dépenses
          </h3>
          {monthlyTotals.length > 0 && (
            <div className="h-40">
              <Bar 
                data={{
                  labels: monthlyTotals.map(({ month }) => monthNames[month - 1].substring(0, 3)),
                  datasets: [{
                    label: 'Dépenses',
                    data: monthlyTotals.map(({ total }) => total),
                    backgroundColor: [
                      'rgba(248, 113, 113, 0.8)',
                      'rgba(251, 146, 60, 0.8)',
                      'rgba(250, 204, 21, 0.8)'
                    ],
                    borderColor: [
                      'rgb(248, 113, 113)',
                      'rgb(251, 146, 60)',
                      'rgb(250, 204, 21)'
                    ],
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          return new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(context.parsed.y);
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: '#a1a1aa',
                        font: {
                          size: 11
                        }
                      }
                    },
                    y: {
                      grid: {
                        color: 'rgba(161, 161, 170, 0.1)'
                      },
                      ticks: {
                        color: '#a1a1aa',
                        font: {
                          size: 10
                        },
                        callback: (value) => {
                          return new Intl.NumberFormat('fr-FR', {
                            notation: 'compact',
                            style: 'currency',
                            currency: 'EUR',
                            minimumFractionDigits: 0
                          }).format(value);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          )}
        </div>

        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-obsidian-text mb-4">
            Actions rapides
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(`/month/${currentYear}/${currentMonth}`)}
              className="btn-secondary"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une dépense
            </button>
            <button
              onClick={() => navigate('/forecast')}
              className="btn-secondary"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Voir les prévisions
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-obsidian-text mb-4">
            Remboursements en attente
          </h3>
          {currentMonthData?.reimbursements_pending > 0 ? (
            <div>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(currentMonthData.reimbursements_pending)}
              </p>
              <p className="text-sm text-obsidian-text-muted mt-2">
                À recevoir prochainement
              </p>
            </div>
          ) : (
            <p className="text-obsidian-text-muted text-sm">
              Aucun remboursement en attente
            </p>
          )}
        </div>

      </div>
    </div>
  );
}