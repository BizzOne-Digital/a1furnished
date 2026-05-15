import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Home, Calendar, MessageSquare, DollarSign, TrendingUp, Eye, Clock, CheckCircle } from 'lucide-react';
import { adminAPI } from '../../utils/api';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StatCard = ({ icon, label, value, sub, color = 'var(--navy)' }) => (
  <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'flex-start', gap: '16px', borderLeft: `4px solid ${color}` }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ color: 'var(--gray)', fontSize: '13px', fontFamily: 'Montserrat', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '28px', color: 'var(--navy)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ color: 'var(--gray)', fontSize: '12px', marginTop: '4px' }}>{sub}</div>}
    </div>
  </div>
);

const statusColor = { pending: '#f59e0b', confirmed: '#10b981', checked_in: '#3b82f6', checked_out: '#6b7280', cancelled: '#ef4444' };
const statusLabel = { pending: 'Pending', confirmed: 'Confirmed', checked_in: 'Checked In', checked_out: 'Checked Out', cancelled: 'Cancelled' };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(res => {
        setStats(res.data.stats);
        setRecentBookings(res.data.recentBookings || []);
        // Format chart data
        const cd = (res.data.monthlyBookings || []).map(d => ({
          name: months[d._id.month - 1],
          bookings: d.count,
          revenue: d.revenue
        }));
        setChartData(cd);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-screen"><div className="spinner"></div><p>Loading dashboard...</p></div>
  );

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Montserrat', fontSize: '24px', color: 'var(--navy)', marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Welcome back! Here's what's happening with your properties.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <StatCard icon={<Home size={22} />} label="Total Properties" value={stats?.totalProperties || 0} sub={`${stats?.availableProperties || 0} available`} color="var(--navy)" />
        <StatCard icon={<Calendar size={22} />} label="Total Bookings" value={stats?.totalBookings || 0} sub={`${stats?.pendingBookings || 0} pending review`} color="#3b82f6" />
        <StatCard icon={<CheckCircle size={22} />} label="Active Stays" value={stats?.confirmedBookings || 0} sub="confirmed & checked in" color="#10b981" />
        <StatCard icon={<MessageSquare size={22} />} label="New Inquiries" value={stats?.newInquiries || 0} sub="unread messages" color="var(--red)" />
        <StatCard icon={<DollarSign size={22} />} label="Total Revenue" value={`$${((stats?.totalRevenue || 0) / 1000).toFixed(1)}k`} sub="CAD from paid bookings" color="#f59e0b" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Bookings Chart */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '20px', color: 'var(--navy)' }}>Monthly Bookings</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'Montserrat' }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontFamily: 'Montserrat', borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
                <Bar dataKey="bookings" fill="var(--navy)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', fontSize: '14px' }}>No data yet</div>
          )}
        </div>

        {/* Revenue Chart */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '20px', color: 'var(--navy)' }}>Revenue Trend (CAD)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'Montserrat' }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={v => [`$${v?.toLocaleString()}`, 'Revenue']} contentStyle={{ fontFamily: 'Montserrat', borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--red)" strokeWidth={2} dot={{ fill: 'var(--red)', strokeWidth: 0, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', fontSize: '14px' }}>No data yet</div>
          )}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', color: 'var(--navy)' }}>Recent Bookings</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/bookings')}>View All</button>
        </div>

        {recentBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray)' }}>
            <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>No bookings yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Ref', 'Guest', 'Property', 'Check-in', 'Check-out', 'Amount', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontFamily: 'Montserrat', fontSize: '12px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b._id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/bookings/${b._id}`)}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--off-white)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '13px', color: 'var(--navy)' }}>{b.bookingRef}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{b.guest?.firstName} {b.guest?.lastName}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: 'var(--gray-dark)' }}>{b.property?.title?.substring(0, 30)}...</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{b.checkIn ? new Date(b.checkIn).toLocaleDateString('en-CA') : '—'}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{b.checkOut ? new Date(b.checkOut).toLocaleDateString('en-CA') : '—'}</td>
                    <td style={{ padding: '12px', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '13px' }}>${b.pricing?.totalAmount?.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: `${statusColor[b.status]}20`, color: statusColor[b.status], padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontFamily: 'Montserrat', fontWeight: 600 }}>
                        {statusLabel[b.status] || b.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button className="btn btn-sm" style={{ background: 'var(--off-white)', color: 'var(--navy)', border: '1px solid var(--border)' }}
                        onClick={e => { e.stopPropagation(); navigate(`/admin/bookings/${b._id}`); }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
