import React, { useState, useEffect } from 'react';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await fetch('http://localhost:3001/api/v1/notifications');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                if (result.success) {
                    setNotifications(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch notifications.');
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const getIconForType = (type) => {
        switch (type) {
            case 'report_update':
                return 'fas fa-shield-alt text-success';
            case 'new_program':
                return 'fas fa-bullhorn text-info';
            case 'payout':
                return 'fas fa-dollar-sign text-warning';
            case 'comment':
                return 'fas fa-comment text-primary';
            default:
                return 'fas fa-bell text-secondary';
        }
    };
    
    // This function now correctly marks a notification as read
    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, is_read: true } : n
        ));
    };

    const renderContent = () => {
        if (loading) return <p>Loading notifications...</p>;
        if (error) return <div className="alert alert-danger">Error: {error}</div>;
        if (notifications.length === 0) return <p>You have no new notifications.</p>;

        return (
            <div className="list-group shadow-sm">
                {notifications.map((notification) => (
                    <div 
                        key={notification.id} 
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        onClick={() => handleMarkAsRead(notification.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex align-items-center">
                            <div className="notification-icon me-3">
                                <i className={getIconForType(notification.type)}></i>
                            </div>
                            <div>
                                <p className="mb-1">{notification.message}</p>
                                <small className="text-muted">{new Date(notification.created_at).toLocaleString()}</small>
                            </div>
                        </div>
                        {!notification.is_read && <span className="unread-dot"></span>}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            {/* ===== ADDED STYLES FOR THIS COMPONENT ===== */}
            <style>{`
                .notification-icon {
                    font-size: 1.5rem;
                    width: 40px;
                    text-align: center;
                }
                .unread-dot {
                    height: 10px;
                    width: 10px;
                    background-color: #0d6efd; /* Bootstrap primary blue */
                    border-radius: 50%;
                    display: inline-block;
                    flex-shrink: 0;
                }
            `}</style>
            {/* ============================================== */}

            <div className="container mt-5">
                <h2 className="mb-4">Notifications</h2>
                <p className="text-muted mb-4">Stay up to date with the latest activity on your account.</p>
                {renderContent()}
            </div>
        </>
    );
};

export default NotificationsPage;

