import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseChatClient';

const AchievementsPage = () => {
    const [allAchievements, setAllAchievements] = useState([]);
    const [myAchievements, setMyAchievements] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First, get the current user's username from their profile
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("You must be logged in to view achievements.");

                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;
                setUsername(profile.username);

                // Then, fetch all possible achievements and the user's earned achievements
                // We use Promise.all to run these fetches in parallel for speed
                const [allAchievementsResponse, myAchievementsResponse] = await Promise.all([
                    fetch('http://localhost:3001/api/v1/achievements'),
                    fetch(`http://localhost:3001/api/v1/users/${profile.username}/achievements`)
                ]);

                if (!allAchievementsResponse.ok) throw new Error('Failed to fetch all achievements.');
                if (!myAchievementsResponse.ok) throw new Error('Failed to fetch your achievements.');

                const allAchievementsResult = await allAchievementsResponse.json();
                const myAchievementsResult = await myAchievementsResponse.json();

                if (allAchievementsResult.success) {
                    setAllAchievements(allAchievementsResult.data);
                }
                if (myAchievementsResult.success) {
                    // Store earned achievement IDs in a Set for fast lookups (O(1) complexity)
                    setMyAchievements(new Set(myAchievementsResult.data.map(ach => ach.id)));
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
                    const isEarned = myAchievements.has(ach.id);
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
        <div className="container mt-5 achievements-page">
            <style>{`
                .achievements-page .locked {
                    opacity: 0.5;
                    filter: grayscale(80%);
                }
                .achievement-icon {
                    font-size: 3rem;
                    color: #6c757d;
                }
                .achievement-icon.unlocked {
                    color: var(--bs-primary);
                }
            `}</style>
            <h2 className="mb-4">Achievements</h2>
            <p className="text-muted mb-4">Unlock badges by reaching milestones and contributing to the community.</p>
            {renderContent()}
        </div>
    );
};

export default AchievementsPage;
