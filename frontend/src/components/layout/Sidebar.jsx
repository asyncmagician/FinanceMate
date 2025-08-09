import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ open }) {
  const [months, setMonths] = useState({});
  const [expandedYears, setExpandedYears] = useState(new Set());
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { year: currentYear, month: currentMonth } = useParams();

  useEffect(() => {
    loadMonths();
  }, []);

  const loadMonths = async () => {
    try {
      const data = await api.getMonths();
      const grouped = data.reduce((acc, month) => {
        if (!acc[month.year]) acc[month.year] = [];
        acc[month.year].push(month);
        return acc;
      }, {});
      
      setMonths(grouped);
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      // Auto-expand current year and next year if we're in Q4
      const toExpand = currentMonth >= 9 
        ? [currentYear, currentYear + 1]
        : [currentYear];
      setExpandedYears(new Set(toExpand));
    } catch (err) {
      console.error('Failed to load months:', err);
    }
  };

  const toggleYear = (year) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const monthNames = [
    t('months.january'), t('months.february'), t('months.march'), 
    t('months.april'), t('months.may'), t('months.june'),
    t('months.july'), t('months.august'), t('months.september'), 
    t('months.october'), t('months.november'), t('months.december')
  ];

  const currentDate = new Date();
  const currentYearNum = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1;
  
  // Show current year and next year, but if we're in September or later,
  // also prepare for showing next year prominently
  const years = currentMonthNum >= 9 
    ? [currentYearNum, currentYearNum + 1, currentYearNum + 2]
    : [currentYearNum, currentYearNum + 1];

  return (
    <div className={`${
      open ? 'translate-x-0' : '-translate-x-full'
    } fixed sm:relative z-40 w-64 h-full bg-obsidian-bg-secondary border-r border-obsidian-border transition-transform duration-300 overflow-hidden`}>
      <div className="p-4 h-full overflow-y-auto">
        <h2 className="text-lg font-semibold text-obsidian-text mb-4">FinanceMate</h2>
        
        <nav className="space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-3 py-2 text-obsidian-text hover:bg-obsidian-bg-hover rounded transition-colors"
          >
            {t('sidebar.dashboard')}
          </button>
          
          <button
            onClick={() => navigate('/forecast')}
            className="w-full text-left px-3 py-2 text-obsidian-text hover:bg-obsidian-bg-hover rounded transition-colors"
          >
            {t('sidebar.forecast')}
          </button>
          
          <button
            onClick={() => navigate('/recurring')}
            className="w-full text-left px-3 py-2 text-obsidian-text hover:bg-obsidian-bg-hover rounded transition-colors"
          >
            {t('sidebar.recurring')}
          </button>
          
          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full text-left px-3 py-2 text-obsidian-text hover:bg-obsidian-bg-hover rounded transition-colors"
            >
              {t('admin.title')}
            </button>
          )}
          
          <div className="pt-4">
            <h3 className="text-xs font-semibold text-obsidian-text-muted uppercase tracking-wider mb-2">
              {t('sidebar.months', 'Mois')}
            </h3>
            
            <div className="space-y-1">
              {years.map(year => (
                <div key={year}>
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full flex items-center justify-between px-3 py-1 text-obsidian-text hover:bg-obsidian-bg-hover rounded transition-colors"
                >
                  <span>{year}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${expandedYears.has(year) ? 'rotate-90' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {expandedYears.has(year) && (
                  <div className="ml-4">
                    {monthNames.map((monthName, index) => {
                      const month = index + 1;
                      const isActive = currentYear == year && currentMonth == month;
                      
                      return (
                        <button
                          key={month}
                          onClick={() => navigate(`/month/${year}/${month}`)}
                          className={`w-full text-left px-3 py-1 text-sm transition-colors rounded ${
                            isActive 
                              ? 'bg-obsidian-accent text-white' 
                              : 'text-obsidian-text-muted hover:text-obsidian-text hover:bg-obsidian-bg-hover'
                          }`}
                        >
                          {monthName}
                        </button>
                      );
                    })}
                  </div>
                )}
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}