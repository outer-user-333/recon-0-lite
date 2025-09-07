import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getStats, getOrgDashboard } from '../lib/apiService';

// A small helper component for the dashboard Stat Cards
const StatCard = ({ title, value, colorClass = 'text-primary' }) => (
    <div className="col-md-3 mb-4">
        <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
                <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
                <p className={`card-text fs-2 fw-bold ${colorClass}`}>{value}</p>
            </div>
        </div>
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

                // Fetch the correct dashboard data based on the user's role
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

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    const isHacker = userProfile?.role === 'hacker';
    const isOrganization = userProfile?.role === 'organization';

    return (
        <div>
            <h2 className="mb-4">
                {isOrganization ? 'Organization Dashboard' : `Welcome back, ${userProfile?.username}!`}
            </h2>

            {/* === RENDER HACKER DASHBOARD === */}
            {isHacker && dashboardData && (
                <div className="row">
                    <StatCard title="Reputation" value={dashboardData.reputation_points?.toLocaleString()} colorClass="text-primary" />
                    <StatCard title="Reports Submitted" value={dashboardData.reports_submitted} colorClass="text-dark" />
                    <StatCard title="Reports Accepted" value={dashboardData.reports_accepted} colorClass="text-success" />
                    <StatCard title="Bounties Earned" value={`$${dashboardData.bounties_earned?.toLocaleString()}`} colorClass="text-warning" />
                </div>
            )}

            {/* === RENDER ORGANIZATION DASHBOARD === */}
            {isOrganization && dashboardData && (
                <>
                    <div className="row">
                        <StatCard title="Active Programs" value={dashboardData.kpis.programCount} colorClass="text-info" />
                        <StatCard title="Total Reports" value={dashboardData.kpis.totalReports} colorClass="text-dark" />
                        <StatCard title="New Reports" value={dashboardData.kpis.newReports} colorClass="text-warning" />
                    </div>
                    <h4 className="mt-4">Recent Reports</h4>
                    <div className="list-group shadow-sm">
                        {dashboardData.recentReports.length > 0 ? (
                            dashboardData.recentReports.map(report => (
                                <Link to={`/reports/${report.id}`} key={report.id} className="list-group-item list-group-item-action">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">{report.title}</h5>
                                        <small>{new Date(report.created_at).toLocaleDateString()}</small>
                                    </div>
                                    <p className="mb-1">To: {report.program_name}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="list-group-item">
                                <p className="mb-0 text-muted">No reports have been submitted to your programs yet.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage;