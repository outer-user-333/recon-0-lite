import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '/src/lib/apiService.js';
import { Crown, Star, Medal, Trophy } from 'lucide-react';

// A dedicated component for the top 3 podium spots
const Podium = ({ topThree }) => {
    if (!topThree || topThree.length === 0) return null;

    const rankerStyles = [
        { // Rank 2 (Silver)
            order: 'md:order-1',
            height: 'h-48',
            color: 'bg-slate-400',
            icon: <Medal size={24} className="text-slate-700" />,
            textColor: 'text-slate-700'
        },
        { // Rank 1 (Gold)
            order: 'md:order-2',
            height: 'h-64',
            color: 'bg-amber-400',
            icon: <Crown size={28} className="text-amber-700" />,
            textColor: 'text-amber-700'
        },
        { // Rank 3 (Bronze)
            order: 'md:order-3',
            height: 'h-40',
            color: 'bg-amber-600',
            icon: <Medal size={20} className="text-amber-800" />,
            textColor: 'text-amber-800'
        },
    ];

    // Map the top three hackers to their styles
    const podiumHackers = [
        topThree.find(h => h.rank === 2),
        topThree.find(h => h.rank === 1),
        topThree.find(h => h.rank === 3)
    ].filter(Boolean); // Filter out undefined if less than 3 hackers exist

    const podiumMap = { 1: 1, 2: 0, 3: 2 };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4 px-4 pt-8 pb-4">
            {podiumHackers.map(hacker => {
                const style = rankerStyles[podiumMap[hacker.rank]];
                return (
                    <div key={hacker.rank} className={`flex flex-col items-center justify-end ${style.order}`}>
                        <div className="flex flex-col items-center mb-2">
                             <img 
                                src={`https://placehold.co/80x80/${style.color.replace('bg-','')}/FFFFFF?text=${hacker.username.charAt(0).toUpperCase()}`}
                                alt={hacker.username}
                                className={`w-20 h-20 rounded-full border-4 ${hacker.rank === 1 ? 'border-amber-400' : 'border-slate-300'}`}
                            />
                            <h3 className="mt-2 text-lg font-bold text-slate-800">{hacker.username}</h3>
                            <p className={`text-sm font-semibold ${style.textColor}`}>{hacker.reputation_points.toLocaleString()} RP</p>
                        </div>
                        <div className={`w-full ${style.height} ${style.color} rounded-t-lg flex items-center justify-center p-4 shadow-inner`}>
                           <div className="text-center">
                                {style.icon}
                                <p className={`text-5xl font-extrabold text-white/80 drop-shadow-md`}>{hacker.rank}</p>
                           </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};


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
                } else {
                    throw new Error(result.message || "Failed to load leaderboard.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const topThree = leaderboardData.filter(h => h.rank <= 3);
    const restOfLeaderboard = leaderboardData.filter(h => h.rank > 3);

    const renderContent = () => {
        if (loading) return <div className="text-center text-slate-500 p-8">Loading leaderboard...</div>;
        if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <Podium topThree={topThree} />
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider w-16">Rank</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hacker</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Reputation</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {restOfLeaderboard.map((hacker) => (
                                <tr key={hacker.rank} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="text-lg font-bold text-slate-600">{hacker.rank}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={`https://placehold.co/40x40/E2E8F0/475569?text=${hacker.username.charAt(0).toUpperCase()}`}
                                                alt={hacker.username}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <span className="font-semibold text-slate-800">{hacker.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                         <div className="flex items-center justify-end gap-1.5 font-bold text-violet-600">
                                            <Star size={16} />
                                            <span>{hacker.reputation_points.toLocaleString()}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {leaderboardData.length === 0 && (
                    <div className="text-center py-12 px-6">
                        <Trophy size={48} className="mx-auto text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-800">Leaderboard is Empty</h3>
                        <p className="mt-1 text-sm text-slate-500">No rankings available yet. Be the first to make your mark!</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Leaderboard</h1>
                <p className="mt-1 text-slate-500">Top security researchers on the platform, ranked by reputation.</p>
            </div>
            {renderContent()}
        </div>
    );
};

export default LeaderboardPage;

