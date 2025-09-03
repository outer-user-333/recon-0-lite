import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setUserProfile(profile);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  const isHacker = userProfile?.role === 'hacker';
  const isOrganization = userProfile?.role === 'organization';

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <nav className="d-flex flex-column p-3 sidebar">
        <h4 className="mb-4">RECON_0</h4>
        <ul className="nav flex-column mb-auto">
          {/* Common Links */}
          <li className="nav-item">
            <NavLink className={navLinkClasses} to="/dashboard">
              <i className="fas fa-tachometer-alt me-2"></i> Dashboard
            </NavLink>
          </li>
          
          {/* Role-Specific Links */}
          {isHacker && (
            <>
              <li className="nav-item">
                <NavLink className={navLinkClasses} to="/programs">
                  <i className="fas fa-bug me-2"></i> Programs
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClasses} to="/my-reports">
                  <i className="fas fa-file-alt me-2"></i> My Reports
                </NavLink>
              </li>
            </>
          )}

          {isOrganization && (
            <>
              <li className="nav-item">
                <NavLink className={navLinkClasses} to="/manage-reports">
                  <i className="fas fa-tasks me-2"></i> Manage Reports
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClasses} to="/create-program">
                  <i className="fas fa-plus-circle me-2"></i> Create Program
                </NavLink>
              </li>
            </>
          )}

        </ul>
        <hr />
        <div className="dropdown">
          <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <strong>{userProfile?.username || 'User'}</strong>
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item" onClick={handleLogout}>Sign out</button></li>
          </ul>
        </div>
      </nav>

      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

