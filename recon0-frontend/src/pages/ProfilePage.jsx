import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
// --- FIX: Import the correct function names ---
import { calculateLevel, calculateProgress } from '../lib/gamificationUtils';

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Form state
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("User not found.");

                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (profile) {
                    setUserProfile(profile);
                    setFullName(profile.full_name || '');
                    setUsername(profile.username || '');
                    setBio(profile.bio || '');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Real-time subscription to profile changes
    useEffect(() => {
        if (!userProfile) return;

        const channel = supabase
            .channel(`public:profiles:id=eq.${userProfile.id}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userProfile.id}` },
                (payload) => {
                    console.log('Profile update received!', payload.new);
                    setUserProfile(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userProfile]);


    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    username: username,
                    bio: bio,
                    // --- FIX from previous bug: Ensure role is included ---
                    role: userProfile.role 
                })
                .eq('id', userProfile.id);

            if (error) throw error;
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading profile...</div>;
    if (error && !userProfile) return <div className="alert alert-danger">Error: {error}</div>;

    const isHacker = userProfile?.role === 'hacker';
    
    // --- FIX: Use the correct function names here ---
    const levelData = isHacker ? calculateLevel(userProfile.reputation_points) : null;
    const progressPercentage = isHacker ? calculateProgress(userProfile.reputation_points, levelData.currentLevel, levelData.nextLevel) : 0;
    // -------------------------------------------------

    return (
        <div className="container mt-5">
            <h2 className="mb-4">My Profile</h2>
            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {message && <div className="alert alert-success">{message}</div>}
                            <form onSubmit={handleProfileUpdate}>
                                <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-control" value={userProfile?.email || ''} disabled />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Bio</label>
                                    <textarea className="form-control" rows="3" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                {isHacker && levelData && (
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Your Progress</h5>
                                <p className="text-muted">Reputation: <span className="fw-bold text-primary">{userProfile.reputation_points}</span></p>
                                <hr />
                                <p><strong>Level: {levelData.currentLevel.name}</strong></p>
                                <div className="progress" style={{ height: '20px' }}>
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${progressPercentage}%` }}
                                        aria-valuenow={progressPercentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {progressPercentage}%
                                    </div>
                                </div>
                                {levelData.nextLevel ? (
                                    <p className="mt-2 text-muted small">
                                        {levelData.nextLevel.minPoints - userProfile.reputation_points} points to {levelData.nextLevel.name}
                                    </p>
                                ) : (
                                    <p className="mt-2 text-muted small">Max level reached!</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;

