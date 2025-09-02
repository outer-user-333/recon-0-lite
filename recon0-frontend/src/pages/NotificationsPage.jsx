import React, { useState, useEffect } from 'react';

// Helper component to render an icon based on notification type
const NotificationIcon = ({ type }) => {
  const icons = {
    'report_accepted': 'fa-check-circle text-success',
    'new_program': 'fa-bullseye text-info',
    'bounty_paid': 'fa-sack-dollar', // Custom color will be applied
    'new_comment': 'fa-comment-dots text-warning',
  };
  const iconClass = icons[type] || 'fa-info-circle';
  const iconColor = type === 'bounty_paid' ? 'var(--accent-green)' : undefined;
  
  return (
    <div className="fs-4 d-flex align-items-center justify-content-center" style={{width: '40px'}}>
      <i className={`fa-solid ${iconClass}`} style={{ color: iconColor }}></i>
    </div>
  );
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/notifications')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setError("Could not load notifications.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <div className="mb-4">
        <h1 className="display-5 fw-bolder">Notifications</h1>
        <p className="text-white">Stay up to date with the latest activity on your account.</p>
      </div>

      <div className="card text-white">
        <div className="list-group list-group-flush">
          {notifications.map(notif => (
            <div 
              key={notif.id} 
              className="list-group-item d-flex align-items-center gap-3 bg-transparent text-white border-secondary py-3"
              style={{ opacity: notif.read ? 0.6 : 1 }}
            >
              <NotificationIcon type={notif.type} />
              <div className="flex-grow-1">
                <p className="mb-0 text-black">{notif.message}</p>
                <small className="text-muted">
                  {new Date(notif.timestamp).toLocaleString()}
                </small>
              </div>
              {!notif.read && (
                <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--accent-cyan)', borderRadius: '50%' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}