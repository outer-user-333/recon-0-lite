import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getProfile, logout, getToken } from '../lib/apiService';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [adminProfile, setAdminProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminAuth = async () => {
            const token = getToken();
            if (!token) {
                navigate('/login'); // Not logged in
                return;
            }

            try {
                const result = await getProfile();
                if (result.success && result.data.role === 'admin') {
                    setAdminProfile(result.data);
                } else {
                    // Logged in, but not an admin. Redirect to the main dashboard.
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
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

    const navLinkClasses = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

    if (loading) {
        return <div>Verifying administrator access...</div>;
    }

    if (!adminProfile) {
        // This is a fallback in case the redirect hasn't happened yet.
        return <div>Access Denied.</div>;
    }

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            <nav className="d-flex flex-column p-3 sidebar">
                <h4 className="mb-4">ADMIN PANEL</h4>
                <ul className="nav flex-column mb-auto">
                    <li className="nav-item">
                        <NavLink className={navLinkClasses} to="/admin/users">
                            <i className="fas fa-users-cog me-2"></i> User Management
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={navLinkClasses} to="/admin/analytics">
                            <i className="fas fa-chart-line me-2"></i> Platform Analytics
                        </NavLink>
                    </li>
                </ul>
                <hr />
                <div className="dropdown">
                    <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src={adminProfile.avatar_url || '...'} alt="Avatar" className="rounded-circle me-2" style={{ width: '32px', height: '32px' }}/>
                        <strong>{adminProfile.username}</strong>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                       <li><NavLink className="dropdown-item" to="/admin/profile">My Profile</NavLink></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item" onClick={handleLogout}>Sign out</button></li>
                    </ul>
                </div>
            </nav>

            <main className="flex-grow-1 p-4">
                <Outlet context={{ adminProfile }} />
            </main>
        </div>
    );
};

export default AdminLayout;