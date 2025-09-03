import React, { useState, useEffect } from 'react';
import {supabase} from '../lib/supabaseClient';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("You must be logged in to view your profile.");

                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                
                setProfile(data);
                setFullName(data.full_name || '');
                setUsername(data.username || '');
                setBio(data.bio || '');

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Authentication error.");

            const updates = {
                id: user.id,
                full_name: fullName,
                username: username,
                bio: bio,
                role: profile.role, // <-- THIS IS THE FIX: Include the existing role
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;

            setSuccessMessage('Profile updated successfully!');
            const { data: updatedProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            setProfile(updatedProfile);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) return <div>Loading profile...</div>;
    if (error && !profile) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">My Profile</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    {error && <div className="alert alert-danger">Error: {error}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    
                    <form onSubmit={handleProfileUpdate}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input type="email" id="email" className="form-control" value={profile?.email || ''} disabled readOnly />
                            <small className="form-text text-muted">Your email address cannot be changed.</small>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <input 
                                type="text" 
                                id="fullName" 
                                className="form-control" 
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                className="form-control" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bio" className="form-label">Bio</label>
                            <textarea 
                                id="bio" 
                                className="form-control" 
                                rows="4"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

