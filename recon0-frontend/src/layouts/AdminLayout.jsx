import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getProfile, logout, getToken } from '/src/lib/apiService.js';
import { Users, BarChart3, LogOut, Shield } from 'lucide-react';

// Reusable NavLink component, styled for the admin panel
const AdminNavLink = ({ to, icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to || location.pathname.startsWith(to);

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

// Redesigned Sidebar component
const AdminSidebar = ({ adminProfile, onLogout }) => {
     if (!adminProfile) return null;

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col p-4">
            <div className="text-2xl font-bold text-slate-800 tracking-wider mb-8 px-4 py-2 flex items-center gap-2">
                <Shield size={28} className="text-violet-500"/>
                <span>ADMIN</span>
            </div>
            
            <nav className="flex-1 flex flex-col gap-2">
                <AdminNavLink to="/admin/users" icon={<Users size={20} />}>User Management</AdminNavLink>
                <AdminNavLink to="/admin/analytics" icon={<BarChart3 size={20} />}>Platform Analytics</AdminNavLink>
            </nav>

            <div className="mt-auto border-t border-slate-200 pt-4">
                 <Link to="/admin/profile" className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 mb-2">
                     <img 
                        src={adminProfile.avatar_url || `https://placehold.co/40x40/E2E8F0/475569?text=A`}
                        alt="Admin Avatar"
                        className="w-8 h-8 rounded-full border-2 border-slate-300"
                    />
                    <span className="font-semibold text-sm">{adminProfile.username}</span>
                </Link>
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium">
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};


const AdminLayout = () => {
    const navigate = useNavigate();
    const [adminProfile, setAdminProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // This authentication logic remains completely unchanged.
    useEffect(() => {
        const checkAdminAuth = async () => {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const result = await getProfile();
                if (result.success && result.data.role === 'admin') {
                    setAdminProfile(result.data);
                } else {
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Admin auth check failed:', error);
                logout();
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        checkAdminAuth();
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
             <div className="min-h-screen bg-slate-200 flex items-center justify-center">
                <p className="text-slate-500">Verifying administrator access...</p>
            </div>
        );
    }
    
    if (!adminProfile) {
        return (
             <div className="min-h-screen bg-slate-200 flex items-center justify-center">
                <p className="text-red-500 font-semibold">Access Denied.</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-200">
            <AdminSidebar adminProfile={adminProfile} onLogout={handleLogout} />
            <div className="ml-64">
                <main className="p-8">
                    <Outlet context={{ adminProfile }} />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

