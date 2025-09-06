import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../lib/apiService';

const LeaderboardPage = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const result = await getLeaderboard();
                if (result.success) {
                    setLeaderboardData(result.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const renderContent = () => {
        if (loading) return <p>Loading leaderboard...</p>;
        if (error) return <div className="alert alert-danger">{error}</div>;

        return (
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col" style={{ width: '10%' }}>Rank</th>
                                    <th scope="col" style={{ width: '60%' }}>Hacker</th>
                                    <th scope="col" style={{ width: '30%' }}>Reputation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map((hacker) => (
                                    <tr key={hacker.rank}>
                                        <th scope="row" className="fs-5">{hacker.rank}</th>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar me-3">{hacker.username.charAt(0).toUpperCase()}</div>
                                                <span className="fw-bold">{hacker.username}</span>
                                            </div>
                                        </td>
                                        <td className="fw-bold text-primary">{hacker.reputation_points.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2 className="mb-4">Leaderboard</h2>
            <p className="text-muted mb-4">Top security researchers on the platform, ranked by reputation.</p>
            {renderContent()}
        </div>
    );
};

export default LeaderboardPage;