import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProgramAnalytics } from '../lib/apiService';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register the components needed for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const ProgramAnalyticsPage = () => {
    const { programId } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const result = await getProgramAnalytics(programId);
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
    }, [programId]);

    if (loading) return <div>Loading analytics...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!analytics) return <div>No analytics data found.</div>;

    // Data for the Doughnut chart
    const doughnutData = {
        labels: analytics.reportsBySeverity.map(d => d.severity),
        datasets: [{
            data: analytics.reportsBySeverity.map(d => d.count),
            backgroundColor: ['#dc3545', '#ffc107', '#0d6efd', '#0dcaf0'],
        }],
    };

    // Data for the Line chart
    const lineData = {
        labels: analytics.submissionTrend.map(d => d.date),
        datasets: [{
            label: 'Reports Submitted',
            data: analytics.submissionTrend.map(d => d.count),
            fill: false,
            borderColor: '#34d399',
            tension: 0.1,
        }],
    };

    return (
        <div>
            <h2 className="mb-4">Program Analytics: {analytics.programTitle}</h2>

            {/* KPIs */}
            <div className="row mb-4">
                <div className="col-md-3"><div className="card text-center"><div className="card-body"><h5 className="card-title">{analytics.kpis.totalReports}</h5><p className="card-text text-muted">Total Reports</p></div></div></div>
                <div className="col-md-3"><div className="card text-center"><div className="card-body"><h5 className="card-title">{analytics.kpis.resolvedReports}</h5><p className="card-text text-muted">Resolved</p></div></div></div>
                <div className="col-md-3"><div className="card text-center"><div className="card-body"><h5 className="card-title">{analytics.kpis.avgTimeToBountyDays} Days</h5><p className="card-text text-muted">Avg. Time to Bounty</p></div></div></div>
                <div className="col-md-3"><div className="card text-center"><div className="card-body"><h5 className="card-title">${analytics.kpis.totalPaidOut.toLocaleString()}</h5><p className="card-text text-muted">Total Paid Out</p></div></div></div>
            </div>

            {/* Charts */}
            <div className="row">
                <div className="col-md-8">
                    <div className="card"><div className="card-body"><h5 className="card-title">Submission Trend</h5><Line data={lineData} /></div></div>
                </div>
                <div className="col-md-4">
                    <div className="card"><div className="card-body"><h5 className="card-title">Reports by Severity</h5><Doughnut data={doughnutData} /></div></div>
                </div>
            </div>
        </div>
    );
};

export default ProgramAnalyticsPage;