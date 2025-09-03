import React from 'react';
import { useOutletContext } from 'react-router-dom';

// A simple component for the Hacker's dashboard view
const HackerDashboard = ({ profile }) => {
    return (
        <div>
            <h2 className="mb-4">Welcome back, {profile.full_name || profile.username}! 👋</h2>
            <div className="row g-4">
                <div className="col-md-3">
                    <div className="card text-center shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Reputation</h5>
                            <p className="card-text fs-2 text-primary">{profile.reputation_points || 0}</p>
                        </div>
                    </div>
                </div>
                 <div className="col-md-3">
                    <div className="card text-center shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Reports Submitted</h5>
                            <p className="card-text fs-2">19</p>
                        </div>
                    </div>
                </div>
                 <div className="col-md-3">
                    <div className="card text-center shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Bounties Earned</h5>
                            <p className="card-text fs-2 text-success">$4,200</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Add more hacker-specific widgets here */}
        </div>
    );
};

// A simple component for the Organization's dashboard view
const OrganizationDashboard = ({ profile }) => {
    return (
        <div>
            <h2 className="mb-4">Organization Dashboard: {profile.full_name || profile.username}</h2>
             <div className="row g-4">
                <div className="col-md-3">
                    <div className="card text-center shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Active Programs</h5>
                            <p className="card-text fs-2 text-info">3</p>
                        </div>
                    </div>
                </div>
                 <div className="col-md-3">
                    <div className="card text-center shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Reports Received</h5>
                            <p className="card-text fs-2">128</p>
                        </div>
                    </div>
                </div>
                 <div className="col-md-3">
                    <div className="card text-center shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Bounties Awarded</h5>
                            <p className="card-text fs-2 text-success">$12,500</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Add more organization-specific widgets here */}
        </div>
    );
};


const DashboardPage = () => {
    // Use the context hook to get the profile from the parent layout
    const { userProfile } = useOutletContext();

    if (!userProfile) {
        return <div>Loading dashboard...</div>;
    }

    // Conditionally render the correct dashboard based on the user's role
    return userProfile.role === 'hacker' 
        ? <HackerDashboard profile={userProfile} /> 
        : <OrganizationDashboard profile={userProfile} />;
};

export default DashboardPage;
