import React, { useState, useEffect } from 'react';
import { getPlatformAnalytics } from '/src/lib/apiService.js';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title
} from 'chart.js';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import { 
    Users, Code, Briefcase, Target, FileText, TrendingUp, 
    Shield, Award, Clock, DollarSign, Activity, AlertTriangle,
    CheckCircle, XCircle, Eye, Calendar
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
    ArcElement, 
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip, 
    Legend
);

// Reusable StatCard component
const StatCard = ({ title, value, icon, colorClass, trend, trendValue }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
                {trend && (
                    <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        <TrendingUp className={`w-4 h-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-full ${colorClass}`}>
                {icon}
            </div>
        </div>
    </div>
);

// Reusable chart container
const ChartCard = ({ title, children, className = "md:col-span-1" }) => (
    <div className={`${className} bg-white p-6 rounded-2xl shadow-sm border border-slate-200`}>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        {children}
    </div>
);

// Table component for top performers
const TopPerformersTable = ({ data, type = 'hackers' }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-2 font-semibold text-slate-900">Rank</th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-900">
                        {type === 'hackers' ? 'Hacker' : 'Organization'}
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-900">Reports</th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-900">Earnings</th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-900">Rating</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-2">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                                ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                  index === 1 ? 'bg-slate-100 text-slate-700' :
                                  index === 2 ? 'bg-orange-100 text-orange-700' :
                                  'bg-slate-50 text-slate-600'}`}>
                                {index + 1}
                            </span>
                        </td>
                        <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                                    {item.name.charAt(0)}
                                </div>
                                <span className="font-medium text-slate-900">{item.name}</span>
                            </div>
                        </td>
                        <td className="py-3 px-2 text-slate-700">{item.reports}</td>
                        <td className="py-3 px-2 text-emerald-600 font-semibold">${item.earnings.toLocaleString()}</td>
                        <td className="py-3 px-2">
                            <div className="flex items-center gap-1">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < Math.floor(item.rating) ? '' : 'text-slate-300'}>★</span>
                                    ))}
                                </div>
                                <span className="text-sm text-slate-500 ml-1">{item.rating}</span>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

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
                } else {
                    throw new Error(result.message || "Failed to fetch platform analytics.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="text-center text-slate-500 p-8">Loading platform analytics...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;
    if (!analytics) return <div className="text-center text-slate-500 p-8">No analytics data found.</div>;

    // --- Enhanced Mock Data for Demonstration ---
    const mockData = {
        monthlyGrowth: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            users: [1200, 1450, 1650, 1820, 2100, 2380, 2650, 2890, 3150],
            reports: [450, 520, 680, 750, 890, 1020, 1180, 1340, 1500],
            programs: [25, 28, 32, 38, 45, 52, 58, 65, 72]
        },
        severityDistribution: {
            labels: ['Critical', 'High', 'Medium', 'Low', 'Info'],
            data: [85, 245, 420, 680, 290],
            colors: ['#F43F5E', '#F97316', '#F59E0B', '#3B82F6', '#64748B']
        },
        topHackers: [
            { name: 'CryptoHunter', reports: 156, earnings: 45200, rating: 4.9 },
            { name: 'ZeroDayZee', reports: 134, earnings: 38500, rating: 4.8 },
            { name: 'BugMaster', reports: 122, earnings: 35800, rating: 4.7 },
            { name: 'SecureShell', reports: 108, earnings: 31200, rating: 4.6 },
            { name: 'ByteHunter', reports: 95, earnings: 28900, rating: 4.5 }
        ],
        topOrgs: [
            { name: 'TechCorp Inc', reports: 245, earnings: 125000, rating: 4.8 },
            { name: 'SecureBank', reports: 198, earnings: 98500, rating: 4.7 },
            { name: 'DataStream', reports: 176, earnings: 87200, rating: 4.6 },
            { name: 'CloudSafe', reports: 154, earnings: 76800, rating: 4.5 },
            { name: 'FinTech Pro', reports: 132, earnings: 65400, rating: 4.4 }
        ],
        recentActivity: [
            { type: 'report', message: 'Critical vulnerability reported in TechCorp API', time: '2 minutes ago', severity: 'critical' },
            { type: 'bounty', message: 'Bounty of $5,000 paid to CryptoHunter', time: '15 minutes ago', severity: 'success' },
            { type: 'program', message: 'New program launched by SecureBank', time: '1 hour ago', severity: 'info' },
            { type: 'user', message: '23 new hackers joined the platform', time: '2 hours ago', severity: 'info' },
            { type: 'report', message: 'High severity XSS vulnerability patched', time: '3 hours ago', severity: 'warning' }
        ]
    };

    // Chart configurations
    const doughnutData = {
        labels: analytics.reportsByStatus.map(d => d.status),
        datasets: [{
            data: analytics.reportsByStatus.map(d => d.count),
            backgroundColor: ['#3B82F6', '#10B981', '#F97316'],
            borderColor: '#FFFFFF',
            borderWidth: 2,
            hoverOffset: 6,
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
                    font: { family: 'Inter, sans-serif' }
                }
            }
        },
        cutout: '60%'
    };

    const growthChartData = {
        labels: mockData.monthlyGrowth.labels,
        datasets: [
            {
                label: 'New Users',
                data: mockData.monthlyGrowth.users,
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Reports Submitted',
                data: mockData.monthlyGrowth.reports,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
            }
        ]
    };

    const severityBarData = {
        labels: mockData.severityDistribution.labels,
        datasets: [{
            label: 'Number of Reports',
            data: mockData.severityDistribution.data,
            backgroundColor: mockData.severityDistribution.colors,
            borderRadius: 6,
            borderSkipped: false,
        }]
    };

    const programsPieData = {
        labels: ['Web Applications', 'Mobile Apps', 'API Security', 'Infrastructure', 'IoT Devices'],
        datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F97316', '#F43F5E'],
            borderWidth: 2,
            borderColor: '#FFFFFF'
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Platform Analytics</h1>
                <p className="mt-1 text-slate-500">Comprehensive overview of all activity and performance metrics on Recon_0</p>
            </div>

            {/* Primary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <StatCard 
                    title="Total Users" 
                    value={analytics.kpis.totalUsers.toLocaleString()} 
                    icon={<Users size={24} />} 
                    colorClass="bg-slate-100 text-slate-700" 
                    trend="up" 
                    trendValue="+12.5%" 
                />
                <StatCard 
                    title="Active Hackers" 
                    value={analytics.kpis.totalHackers.toLocaleString()} 
                    icon={<Code size={24} />} 
                    colorClass="bg-emerald-100 text-emerald-600" 
                    trend="up" 
                    trendValue="+8.3%" 
                />
                <StatCard 
                    title="Organizations" 
                    value={analytics.kpis.totalOrgs.toLocaleString()} 
                    icon={<Briefcase size={24} />} 
                    colorClass="bg-blue-100 text-blue-600" 
                    trend="up" 
                    trendValue="+15.2%" 
                />
                <StatCard 
                    title="Live Programs" 
                    value={analytics.kpis.totalPrograms.toLocaleString()} 
                    icon={<Target size={24} />} 
                    colorClass="bg-violet-100 text-violet-600" 
                    trend="up" 
                    trendValue="+22.1%" 
                />
                <StatCard 
                    title="Total Reports" 
                    value={analytics.kpis.totalReports.toLocaleString()} 
                    icon={<FileText size={24} />} 
                    colorClass="bg-orange-100 text-orange-600" 
                    trend="up" 
                    trendValue="+18.7%" 
                />
            </div>

            {/* Secondary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Bounties Paid" 
                    value="$1.2M" 
                    icon={<DollarSign size={24} />} 
                    colorClass="bg-emerald-100 text-emerald-600" 
                />
                <StatCard 
                    title="Avg Response Time" 
                    value="4.2 days" 
                    icon={<Clock size={24} />} 
                    colorClass="bg-blue-100 text-blue-600" 
                />
                <StatCard 
                    title="Resolution Rate" 
                    value="94.5%" 
                    icon={<CheckCircle size={24} />} 
                    colorClass="bg-emerald-100 text-emerald-600" 
                />
                <StatCard 
                    title="Platform Uptime" 
                    value="99.9%" 
                    icon={<Activity size={24} />} 
                    colorClass="bg-violet-100 text-violet-600" 
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title="Reports by Status">
                    <Doughnut options={doughnutOptions} data={doughnutData} />
                </ChartCard>
                
                <ChartCard title="Report Severity Distribution">
                    <Bar options={chartOptions} data={severityBarData} />
                </ChartCard>
                
                <ChartCard title="Program Categories">
                    <Pie options={doughnutOptions} data={programsPieData} />
                </ChartCard>
            </div>

            {/* Growth Chart */}
            <ChartCard title="Platform Growth Trends" className="w-full">
                <div className="h-80">
                    <Line options={chartOptions} data={growthChartData} />
                </div>
            </ChartCard>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Top Performing Hackers">
                    <TopPerformersTable data={mockData.topHackers} type="hackers" />
                </ChartCard>
                
                <ChartCard title="Top Organizations">
                    <TopPerformersTable data={mockData.topOrgs} type="organizations" />
                </ChartCard>
            </div>

            {/* Recent Activity Feed */}
            <ChartCard title="Recent Platform Activity" className="w-full">
                <div className="space-y-4">
                    {mockData.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className={`p-2 rounded-full ${
                                activity.severity === 'critical' ? 'bg-rose-100 text-rose-600' :
                                activity.severity === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                activity.severity === 'warning' ? 'bg-orange-100 text-orange-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                                {activity.type === 'report' ? <Shield size={16} /> :
                                 activity.type === 'bounty' ? <DollarSign size={16} /> :
                                 activity.type === 'program' ? <Target size={16} /> :
                                 activity.type === 'user' ? <Users size={16} /> :
                                 <Activity size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-900">{activity.message}</p>
                                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ChartCard>
        </div>
    );
};

export default PlatformAnalyticsPage;