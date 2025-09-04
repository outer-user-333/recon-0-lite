import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// We must register the components we want to use from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const ProgramAnalyticsPage = () => {
    const { programId } = useParams();
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/v1/programs/${programId}/analytics`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (result.success) {
                    setAnalyticsData(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch analytics.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [programId]);

    if (loading) return <p>Loading analytics dashboard...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!analyticsData) return <p>No analytics data available for this program.</p>;

    const { program, kpis, reportsBySeverity, submissionTrend } = analyticsData;

    const severityChartData = {
        labels: reportsBySeverity.map(d => d.severity),
        datasets: [{
            label: 'Reports by Severity',
            data: reportsBySeverity.map(d => d.count),
            backgroundColor: ['#dc3545', '#fd7e14', '#ffc107', '#0dcaf0'],
        }],
    };

    const trendChartData = {
        labels: submissionTrend.map(d => d.date),
        datasets: [{
            label: 'Reports Submitted Over Time',
            data: submissionTrend.map(d => d.count),
            fill: false,
            borderColor: 'var(--bs-primary)',
            tension: 0.1,
        }],
    };
    
    return (
        <div className="container mt-5">
            <h2 className="mb-2">Program Analytics: {program.title}</h2>
            <p className="text-muted mb-4">An overview of your program's performance and key metrics.</p>

            {/* KPI Cards */}
            <div className="row mb-4 g-4">
                <div className="col-md-3">
                    <div className="card text-center h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-muted">Total Reports</h5>
                            <p className="card-text fs-2 fw-bold">{kpis.total_reports}</p>
                        </div>
                    </div>
                </div>
                 <div className="col-md-3">
                    <div className="card text-center h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-muted">Reports Resolved</h5>
                            <p className="card-text fs-2 fw-bold">{kpis.reports_resolved}</p>
                        </div>
                    </div>
                </div>
                 <div className="col-md-3">
                    <div className="card text-center h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-muted">Avg. Time to Bounty</h5>
                            <p className="card-text fs-2 fw-bold">{kpis.avg_time_to_bounty_days}d</p>
                        </div>
                    </div>
                </div>
                 <div className="col-md-3">
                    <div className="card text-center h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-muted">Total Paid Out</h5>
                            <p className="card-text fs-2 fw-bold">${kpis.total_paid_out.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Reports by Severity</h5>
                            <Doughnut data={severityChartData} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Submission Trend</h5>
                             <Line data={trendChartData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramAnalyticsPage;
