import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentDate = new Date();
    navigate(`/month/${currentDate.getFullYear()}/${currentDate.getMonth() + 1}`);
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-obsidian-text-muted">Redirecting to current month...</div>
    </div>
  );
}