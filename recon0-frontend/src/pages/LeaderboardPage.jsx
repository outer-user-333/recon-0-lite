import React, { useState, useEffect } from 'react';

const LeaderboardPage = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await fetch('http://localhost:3001/api/v1/leaderboard');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (result.success) {
                    setLeaderboardData(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch leaderboard data.');
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const renderContent = () => {
        if (loading) return <p>Loading leaderboard...</p>;
        if (error) return <div className="alert alert-danger">Error: {error}</div>;

        return (
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col" style={{ width: '10%' }}>Rank</th>
                                    <th scope="col" style={{ width: '50%' }}>Hacker</th>
                                    <th scope="col" style={{ width: '20%' }}>Reports Resolved</th>
                                    <th scope="col" style={{ width: '20%' }}>Reputation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map((hacker) => (
                                    <tr key={hacker.rank}>
                                        <th scope="row" className="fs-5">{hacker.rank}</th>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar me-3">{hacker.hacker.username.charAt(0).toUpperCase()}</div>
                                                <span className="fw-bold">{hacker.hacker.username}</span>
                                            </div>
                                        </td>
                                        <td>{hacker.reports_resolved}</td>
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
        <div className="container mt-5">
            <h2 className="mb-4">Leaderboard</h2>
            <p className="text-muted mb-4">Top security researchers on the platform, ranked by reputation.</p>
            {renderContent()}
        </div>
    );
};

export default LeaderboardPage;