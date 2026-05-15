import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Home, Calendar, MessageSquare, Settings,
  LogOut, Menu, X, ChevronRight, Bell, User
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/admin/properties', icon: <Home size={18} />, label: 'Properties' },
    { to: '/admin/bookings', icon: <Calendar size={18} />, label: 'Bookings' },
    { to: '/admin/inquiries', icon: <MessageSquare size={18} />, label: 'Inquiries' },
    { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--off-white)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '256px' : '70px',
        background: 'var(--navy-dark)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        flexShrink: 0,
        overflow: 'hidden',
        zIndex: 20
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '70px'
        }}>
          {sidebarOpen && (
            <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '16px', color: 'white', whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--red)' }}>A1</span> Admin
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', marginLeft: sidebarOpen ? 0 : 'auto', marginRight: sidebarOpen ? 0 : 'auto' }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 8px', overflow: 'hidden' }}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 12px',
                borderRadius: '10px',
                marginBottom: '4px',
                color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                fontFamily: 'Montserrat',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                borderLeft: isActive ? '3px solid var(--red)' : '3px solid transparent'
              })}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info & logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {sidebarOpen && (
            <div style={{ padding: '12px', marginBottom: '8px' }}>
              <div style={{ color: 'white', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{user?.role}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              padding: '11px 12px', borderRadius: '10px', color: 'rgba(255,255,255,0.55)',
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat',
              fontWeight: 600, fontSize: '14px', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
          >
            <LogOut size={18} />
            {sidebarOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <header style={{
          background: 'white', borderBottom: '1px solid var(--border)',
          padding: '0 24px', height: '70px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '16px', color: 'var(--navy)' }}>
            Admin Panel
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ position: 'relative', color: 'var(--gray)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Bell size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '14px' }}>
                {user?.name?.charAt(0)}
              </div>
              <span style={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '14px', color: 'var(--navy)' }}>
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '28px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
