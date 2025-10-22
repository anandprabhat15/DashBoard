import React, { useEffect, useState } from 'react';
import { getUserInfo, getNotifications } from '../services/api';

const Sidebar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('Task list');

  useEffect(() => {
    // Fetch user info and notifications
    Promise.all([
      getUserInfo(),
      getNotifications()
    ])
      .then(([userRes, notifRes]) => {
        if (userRes.data && userRes.data.profile_data) {
          setUserInfo(userRes.data.profile_data);
        }
        if (notifRes.data && notifRes.data.notifications) {
          setNotificationCount(Object.keys(notifRes.data.notifications).length);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sidebar data:', error);
        setLoading(false);
      });
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Projects', icon: '🎯' },
    { name: 'Task list', icon: '📋' },
    { name: 'Services', icon: '⚙️' },
    { name: 'Notifications', icon: '🔔', badge: notificationCount },
    { name: 'Chat', icon: '💬' }
  ];

  return (
    <div style={{
      width: '240px',
      padding: '24px 16px',
      background: '#ffffff',
      height: '100vh',
      boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px',
        padding: '8px 12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: '#000',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>
          🏠
        </div>
        <span style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#000',
          letterSpacing: '0.5px'
        }}>
          BRESS
        </span>
      </div>

      {/* Menu Items */}
      <nav style={{ flexGrow: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>
              <div
                onClick={() => setActiveMenu(item.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: activeMenu === item.name ? '#1a1d29' : 'transparent',
                  color: activeMenu === item.name ? '#ffffff' : '#64748b',
                  fontSize: '15px',
                  fontWeight: activeMenu === item.name ? '600' : '500',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (activeMenu !== item.name) {
                    e.currentTarget.style.background = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeMenu !== item.name) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '18px', opacity: 0.9 }}>{item.icon}</span>
                <span>{item.name}</span>
                {item.badge > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    background: '#22c55e',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    minWidth: '20px',
                    textAlign: 'center'
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Card */}
      <div style={{
        marginTop: 'auto',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {loading ? (
          <div style={{ color: '#64748b', fontSize: '14px' }}>Loading...</div>
        ) : userInfo ? (
          <>
            <img
              src={userInfo.profile_pic}
              alt={userInfo.name}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {userInfo.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {userInfo.user_id}
              </div>
            </div>
          </>
        ) : (
          <div style={{ color: '#64748b', fontSize: '14px' }}>No user data</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
