import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getStats, getOrgDashboard } from '../lib/apiService.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
    ArrowUpRight, BarChart3, Briefcase, DollarSign, FileText, 
    ShieldAlert, Star, Users, Clock, Target, Award, TrendingUp
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// A reusable, styled Stat Card for the dashboard
const StatCard = ({ title, value, icon, colorClass, note }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClass}`}>
                {icon}
            </div>
        </div>
        {note && <p className="text-xs text-slate-400 mt-2">{note}</p>}
    </div>
);

// A reusable container card for dashboard sections
const DashboardCard = ({ title, children, viewAllLink }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            {viewAllLink && (
                <Link to={viewAllLink} className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    View All <ArrowUpRight size={14} />
                </Link>
            )}
        </div>
        <div>{children}</div>
    </div>
);

const DashboardPage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileResult = await getProfile();
                if (!profileResult.success) throw new Error("Could not fetch profile.");
                const profile = profileResult.data;
                setUserProfile(profile);

                if (profile.role === 'hacker') {
                    const statsResult = await getStats();
                    if (statsResult.success) setDashboardData(statsResult.data);
                } else if (profile.role === 'organization') {
                    const orgDataResult = await getOrgDashboard();
                    if (orgDataResult.success) setDashboardData(orgDataResult.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center text-slate-500">Loading dashboard...</div>;
    }
    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;
    }

    const isHacker = userProfile?.role === 'hacker';
    const isOrganization = userProfile?.role === 'organization';
    
    // --- DUMMY DATA FOR DEMONSTRATION ---
    const hackerSkillData = {
        labels: ['XSS', 'SQLi', 'Auth Bypass', 'IDOR', 'Other'],
        datasets: [{
            data: [35, 25, 15, 20, 5],
            backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F97316', '#64748B'],
            hoverOffset: 4,
            borderWidth: 0,
        }]
    };
    const doughnutOptions = { responsive: true, plugins: { legend: { position: 'bottom' } } };
    
    const orgChartData = {
        labels: ['Critical', 'High', 'Medium', 'Low', 'Info'],
        datasets: [{
            label: 'Reports by Severity',
            data: [5, 19, 42, 78, 21],
            backgroundColor: ['#F43F5E','#F97316','#F59E0B','#3B82F6','#64748B'],
            borderRadius: 6,
        }]
    };
    const barChartOptions = { responsive: true, plugins: { legend: { display: false } } };

    const topReporters = [
        { name: 'CryptoHunter', reports: 12, avatar: 'https://placehold.co/32x32/8B5CF6/FFFFFF?text=C' },
        { name: 'ZeroDayZee', reports: 9, avatar: 'https://placehold.co/32x32/10B981/FFFFFF?text=Z' },
        { name: 'BugByte', reports: 7, avatar: 'https://placehold.co/32x32/3B82F6/FFFFFF?text=B' },
    ];

    // --- RENDER LOGIC ---
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">
                {isOrganization ? 'Organization Dashboard' : `Welcome back, ${userProfile?.username}!`}
            </h1>

            {/* HACKER DASHBOARD */}
            {isHacker && dashboardData && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <StatCard title="Reputation" value={dashboardData.reputation_points?.toLocaleString()} icon={<Star size={24} />} colorClass="bg-amber-100 text-amber-600" />
                        <StatCard title="Reports Submitted" value={dashboardData.reports_submitted} icon={<FileText size={24} />} colorClass="bg-slate-100 text-slate-600" />
                        <StatCard title="Reports Accepted" value={dashboardData.reports_accepted} icon={<ShieldAlert size={24} />} colorClass="bg-emerald-100 text-emerald-600" />
                        <StatCard title="Bounties Earned" value={`$${dashboardData.bounties_earned?.toLocaleString()}`} icon={<DollarSign size={24} />} colorClass="bg-blue-100 text-blue-600" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                           <DashboardCard title="Recent Activity" viewAllLink="/my-reports">
                                {/* Dummy Data */}
                               <ul className="space-y-3">
                                   <li className="flex items-center gap-3"><span className="p-2 rounded-full bg-emerald-100"><TrendingUp className="h-4 w-4 text-emerald-600"/></span><p className="text-sm text-slate-600">Report for 'DataStream API' accepted. +150 reputation.</p></li>
                                   <li className="flex items-center gap-3"><span className="p-2 rounded-full bg-blue-100"><Target className="h-4 w-4 text-blue-600"/></span><p className="text-sm text-slate-600">New program 'FinTech Secure' is now available. Rewards up to $5,000.</p></li>
                                   <li className="flex items-center gap-3"><span className="p-2 rounded-full bg-violet-100"><Award className="h-4 w-4 text-violet-600"/></span><p className="text-sm text-slate-600">You've reached the Top 10 on the 'Cybersafe Inc' program leaderboard.</p></li>
                               </ul>
                           </DashboardCard>
                        </div>
                        <div>
                            <DashboardCard title="Skill Breakdown">
                                <Doughnut data={hackerSkillData} options={doughnutOptions} />
                            </DashboardCard>
                        </div>
                    </div>
                </div>
            )}
            
            {/* ORGANIZATION DASHBOARD */}
            {isOrganization && dashboardData && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <StatCard title="Active Programs" value={dashboardData.kpis.programCount} icon={<Briefcase size={24} />} colorClass="bg-sky-100 text-sky-600" />
                        <StatCard title="Total Reports" value={dashboardData.kpis.totalReports} icon={<BarChart3 size={24} />} colorClass="bg-slate-100 text-slate-600" />
                        <StatCard title="New Reports" value={dashboardData.kpis.newReports} icon={<FileText size={24} />} colorClass="bg-orange-100 text-orange-600" />
                        <StatCard title="Avg. Time to Bounty" value="14.2 Days" note="Dummy Data" icon={<Clock size={24} />} colorClass="bg-violet-100 text-violet-600" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                             <DashboardCard title="Recent Reports" viewAllLink="/manage-reports">
                                <div className="space-y-2">
                                    {dashboardData.recentReports.length > 0 ? (
                                        dashboardData.recentReports.map(report => (
                                            <Link to={`/reports/${report.id}`} key={report.id} className="block p-4 rounded-lg hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-semibold text-slate-700">{report.title}</h4>
                                                    <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(report.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1">For program: {report.program_name}</p>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="p-4 text-sm text-slate-500 text-center">No reports have been submitted yet.</p>
                                    )}
                                </div>
                            </DashboardCard>
                        </div>
                       <div className="lg:col-span-2 space-y-6">
                            <DashboardCard title="Severity Distribution">
                                <Bar options={barChartOptions} data={orgChartData} />
                            </DashboardCard>
                            <DashboardCard title="Top Reporters">
                                <ul className="space-y-3">
                                    {topReporters.map(reporter => (
                                        <li key={reporter.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={reporter.avatar} alt={reporter.name} className="w-8 h-8 rounded-full" />
                                                <span className="font-medium text-slate-700">{reporter.name}</span>
                                            </div>
                                            <span className="font-bold text-slate-500">{reporter.reports} reports</span>
                                        </li>
                                    ))}
                                </ul>
                            </DashboardCard>
                       </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;


