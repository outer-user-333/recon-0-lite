import React, { useState, useEffect } from 'react';
import { getAllAchievements, getMyAchievements } from '../lib/apiService.js';
import { Award, Check, FileText, Lock, ShieldAlert, Star, Trophy, Bug, BrainCircuit } from 'lucide-react';

// --- SVG Shape & Pattern Definitions for Badges ---
const badgeHexagon = (gradientId, patternId) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id={`pattern-lines-${patternId}`} width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="6" stroke="white" strokeWidth="1" opacity="0.2"/>
            </pattern>
            <pattern id={`pattern-dots-${patternId}`} width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" opacity="0.3"/>
            </pattern>
        </defs>
        <path 
            d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" 
            fill={`url(#${gradientId})`}
        />
         <path 
            d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" 
            fill={`url(#${patternId})`}
        />
        <path 
            d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" 
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
        />
    </svg>
);


// A dedicated, reusable component for rendering each achievement badge.
const AchievementBadge = ({ achievement, isEarned }) => {
    // Define styles for each tier, inspired by the reference images
    const tierStyles = {
        Bronze: {
            gradientFrom: '#D97706', // amber-600
            gradientTo: '#FBBF24',   // amber-400
            shadow: 'shadow-amber-400/50',
            pattern: 'pattern-lines'
        },
        Silver: {
            gradientFrom: '#475569', // slate-600
            gradientTo: '#94A3B8',   // slate-400
            shadow: 'shadow-slate-400/50',
            pattern: 'pattern-dots'
        },
        Gold: {
            gradientFrom: '#F59E0B', // amber-500
            gradientTo: '#FDE047',   // yellow-300
            shadow: 'shadow-yellow-400/50',
            pattern: 'pattern-lines'
        },
        Diamond: {
            gradientFrom: '#8B5CF6', // violet-500
            gradientTo: '#EC4899',   // pink-500
            shadow: 'shadow-violet-400/50',
            pattern: 'pattern-dots'
        },
    };

    const styles = tierStyles[achievement.tier] || tierStyles.Silver;
    const Icon = achievement.icon || Award;
    const gradientId = `gradient-${achievement.id}`;
    const patternId = `${styles.pattern}-${gradientId}`;

    return (
        <div 
            className={`
                bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center 
                transition-all duration-300 h-full group
                ${isEarned 
                    ? `shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${styles.shadow}` 
                    : 'opacity-60 filter grayscale'
                }
            `}
        >
            <div className={`relative w-28 h-28 mb-4`}>
                <div className="absolute inset-0">
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={styles.gradientFrom} />
                                <stop offset="100%" stopColor={styles.gradientTo} />
                            </linearGradient>
                        </defs>
                    </svg>
                    {badgeHexagon(gradientId, patternId)}
                </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="text-white drop-shadow-lg" size={52} strokeWidth={1.5} />
                </div>
                {!isEarned && (
                    <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-8 h-8 bg-slate-600 rounded-full border-2 border-white shadow-md">
                        <Lock className="text-white" size={16} />
                    </div>
                )}
                 {isEarned && (
                    <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-8 h-8 bg-emerald-500 rounded-full border-2 border-white shadow-md">
                        <Check className="text-white" size={16} />
                    </div>
                )}
            </div>
            
            <h3 className="text-lg font-bold text-slate-800">{achievement.name}</h3>
            <p className="text-sm text-slate-500 mt-1 flex-grow">{achievement.description}</p>
        </div>
    );
};


// --- CLIENT-SIDE VISUAL MAPPING ---
// This object maps API achievement IDs to the visual properties needed by the badge component.
const achievementVisuals = {
    'ach-1': { icon: FileText, tier: 'Bronze', shape: 'medal' },
    'ach-2': { icon: Bug, tier: 'Silver', shape: 'shield' },
    'ach-3': { icon: BrainCircuit, tier: 'Gold', shape: 'star' },
    'ach-4': { icon: Star, tier: 'Diamond', shape: 'diamond' },
};
const defaultVisuals = { icon: Award, tier: 'Silver', shape: 'shield' };


const AchievementsPage = () => {
    const [allAchievements, setAllAchievements] = useState([]);
    const [myAchievementIds, setMyAchievementIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allAchievementsResult, myAchievementsResult] = await Promise.all([
                    getAllAchievements(),
                    getMyAchievements()
                ]);

                if (allAchievementsResult.success) {
                    const enhancedAchievements = allAchievementsResult.data.map(ach => ({
                        ...ach,
                        ...(achievementVisuals[ach.id] || defaultVisuals)
                    }));
                    setAllAchievements(enhancedAchievements);
                } else {
                    throw new Error(allAchievementsResult.message);
                }

                if (myAchievementsResult.success) {
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
    
    const unlockedCount = myAchievementIds.size;
    const totalCount = allAchievements.length > 0 ? allAchievements.length : 1;
    const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

    const renderContent = () => {
        if (loading) return <div className="text-center text-slate-500 p-8">Loading achievements...</div>;
        if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allAchievements.map((ach) => (
                    <AchievementBadge 
                        key={ach.id} 
                        achievement={ach} 
                        isEarned={myAchievementIds.has(ach.id)} 
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Achievements</h1>
                <p className="mt-1 text-slate-500">Unlock badges by reaching milestones and contributing to the community.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-slate-700">Your Progress</h3>
                    <p className="font-bold text-slate-800">{unlockedCount} / {totalCount} Unlocked</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-violet-500 h-2.5 rounded-full" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

export default AchievementsPage;


