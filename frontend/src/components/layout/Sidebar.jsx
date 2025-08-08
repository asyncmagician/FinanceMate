import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function Sidebar({ open }) {
  const [months, setMonths] = useState({});
  const [expandedYears, setExpandedYears] = useState(new Set());
  const navigate = useNavigate();
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
      
      const currentYear = new Date().getFullYear();
      setExpandedYears(new Set([currentYear]));
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
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentDate = new Date();
  const years = [currentDate.getFullYear(), currentDate.getFullYear() + 1];

  return (
    <div className={`${
      open ? 'translate-x-0' : '-translate-x-full'
    } fixed sm:relative sm:translate-x-0 z-40 w-64 h-full bg-obsidian-bg-secondary border-r border-obsidian-border transition-transform duration-300 sm:transition-none`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-obsidian-text mb-4">FinanceMate</h2>
        
        <nav className="space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-3 py-2 text-obsidian-text hover:bg-obsidian-bg-hover rounded transition-colors"
          >
            Dashboard
          </button>
          
          <button
            onClick={() => navigate('/forecast')}
            className="w-full text-left px-3 py-2 text-obsidian-text hover:bg-obsidian-bg-hover rounded transition-colors"
          >
            Forecast
          </button>
          
          <div className="pt-4">
            <h3 className="text-xs font-semibold text-obsidian-text-muted uppercase tracking-wider mb-2">
              Months
            </h3>
            
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
        </nav>
      </div>
    </div>
  );
}