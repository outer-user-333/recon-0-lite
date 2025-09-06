import React, { useState, useEffect } from 'react';
import { getAllAchievements, getMyAchievements } from '../lib/apiService';

const AchievementsPage = () => {
    const [allAchievements, setAllAchievements] = useState([]);
    const [myAchievementIds, setMyAchievementIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all possible achievements and the user's earned achievements in parallel
                const [allAchievementsResult, myAchievementsResult] = await Promise.all([
                    getAllAchievements(),
                    getMyAchievements()
                ]);

                if (allAchievementsResult.success) {
                    setAllAchievements(allAchievementsResult.data);
                } else {
                    throw new Error(allAchievementsResult.message);
                }

                if (myAchievementsResult.success) {
                    // Store earned achievement IDs in a Set for fast lookups
                    setMyAchievementIds(new Set(myAchievementsResult.data));
                } else {
                    throw new Error(myAchievementsResult.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderContent = () => {
        if (loading) return <p>Loading achievements...</p>;
        if (error) return <div className="alert alert-danger">{error}</div>;

        return (
            <div className="row g-4">
                {allAchievements.map((ach) => {
                    const isEarned = myAchievementIds.has(ach.id);
                    return (
                        <div className="col-md-6 col-lg-4" key={ach.id}>
                            <div className={`card h-100 shadow-sm ${!isEarned ? 'locked' : ''}`}>
                                <div className="card-body text-center">
                                    <div className={`achievement-icon mb-3 ${isEarned ? 'unlocked' : ''}`}>
                                        <i className={`fas ${ach.icon}`}></i>
                                    </div>
                                    <h5 className="card-title">{ach.name}</h5>
                                    <p className="card-text text-muted">{ach.description}</p>
                                    {isEarned && (
                                        <span className="badge bg-success"><i className="fas fa-check-circle me-1"></i> Unlocked</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="achievements-page">
            <style>{`
                .achievements-page .locked { opacity: 0.5; filter: grayscale(80%); }
                .achievement-icon { font-size: 3rem; color: #6c757d; }
                .achievement-icon.unlocked { color: var(--bs-primary); }
            `}</style>
            <h2 className="mb-4">Achievements</h2>
            <p className="text-muted mb-4">Unlock badges by reaching milestones and contributing to the community.</p>
            {renderContent()}
        </div>
    );
};

export default AchievementsPage;