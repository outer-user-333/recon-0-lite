import React, { useState, useEffect } from 'react';
import { useUserStore } from '../lib/userStore';

// StatCard component remains the same
function StatCard({ title, value, icon, color }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="card-subtitle mb-2 text-muted text-uppercase">{title}</h6>
            <h4 className="card-title mb-0 fw-bold">{value}</h4>
          </div>
          <div className="fs-2" style={{ color }}>
            <i className={`fa-solid ${icon}`}></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);
  
  // State for our dynamic data
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data when the page loads
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats and recent reports at the same time
        const [statsRes, reportsRes] = await Promise.all([
          fetch('http://localhost:3001/api/dashboard-stats'),
          fetch('http://localhost:3001/api/my-reports')
        ]);

        if (!statsRes.ok || !reportsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const statsData = await statsRes.json();
        const reportsData = await reportsRes.json();
        
        setStats(statsData);
        setRecentReports(reportsData);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show a loading state while fetching
  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  const fullName = user?.user_metadata?.full_name || 'Hacker';

  return (
    <div>
      <h1 className="mb-4">Welcome back, {fullName}! 👋</h1>
      
      <div className="row g-4">
        <div className="col-md-6 col-xl-3">
          <StatCard title="Reputation" value={stats?.reputation || '...'} icon="fa-shield-halved" color="var(--accent-green)" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Reports Submitted" value={stats?.reportsSubmitted || '...'} icon="fa-file-lines" color="var(--accent-cyan)" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Reports Accepted" value={stats?.reportsAccepted || '...'} icon="fa-check-circle" color="#a855f7" />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard title="Bounties Earned" value={stats?.bountiesEarned || '...'} icon="fa-sack-dollar" color="#f59e0b" />
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Recent Activity</h5>
          <a href="/my-reports" className="btn btn-sm btn-ghost">View all →</a>
        </div>
        <div className="list-group list-group-flush">
          {recentReports.slice(0, 3).map(report => ( // We only show the first 3 reports
            <a href="#" key={report.id} className="list-group-item list-group-item-action bg-transparent text-white border-secondary">
              Report "{report.title}" has status: <strong>{report.status}</strong>.
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}