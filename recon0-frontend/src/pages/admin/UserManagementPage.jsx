import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus } from '../../lib/apiService.js';
import { UserX, UserCheck, Search } from 'lucide-react';

// Reusable Badge components for consistent styling
const StatusBadge = ({ status }) => {
    // FIX: Added a fallback for status to prevent crash if it's undefined.
    const lowerStatus = (status || '').toLowerCase();
    let colorClasses = 'bg-slate-100 text-slate-800';
    if (lowerStatus === 'active') colorClasses = 'bg-emerald-100 text-emerald-800';
    if (lowerStatus === 'suspended') colorClasses = 'bg-amber-100 text-amber-800';
    
    return <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>{status || 'Unknown'}</span>;
};

const RoleBadge = ({ role }) => {
    // FIX: Added a fallback for role for consistency.
    const lowerRole = (role || '').toLowerCase();
    let colorClasses = 'bg-slate-100 text-slate-700';
    if (lowerRole === 'admin') colorClasses = 'bg-violet-100 text-violet-800';
    if (lowerRole === 'organization') colorClasses = 'bg-blue-100 text-blue-800';
    if (lowerRole === 'hacker') colorClasses = 'bg-rose-100 text-rose-800';

    return <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${colorClasses}`}>{role || 'N/A'}</span>;
};


const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const result = await getAllUsers();
            if (result.success) {
                setUsers(result.data);
            } else {
                throw new Error(result.message || "Failed to fetch users.");
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
                setUsers(currentUsers => 
                    currentUsers.map(u => u.id === userId ? { ...u, status: newStatus } : u)
                );
            } else {
                 throw new Error(result.message || "Status update failed.");
            }
        } catch (err) {
            console.error(`Error updating status: ${err.message}`);
        }
    };

    if (loading) return <div className="text-center text-slate-500 p-8">Loading user list...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;

    const filteredUsers = users.filter(user => 
        (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                 <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
                 <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search by user or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                 </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar_url || `https://placehold.co/40x40/E2E8F0/475569?text=${(user.username || 'U').charAt(0).toUpperCase()}`} alt="avatar" className="w-10 h-10 rounded-full" />
                                            <div>
                                                <div className="font-semibold text-slate-800">{user.username}</div>
                                                <div className="text-xs text-slate-500">ID: {user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><RoleBadge role={user.role} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {user.role !== 'admin' && (
                                            <button 
                                                className={`flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 ${
                                                    user.status === 'Active' 
                                                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                                                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                }`}
                                                onClick={() => handleStatusToggle(user.id, user.status)}
                                            >
                                                {user.status === 'Active' ? <UserX size={14}/> : <UserCheck size={14}/>}
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
    );
};

export default UserManagementPage;

