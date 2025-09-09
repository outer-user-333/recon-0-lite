import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getProfile, logout, getToken } from '../lib/apiService.js';
import { loginChatUser } from '../lib/chatAuthService.js';
import ChatbotWidget from '../components/ChatbotWidget.jsx';
import { 
    LayoutDashboard, Target, FileText, BookOpen, Trophy, MessageSquare, 
    PlusCircle, Briefcase, BarChart2, LogOut, Bell, ShieldCheck, Search, Bot
} from 'lucide-react';

// Reusable NavLink component for the sidebar
const NavLink = ({ to, icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));

    return (
        <Link 
            to={to} 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
            {icon}
            <span>{children}</span>
        </Link>
    );
};

// Sidebar Component
const Sidebar = ({ userProfile, onLogout, onToggleChat }) => {
    if (!userProfile) return null;

    const isHacker = userProfile.role === "hacker";
    const isOrganization = userProfile.role === "organization";

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col p-4">
            <div className="text-2xl font-bold text-slate-800 tracking-wider mb-8 px-4 py-2">
                RECON<span className="text-blue-500">_0</span>
            </div>
            
            <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">Menu</p>
                <NavLink to="/dashboard" icon={<LayoutDashboard size={20} />}>Dashboard</NavLink>
                
                {isHacker && (
                    <>
                        <NavLink to="/programs" icon={<Target size={20} />}>Programs</NavLink>
                        <NavLink to="/my-reports" icon={<FileText size={20} />}>My Reports</NavLink>
                        <NavLink to="/academy" icon={<BookOpen size={20} />}>Academy</NavLink>
                        <NavLink to="/achievements" icon={<ShieldCheck size={20} />}>Achievements</NavLink>
                    </>
                )}

                {isOrganization && (
                     <>
                        <NavLink to="/my-programs" icon={<Briefcase size={20} />}>My Programs</NavLink>
                        <NavLink to="/manage-reports" icon={<FileText size={20} />}>Triage Reports</NavLink>
                        <NavLink to="/create-program" icon={<PlusCircle size={20} />}>New Program</NavLink>
                    </>
                )}
                
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mt-6 mb-2">Community</p>
                <NavLink to="/leaderboard" icon={<Trophy size={20} />}>Leaderboard</NavLink>
                <NavLink to="/chat" icon={<MessageSquare size={20} />}>Safe Harbor</NavLink>
            </nav>

            <div className="mt-auto border-t border-slate-200 pt-4">
                 {/* BUG FIX: Added the AI Assistant button here */}
                 <button 
                    onClick={onToggleChat} 
                    className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 transition-opacity text-sm font-medium mb-2 shadow-md"
                >
                    <Bot size={20} />
                    <span>AI Assistant</span>
                </button>
                 <Link to="/profile" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 mb-2">
                     <img 
                        src={userProfile.avatar_url || `https://placehold.co/40x40/E2E8F0/475569?text=${userProfile.username.charAt(0).toUpperCase()}`}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full border-2 border-slate-300"
                    />
                    <span className="font-semibold text-sm">{userProfile.username}</span>
                </Link>
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium">
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

// Header for the main content area
const Header = ({ userProfile }) => {
    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 p-4 border-b border-slate-200 flex justify-end items-center gap-4">
             <div className="relative flex-1 max-w-xs">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 border border-transparent focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm"
                />
             </div>
             <Link to="/notifications" className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                <Bell size={20} />
            </Link>
            <Link to="/profile">
                <img 
                    src={userProfile?.avatar_url || `https://placehold.co/40x40/E2E8F0/475569?text=${userProfile?.username.charAt(0).toUpperCase()}`}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-slate-300 hover:border-blue-500 transition-colors"
                />
            </Link>
        </header>
    )
}

// The main layout component
const DashboardLayout = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false); // BUG FIX: State is lifted here

    const toggleChat = () => setIsChatOpen(!isChatOpen); // BUG FIX: Toggle function is lifted here

    useEffect(() => {
        const checkAuthAndFetchProfile = async () => {
            loginChatUser();
            const token = getToken();
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const result = await getProfile();
                if (result.success) {
                    setUserProfile(result.data);
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                logout();
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-200 flex items-center justify-center">
                <p className="text-slate-500">Loading user profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-200">
            <Sidebar userProfile={userProfile} onLogout={handleLogout} onToggleChat={toggleChat} />
            <div className="ml-64">
                <Header userProfile={userProfile} />
                <main className="p-8">
                    <Outlet context={{ userProfile }} /> 
                </main>
            </div>
            {/* BUG FIX: Pass state and toggle function as props */}
            <ChatbotWidget isOpen={isChatOpen} onClose={toggleChat} />
        </div>
    );
};

export default DashboardLayout;

