import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProgramById } from '../lib/apiService.js';
import { Briefcase, DollarSign, Target, FileText, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

// Reusable component for displaying stats in the sidebar
const StatItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="p-2 bg-slate-100 rounded-md">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="font-semibold text-slate-800">{value}</p>
        </div>
    </div>
);

// Reusable component for scope items
const ScopeItem = ({ text, inScope = true }) => (
    <li className="flex items-start gap-3 py-2">
        {inScope 
            ? <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            : <XCircle size={20} className="text-rose-500 flex-shrink-0 mt-0.5" />
        }
        <span className="text-slate-600 font-mono text-sm">{text}</span>
    </li>
);

const ProgramDetailPage = () => {
    const { programId } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProgram = async () => {
            if (!programId) return;
            try {
                const result = await getProgramById(programId);
                if (result.success) {
                    setProgram(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch program details.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProgram();
    }, [programId]);

    if (loading) return <div className="text-center text-slate-500">Loading program details...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;
    if (!program) return <div className="text-center text-slate-500">Program not found.</div>;

    // Dummy Data for Rewards Table
    const rewards = [
        { severity: 'Critical', bounty: program.max_bounty },
        { severity: 'High', bounty: program.max_bounty * 0.6 },
        { severity: 'Medium', bounty: program.max_bounty * 0.2 },
        { severity: 'Low', bounty: program.min_bounty },
    ];

    return (
        <div className="space-y-6">
            <Link to="/programs" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
                <ArrowLeft size={16} />
                Back to all programs
            </Link>

            {/* Page Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <img 
                        src={program.org_logo_url || `https://placehold.co/64x64/E2E8F0/475569?text=${program.org_name.charAt(0)}`} 
                        alt={`${program.org_name} logo`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{program.title}</h1>
                        <p className="text-slate-500 flex items-center gap-1.5">
                            <Briefcase size={14} />
                            Hosted by {program.org_name}
                        </p>
                    </div>
                </div>
                <Link 
                    to={`/programs/${programId}/submit`} 
                    className="font-semibold py-3 px-6 rounded-lg text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity text-center"
                >
                    Submit Report
                </Link>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Policy & Scope */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Policy</h3>
                        {/* Dummy Policy Content */}
                        <div className="prose prose-sm max-w-none text-slate-600">
                            <p>We are excited to work with the security community. To be eligible for a reward, please adhere to the following rules:</p>
                            <ul>
                                <li>Please provide detailed reports with reproducible steps.</li>
                                <li>Do not engage in any activity that could disrupt our services (e.g., DoS/DDoS).</li>
                                <li>Do not attempt social engineering or phishing attacks against our employees.</li>
                                <li>Respect user privacy. Do not access or modify user data without permission.</li>
                                <li>Report vulnerabilities exclusively through this platform.</li>
                            </ul>
                            <p>Reports that do not follow these guidelines may be closed as invalid.</p>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Scope</h3>
                         {/* Dummy Scope Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                                <h4 className="font-semibold text-emerald-600 mb-2">In Scope Assets</h4>
                                <ul className="divide-y divide-slate-100">
                                    <ScopeItem text="*.recon0-demo.com" />
                                    <ScopeItem text="api.recon0-demo.com" />
                                    <ScopeItem text="Recon0 Mobile App for iOS (v2.1+)" />
                                </ul>
                           </div>
                           <div>
                                <h4 className="font-semibold text-rose-600 mb-2">Out of Scope Assets</h4>
                                <ul className="divide-y divide-slate-100">
                                    <ScopeItem text="staging.recon0-demo.com" inScope={false}/>
                                    <ScopeItem text="Any third-party services" inScope={false}/>
                                    <ScopeItem text="Social media profiles" inScope={false}/>
                                </ul>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats & Bounties */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                         <div className="space-y-4">
                             <StatItem icon={<DollarSign size={20} className="text-emerald-600"/>} label="Bounty Range" value={`$${program.min_bounty?.toLocaleString()} - $${program.max_bounty?.toLocaleString()}`} />
                             <StatItem icon={<Target size={20} className="text-blue-600"/>} label="Asset Types" value="Web, API, iOS" />
                             <StatItem icon={<FileText size={20} className="text-violet-600"/>} label="Avg. Response" value="48 Hours" />
                         </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Rewards by Severity</h3>
                        <table className="w-full text-sm">
                            <tbody>
                                {rewards.map(r => (
                                <tr key={r.severity} className="border-b border-slate-100 last:border-none">
                                    <td className="py-2 font-medium text-slate-600">{r.severity}</td>
                                    <td className="py-2 text-right font-semibold text-emerald-600">{`Up to $${r.bounty.toLocaleString()}`}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetailPage;

