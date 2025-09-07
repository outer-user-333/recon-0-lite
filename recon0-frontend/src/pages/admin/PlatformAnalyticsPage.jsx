import React, { useState, useEffect } from 'react';
import { getPlatformAnalytics } from '../../lib/apiService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PlatformAnalyticsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const result = await getPlatformAnalytics();
                if (result.success) {
                    setAnalytics(result.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div>Loading platform analytics...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!analytics) return <div>No analytics data found.</div>;

    const chartData = {
        labels: analytics.reportsByStatus.map(d => d.status),
        datasets: [{
            data: analytics.reportsByStatus.map(d => d.count),
            backgroundColor: ['#0d6efd', '#198754', '#ffc107'],
        }],
    };

    return (
        <div>
            <h2 className="mb-4">Platform Analytics</h2>

            <div className="row mb-4">
                <div className="col"><div className="card text-center"><div className="card-body"><h4 className="card-title">{analytics.kpis.totalUsers}</h4><p className="card-text text-muted">Total Users</p></div></div></div>
                <div className="col"><div className="card text-center"><div className="card-body"><h4 className="card-title">{analytics.kpis.totalHackers}</h4><p className="card-text text-muted">Hackers</p></div></div></div>
                <div className="col"><div className="card text-center"><div className="card-body"><h4 className="card-title">{analytics.kpis.totalOrgs}</h4><p className="card-text text-muted">Organizations</p></div></div></div>
                <div className="col"><div className="card text-center"><div className="card-body"><h4 className="card-title">{analytics.kpis.totalPrograms}</h4><p className="card-text text-muted">Programs</p></div></div></div>
                <div className="col"><div className="card text-center"><div className="card-body"><h4 className="card-title">{analytics.kpis.totalReports}</h4><p className="card-text text-muted">Reports</p></div></div></div>
            </div>

            <div className="row">
                <div className="col-md-5">
                    <div className="card"><div className="card-body"><h5 className="card-title">Reports by Status</h5><Doughnut data={chartData} /></div></div>
                </div>
            </div>
        </div>
    );
};

export default PlatformAnalyticsPage;