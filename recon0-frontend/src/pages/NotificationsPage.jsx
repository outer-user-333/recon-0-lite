import React, { useState, useEffect } from 'react';
import { getNotifications } from '/src/lib/apiService.js';
import { ShieldCheck, Megaphone, DollarSign, MessageSquare, Bell, BellOff } from 'lucide-react';

// A map to associate notification types with icons and colors for a consistent look.
const notificationVisuals = {
    report_update: {
        Icon: ShieldCheck,
        color: 'bg-emerald-100 text-emerald-600',
    },
    new_program: {
        Icon: Megaphone,
        color: 'bg-blue-100 text-blue-600',
    },
    payout: {
        Icon: DollarSign,
        color: 'bg-amber-100 text-amber-600',
    },
    comment: {
        Icon: MessageSquare,
        color: 'bg-violet-100 text-violet-600',
    },
    default: {
        Icon: Bell,
        color: 'bg-slate-100 text-slate-600',
    },
};

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const result = await getNotifications();
                if (result.success) {
                    setNotifications(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch notifications.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);
    
    // This logic remains unchanged. It updates the local state to reflect the change instantly.
    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, is_read: true } : n
        ));
    };

    const renderContent = () => {
        if (loading) return <div className="text-center text-slate-500 p-8">Loading notifications...</div>;
        if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>;
        if (notifications.length === 0) {
             return (
                <div className="text-center py-16 px-6">
                    <BellOff size={48} className="mx-auto text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-800">No New Notifications</h3>
                    <p className="mt-1 text-sm text-slate-500">You're all caught up!</p>
                </div>
            );
        }

        return (
            <div className="divide-y divide-slate-200">
                {notifications.map((notification) => {
                    const { Icon, color } = notificationVisuals[notification.type] || notificationVisuals.default;
                    return (
                        <div 
                            key={notification.id} 
                            className={`p-4 flex items-start gap-4 transition-colors ${!notification.is_read ? 'bg-blue-50/50 hover:bg-slate-50 cursor-pointer' : 'hover:bg-slate-50'}`}
                            onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                        >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                                <Icon size={20} />
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm text-slate-800">{notification.message}</p>
                                <small className="text-xs text-slate-400">{new Date(notification.created_at).toLocaleString()}</small>
                            </div>
                            {!notification.is_read && (
                                <div className="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
                <p className="mt-1 text-slate-500">Stay up to date with the latest activity on your account.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};

export default NotificationsPage;

