import React, { useState, useEffect } from 'react';
import { getProfile, getStats } from '../lib/apiService';

const DashboardPage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both profile (for name/role) and stats in parallel
                const [profileResult, statsResult] = await Promise.all([
                    getProfile(),
                    getStats()
                ]);

                if (profileResult.success) {
                    setUserProfile(profileResult.data);
                } else {
                    throw new Error(profileResult.message);
                }

                if (statsResult.success) {
                    setStats(statsResult.data);
                } else {
                    throw new Error(statsResult.message);
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

    return (
        <div>
            <h2 className="mb-4">
                {isHacker ? `Welcome back, ${userProfile.username}!` : 'Organization Dashboard'}
            </h2>

            {isHacker && stats && (
                <div className="row">
                    <div className="col-md-3 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Reputation</h6>
                                <p className="card-text fs-2 fw-bold text-primary">{stats.reputation_points?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Reports Submitted</h6>
                                <p className="card-text fs-2 fw-bold">{stats.reports_submitted}</p>
                            </div>
                        </div>
                    </div>
                     <div className="col-md-3 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Reports Accepted</h6>
                                <p className="card-text fs-2 fw-bold text-success">{stats.reports_accepted}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <h6 className="card-subtitle mb-2 text-muted">Bounties Earned</h6>
                                <p className="card-text fs-2 fw-bold text-warning">${stats.bounties_earned?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isHacker && <div className="alert alert-info">Organization-specific dashboard metrics will be shown here.</div>}
        </div>
    );
};

export default DashboardPage;