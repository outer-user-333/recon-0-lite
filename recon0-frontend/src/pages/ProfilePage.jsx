import React, { useState, useEffect } from "react";
import { getProfile, updateProfile, uploadAvatar, uploadOrgLogo } from '../lib/apiService.js';
import { calculateLevel, calculateProgress } from "../lib/gamificationUtils.js";
import { Camera, Star, TrendingUp, LoaderCircle, CheckCircle, AlertCircle, Eye, Target, Crosshair, Award, Crown, Zap, Flame, Trophy } from 'lucide-react';

// Hardcoded rank system configuration with colors and icons
const RANK_SYSTEM = [
    { id: 1, name: "Scout", minPoints: 0, maxPoints: 49, icon: Eye, bgColor: "bg-slate-500", lightBg: "bg-slate-100", textColor: "text-slate-600", description: "New to the hunt" },
    { id: 2, name: "Hunter", minPoints: 50, maxPoints: 99, icon: Target, bgColor: "bg-emerald-500", lightBg: "bg-emerald-100", textColor: "text-emerald-600", description: "Finding your stride" },
    { id: 3, name: "Tracker", minPoints: 100, maxPoints: 249, icon: Crosshair, bgColor: "bg-blue-500", lightBg: "bg-blue-100", textColor: "text-blue-600", description: "On the right trail" },
    { id: 4, name: "Specialist", minPoints: 250, maxPoints: 499, icon: Award, bgColor: "bg-violet-500", lightBg: "bg-violet-100", textColor: "text-violet-600", description: "Focused expertise" },
    { id: 5, name: "Expert", minPoints: 500, maxPoints: 999, icon: Star, bgColor: "bg-amber-500", lightBg: "bg-amber-100", textColor: "text-amber-600", description: "Proven skills" },
    { id: 6, name: "Master", minPoints: 1000, maxPoints: 2499, icon: Crown, bgColor: "bg-orange-500", lightBg: "bg-orange-100", textColor: "text-orange-600", description: "Elite level hunter" },
    { id: 7, name: "Grandmaster", minPoints: 2500, maxPoints: 4999, icon: Zap, bgColor: "bg-rose-500", lightBg: "bg-rose-100", textColor: "text-rose-600", description: "Legendary status" },
    { id: 8, name: "Legend", minPoints: 5000, maxPoints: null, icon: Trophy, bgColor: "bg-gradient-to-r from-yellow-400 to-orange-500", lightBg: "bg-gradient-to-r from-yellow-100 to-orange-100", textColor: "text-orange-700", description: "The ultimate hunter" }
];

// Enhanced Rank System Display Component
const RankSystemDisplay = ({ currentReputation }) => {
    const getCurrentRank = (reputation) => {
        return RANK_SYSTEM.find(rank => 
            reputation >= rank.minPoints && (rank.maxPoints === null || reputation <= rank.maxPoints)
        ) || RANK_SYSTEM[0];
    };

    const currentRank = getCurrentRank(currentReputation);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Reputation System</h3>
            
            <div className="space-y-3">
                {RANK_SYSTEM.map((rank) => {
                    const IconComponent = rank.icon;
                    const isCurrentRank = rank.id === currentRank.id;
                    const isAchieved = currentReputation >= rank.minPoints;
                    
                    return (
                        <div 
                            key={rank.id} 
                            className={`relative flex items-center p-4 rounded-xl transition-all ${
                                isCurrentRank 
                                    ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 border-2 border-blue-200' 
                                    : isAchieved 
                                        ? 'bg-slate-50 border border-slate-200'
                                        : 'bg-white border border-slate-200 opacity-60'
                            }`}
                        >
                            {/* Rank Icon */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                                rank.id === 8 ? rank.bgColor : `${rank.bgColor}`
                            }`}>
                                <IconComponent size={20} className="text-white" />
                            </div>

                            {/* Rank Details */}
                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className={`font-bold text-sm ${
                                            isCurrentRank ? 'text-blue-700' : isAchieved ? 'text-slate-800' : 'text-slate-500'
                                        }`}>
                                            Level {rank.id}: {rank.name}
                                            {isCurrentRank && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">CURRENT</span>}
                                        </h4>
                                        <p className="text-xs text-slate-500">{rank.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xs font-medium ${rank.textColor}`}>
                                            {rank.minPoints}{rank.maxPoints ? `-${rank.maxPoints}` : '+'} RP
                                        </p>
                                    </div>
                                </div>

                                {/* Progress bar for current rank */}
                                {isCurrentRank && rank.maxPoints && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>{currentReputation} RP</span>
                                            <span>{rank.maxPoints + 1} RP to next</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-500"
                                                style={{ 
                                                    width: `${Math.min(100, ((currentReputation - rank.minPoints) / (rank.maxPoints - rank.minPoints + 1)) * 100)}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Points Guide */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <h4 className="font-semibold text-slate-800 text-sm mb-3">Point System</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-slate-600">Valid submission:</span>
                        <span className="font-medium text-emerald-600">+10 RP</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Critical accepted:</span>
                        <span className="font-medium text-emerald-600">+50 RP</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">High accepted:</span>
                        <span className="font-medium text-emerald-600">+30 RP</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Medium accepted:</span>
                        <span className="font-medium text-emerald-600">+15 RP</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Low accepted:</span>
                        <span className="font-medium text-emerald-600">+5 RP</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">First to find:</span>
                        <span className="font-medium text-emerald-600">+25 RP</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Quality bonus:</span>
                        <span className="font-medium text-emerald-600">+10 RP</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Invalid report:</span>
                        <span className="font-medium text-rose-600">-5 RP</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced Progress Card for current user stats
const HackerProgressCard = ({ reputation_points }) => {
    const levelData = calculateLevel(reputation_points);
    const progressPercentage = calculateProgress(
        reputation_points,
        levelData.currentLevel,
        levelData.nextLevel
    );

    const currentRank = RANK_SYSTEM.find(rank => 
        reputation_points >= rank.minPoints && (rank.maxPoints === null || reputation_points <= rank.maxPoints)
    ) || RANK_SYSTEM[0];

    const IconComponent = currentRank.icon;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Your Progress</h3>
            
            {/* Current Status */}
            <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    currentRank.id === 8 ? currentRank.bgColor : currentRank.bgColor
                }`}>
                    <IconComponent size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-800">{currentRank.name}</h4>
                <p className="text-sm text-slate-500">{currentRank.description}</p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <p className="text-sm font-medium text-slate-500">Reputation</p>
                    <p className="flex items-center gap-1.5 font-bold text-violet-600">
                        <Star size={16} />
                        <span>{reputation_points.toLocaleString()}</span>
                    </p>
                </div>
                
                <hr className="border-slate-200"/>
                
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <p className="font-semibold text-slate-800">Level {currentRank.id}: {currentRank.name}</p>
                        {levelData.nextLevel && (
                             <p className="text-xs font-medium text-slate-400">Next: {levelData.nextLevel.name}</p>
                        )}
                    </div>
                     <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-violet-500 h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                     {levelData.nextLevel ? (
                        <p className="mt-2 text-xs text-slate-500 text-right">
                           {levelData.nextLevel.minPoints - reputation_points} RP to next level
                        </p>
                    ) : (
                         <p className="mt-2 text-xs text-slate-500 text-right">Max level reached!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);

    // Form state - logic remains unchanged
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const result = await getProfile();
                if (result.success) {
                    setUserProfile(result.data);
                    setFullName(result.data.full_name || '');
                    setUsername(result.data.username || '');
                    setBio(result.data.bio || '');
                } else {
                     throw new Error(result.message || "Failed to fetch profile.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleImageUpload = async (event) => {
        try {
            setUploading(true);
            setError('');
            setMessage('');
            const file = event.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            const uploadFunction = userProfile.role === 'organization' ? uploadOrgLogo : uploadAvatar;
            const uploadResult = await uploadFunction(formData);

            if (!uploadResult.success) throw new Error(uploadResult.message);
            
            setUserProfile(prevProfile => ({ ...prevProfile, avatar_url: uploadResult.secure_url }));
            
            const messageText = userProfile.role === 'organization' ? 'Logo updated successfully!' : 'Avatar updated successfully!';
            setMessage(messageText);
        } catch (error) {
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };
    
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const profileData = { fullName, username, bio };
            const result = await updateProfile(profileData);
            if (result.success) {
                setUserProfile(result.data);
                setMessage('Profile updated successfully!');
            } else {
                 throw new Error(result.message || "Failed to update profile.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !userProfile) return <div className="text-center p-8 text-slate-500">Loading profile...</div>;
    if (error && !userProfile) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;

    const isHacker = userProfile?.role === "hacker";

    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>

             <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                 {/* Main Profile Form */}
                 <div className="xl:col-span-3">
                    <form onSubmit={handleProfileUpdate} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                        
                        {/* Avatar/Logo Upload Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                             <div className="relative group flex-shrink-0">
                                <img 
                                    src={userProfile?.avatar_url || `https://placehold.co/128x128/E2E8F0/475569?text=${userProfile?.username.charAt(0).toUpperCase()}`} 
                                    alt={isHacker ? 'Profile Avatar' : 'Organization Logo'}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-200"
                                />
                                <label htmlFor="image-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    {uploading ? <LoaderCircle className="text-white animate-spin" /> : <Camera className="text-white" />}
                                </label>
                                 <input
                                    type="file" id="image-upload" accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="sr-only"
                                />
                             </div>
                            <div className="text-center sm:text-left">
                                 <h2 className="text-2xl font-bold text-slate-800">{userProfile?.username}</h2>
                                 <p className="text-slate-500">{isHacker ? 'Hacker Profile' : 'Organization Profile'}</p>
                                 <p className="text-xs text-slate-400 mt-2">Max 2MB. JPG, PNG, GIF supported.</p>
                            </div>
                        </div>

                        {error && <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded-lg text-sm"><AlertCircle size={16}/> {error}</div>}
                        {message && <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 p-3 rounded-lg text-sm"><CheckCircle size={16}/> {message}</div>}

                        <hr className="border-slate-200"/>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input id="email" type="email" value={userProfile?.email || ""} disabled className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed"/>
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                             <div className="md:col-span-2">
                                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                <textarea id="bio" rows="4" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={loading} className="font-semibold py-2 px-5 rounded-lg text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                                {loading ? <LoaderCircle size={18} className="animate-spin" /> : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                 </div>

                 {/* Sidebar for Hackers */}
                 {isHacker && userProfile && (
                     <div className="xl:col-span-2 space-y-6">
                        <HackerProgressCard reputation_points={userProfile.reputation_points} />
                        <RankSystemDisplay currentReputation={userProfile.reputation_points} />
                     </div>
                 )}
             </div>
        </div>
    );
};

export default ProfilePage;