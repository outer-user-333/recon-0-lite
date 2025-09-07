import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus } from '../../lib/apiService';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const result = await getAllUsers();
            if (result.success) {
                setUsers(result.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusToggle = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
        try {
            const result = await updateUserStatus(userId, newStatus);
            if (result.success) {
                // Update the user list with the new status
                setUsers(currentUsers => 
                    currentUsers.map(u => u.id === userId ? { ...u, status: newStatus } : u)
                );
            }
        } catch (err) {
            // In a real app, you'd show a proper toast notification
            alert(`Error updating status: ${err.message}`);
        }
    };

    if (loading) return <div>Loading user list...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <h2 className="mb-4">User Management</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <img src={user.avatar_url || '...'} alt="avatar" className="rounded-circle me-2" style={{width: '30px', height: '30px'}} />
                                            {user.username}
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'secondary'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge bg-${user.status === 'Active' ? 'success' : 'warning'}`}>{user.status}</span>
                                        </td>
                                        <td>
                                            {user.role !== 'admin' && (
                                                <button 
                                                    className={`btn btn-sm btn-outline-${user.status === 'Active' ? 'warning' : 'success'}`}
                                                    onClick={() => handleStatusToggle(user.id, user.status)}
                                                >
                                                    {user.status === 'Active' ? 'Suspend' : 'Reactivate'}
                                                </button>
                                            )}
                                        </td>
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

export default UserManagementPage;