import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProgramAnalytics } from '../lib/apiService.js';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { ArrowLeft, BarChart3, ShieldCheck, Clock, DollarSign } from 'lucide-react';

// Register the components needed for Chart.js, including the Filler plugin for gradient fills
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

// A reusable, styled Stat Card, consistent with the main Dashboard
const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClass}`}>
                {icon}
            </div>
        </div>
    </div>
);


const ProgramAnalyticsPage = () => {
    const { programId } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Data fetching logic remains identical
        const fetchAnalytics = async () => {
            try {
                const result = await getProgramAnalytics(programId);
                if (result.success) {
                    setAnalytics(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch analytics.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [programId]);

    if (loading) return <div className="text-center text-slate-500 p-8">Loading analytics...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;
    if (!analytics) return <div className="text-center text-slate-500 p-8">No analytics data found for this program.</div>;

    // --- Chart Data and Options ---
    // The data structure logic is preserved, but the styling options are updated for the new theme.
    
    const doughnutData = {
        labels: analytics.reportsBySeverity.map(d => d.severity),
        datasets: [{
            data: analytics.reportsBySeverity.map(d => d.count),
            backgroundColor: ['#F43F5E', '#F97316', '#3B82F6', '#64748B'], // rose-500, orange-500, blue-500, slate-500
            borderColor: '#FFFFFF',
            borderWidth: 2,
            hoverOffset: 4,
        }],
    };
    
    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                 labels: {
                    padding: 20,
                    boxWidth: 12,
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            }
        },
        cutout: '60%'
    };

    const lineData = {
        labels: analytics.submissionTrend.map(d => d.date),
        datasets: [{
            label: 'Reports Submitted',
            data: analytics.submissionTrend.map(d => d.count),
            borderColor: '#3B82F6', // blue-500
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, "rgba(59, 130, 246, 0.2)");
                gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
                return gradient;
            },
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#FFFFFF',
            pointHoverRadius: 6,
            pointRadius: 4,
            tension: 0.3,
            fill: true,
        }],
    };
    
     const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#E2E8F0' // slate-200
                }
            },
             x: {
                grid: {
                    display: false
                }
            }
        }
    };


    return (
        <div className="space-y-6">
            <div>
                 <Link to="/my-programs" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline mb-2">
                    <ArrowLeft size={16} />
                    Back to My Programs
                </Link>
                <h1 className="text-3xl font-bold text-slate-800">Program Analytics</h1>
                <p className="text-slate-500">Showing data for: <span className="font-semibold">{analytics.programTitle}</span></p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="Total Reports" value={analytics.kpis.totalReports} icon={<BarChart3 size={24} />} colorClass="bg-slate-100 text-slate-600" />
                <StatCard title="Resolved" value={analytics.kpis.resolvedReports} icon={<ShieldCheck size={24} />} colorClass="bg-emerald-100 text-emerald-600" />
                <StatCard title="Avg. Time to Bounty" value={`${analytics.kpis.avgTimeToBountyDays} Days`} icon={<Clock size={24} />} colorClass="bg-violet-100 text-violet-600" />
                <StatCard title="Total Paid Out" value={`$${analytics.kpis.totalPaidOut.toLocaleString()}`} icon={<DollarSign size={24} />} colorClass="bg-blue-100 text-blue-600" />
            </div>

            {/* Charts */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                     <h3 className="text-lg font-semibold text-slate-800 mb-4">Submission Trend</h3>
                    <Line options={lineOptions} data={lineData} />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Reports by Severity</h3>
                     <Doughnut options={doughnutOptions} data={doughnutData} />
                </div>
            </div>
        </div>
    );
};

export default ProgramAnalyticsPage;

