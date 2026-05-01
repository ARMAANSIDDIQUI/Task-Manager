import { useState, useEffect } from 'react';
import API from '../services/api';
import { CheckCircle, Clock, AlertCircle, List } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/tasks/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="container">Loading dashboard...</div>;

  const statItems = [
    { label: 'Total Tasks', value: stats?.totalTasks || 0, icon: <List color="#2563eb" />, bg: '#eff6ff' },
    { label: 'Pending', value: stats?.todoTasks || 0, icon: <Clock color="#854d0e" />, bg: '#fefce8' },
    { label: 'Completed', value: stats?.completedTasks || 0, icon: <CheckCircle color="#166534" />, bg: '#f0fdf4' },
    { label: 'Overdue', value: stats?.overdueTasks || 0, icon: <AlertCircle color="#991b1b" />, bg: '#fef2f2' },
  ];

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {statItems.map((item, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: item.bg, padding: '0.75rem', borderRadius: '0.5rem' }}>
              {item.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{item.label}</p>
              <h3 style={{ fontSize: '1.5rem' }}>{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Welcome to TaskManager</h3>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          This is your personal workspace. You can view your projects and manage tasks efficiently.
          Use the navigation links above to dive into specific projects.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
