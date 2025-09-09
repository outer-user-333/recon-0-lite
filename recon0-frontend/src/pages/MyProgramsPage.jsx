import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyPrograms } from '/src/lib/apiService.js';
import { PlusCircle, Briefcase, BarChart2, Inbox, ArrowUpRight } from 'lucide-react';

// A single Program Card component for the organization view
const ProgramCard = ({ program }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
        <div className="p-6 flex-grow">
            <div className="flex items-start gap-4">
                <img 
                    src={program.org_logo_url || `https://placehold.co/48x48/E2E8F0/475569?text=${program.org_name.charAt(0)}`} 
                    alt={`${program.org_name} logo`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{program.title}</h3>
                    <p className="text-sm text-slate-500">
                        Bounty: ${program.min_bounty?.toLocaleString()} - ${program.max_bounty?.toLocaleString()}
                    </p>
                </div>
            </div>
            {/* Dummy Stats for Demonstration */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-slate-500">Reports</p>
                    <p className="font-bold text-slate-800 text-xl">128</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-slate-500">New</p>
                    <p className="font-bold text-orange-500 text-xl">15</p>
                </div>
            </div>
        </div>
        <div className="border-t border-slate-200 p-4 bg-slate-50/50 flex items-center justify-end gap-3 rounded-b-2xl">
             <Link to={`/programs/${program.id}/analytics`} className="font-semibold text-sm py-2 px-4 rounded-lg bg-white text-slate-700 hover:bg-slate-100 transition-colors shadow-sm border border-slate-200 flex items-center gap-2">
                <BarChart2 size={16} />
                Analytics
            </Link>
            <Link to="/manage-reports" className="font-semibold text-sm py-2 px-4 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2">
                <Inbox size={16} />
                Manage Reports
            </Link>
        </div>
    </div>
);

const MyProgramsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const result = await getMyPrograms();
                if (result.success) {
                    setPrograms(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch programs.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    if (loading) return <div className="text-center text-slate-500">Loading your programs...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-800">My Programs</h1>
                <Link to="/create-program" className="font-semibold py-2 px-4 rounded-lg text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <PlusCircle size={18} />
                    Create New Program
                </Link>
            </div>
            
            {programs.length === 0 ? (
                <div className="text-center py-16 px-6 bg-white rounded-2xl border border-slate-200">
                    <Briefcase size={48} className="mx-auto text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-800">No Programs Yet</h3>
                    <p className="mt-1 text-sm text-slate-500">You haven't created any bug bounty programs.</p>
                    <Link to="/create-program" className="mt-4 inline-block font-semibold py-2 px-4 rounded-lg text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity">
                        Create Your First Program
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {programs.map(program => (
                        <ProgramCard key={program.id} program={program} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProgramsPage;

