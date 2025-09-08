import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPrograms } from '/src/lib/apiService.js';
import { DollarSign, Search, Target, Briefcase } from 'lucide-react';

// A single Program Card component
const ProgramCard = ({ program }) => (
    <Link 
        to={`/programs/${program.id}`} 
        className="block bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
    >
        <div className="flex items-center gap-4 mb-4">
            <img 
                src={program.org_logo_url || `https://placehold.co/48x48/E2E8F0/475569?text=${program.org_name.charAt(0)}`} 
                alt={`${program.org_name} logo`}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
            />
            <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{program.title}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Briefcase size={14} />
                    {program.org_name}
                </p>
            </div>
        </div>

        {/* Dummy Tags for visual appeal */}
        <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">Web</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-100 text-violet-800">API</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-800">iOS</span>
        </div>
        
        <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-500">
                <Target size={16} className="text-emerald-500"/>
                <span className="font-medium">Targets: Web, API, iOS</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-emerald-600">
                <DollarSign size={16} />
                <span>{`$${program.min_bounty?.toLocaleString()} - $${program.max_bounty?.toLocaleString()}`}</span>
            </div>
        </div>
    </Link>
);


const ProgramsPage = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // Dummy state for search
    const [activeFilter, setActiveFilter] = useState('All'); // Dummy state for filters

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const result = await getPrograms();
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

    const FilterButton = ({ label }) => (
        <button 
            onClick={() => setActiveFilter(label)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeFilter === label 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
        >
            {label}
        </button>
    );

    if (loading) {
        return <div className="text-center text-slate-500">Loading programs...</div>;
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                 <h1 className="text-3xl font-bold text-slate-800">Bug Bounty Programs</h1>
                 <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search programs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                 </div>
            </div>

            {/* Dummy Filter Controls */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100 rounded-lg">
                <FilterButton label="All" />
                <FilterButton label="Web" />
                <FilterButton label="API" />
                <FilterButton label="Mobile" />
                <FilterButton label="Hardware" />
            </div>

            {/* Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {programs.map(program => (
                    <ProgramCard key={program.id} program={program} />
                ))}
            </div>
             {programs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                    <p className="text-slate-500">No active programs found.</p>
                </div>
            )}
        </div>
    );
};

export default ProgramsPage;

