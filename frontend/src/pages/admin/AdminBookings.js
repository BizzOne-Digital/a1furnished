import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Eye } from 'lucide-react';
import { bookingAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',     bg: '#fef3c7', color: '#92400e' },
  confirmed:  { label: 'Confirmed',   bg: '#d1fae5', color: '#065f46' },
  checked_in: { label: 'Checked In',  bg: '#dbeafe', color: '#1e40af' },
  checked_out:{ label: 'Checked Out', bg: '#f3f4f6', color: '#374151' },
  cancelled:  { label: 'Cancelled',   bg: '#fee2e2', color: '#991b1b' },
  refunded:   { label: 'Refunded',    bg: '#ede9fe', color: '#5b21b6' }
};

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingAPI.getAll({ search, status: statusFilter, page, limit: 15 });
      setBookings(res.data.bookings);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchBookings, 300);
    return () => clearTimeout(t);
  }, [search, statusFilter, page]);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Montserrat', fontSize: '24px', color: 'var(--navy)', marginBottom: '2px' }}>Bookings</h1>
        <p style={{ color: 'var(--gray)', fontSize: '14px' }}>{total} total bookings</p>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <input className="form-control" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by ref, name, or email..." style={{ paddingLeft: '40px' }} />
        </div>
        <select className="form-control" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ width: 'auto', minWidth: '150px' }}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : bookings.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '14px', padding: '60px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
          <Calendar size={50} style={{ margin: '0 auto 16px', color: 'var(--gray)', opacity: 0.4 }} />
          <h3 style={{ fontFamily: 'Montserrat', color: 'var(--navy)', marginBottom: '8px' }}>No bookings found</h3>
          <p style={{ color: 'var(--gray)' }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '14px', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--navy)' }}>
                  {['Booking Ref', 'Guest', 'Property', 'Check-in', 'Check-out', 'Nights', 'Total', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.85)', fontFamily: 'Montserrat', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => {
                  const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={b._id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/bookings/${b._id}`)}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--off-white)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '13px 16px', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '13px', color: 'var(--navy)' }}>{b.bookingRef}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{b.guest?.firstName} {b.guest?.lastName}</div>
                        <div style={{ color: 'var(--gray)', fontSize: '12px' }}>{b.guest?.email}</div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: '13px', color: 'var(--gray-dark)', maxWidth: '180px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.property?.title || '—'}</div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: '13px' }}>{b.checkIn ? new Date(b.checkIn).toLocaleDateString('en-CA') : '—'}</td>
                      <td style={{ padding: '13px 16px', fontSize: '13px' }}>{b.checkOut ? new Date(b.checkOut).toLocaleDateString('en-CA') : '—'}</td>
                      <td style={{ padding: '13px 16px', fontSize: '13px', textAlign: 'center' }}>{b.totalNights || '—'}</td>
                      <td style={{ padding: '13px 16px', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '14px', color: 'var(--navy)' }}>
                        ${b.pricing?.totalAmount?.toLocaleString() || '—'}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ background: sc.bg, color: sc.color, padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontFamily: 'Montserrat', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {sc.label}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <button className="btn btn-sm" style={{ background: 'var(--off-white)', border: '1px solid var(--border)', color: 'var(--navy)' }}
                          onClick={e => { e.stopPropagation(); navigate(`/admin/bookings/${b._id}`); }}>
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {total > 15 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {Array.from({ length: Math.ceil(total / 15) }, (_, i) => i + 1).slice(0, 8).map(p => (
            <button key={p} onClick={() => setPage(p)}
              style={{ width: '36px', height: '36px', borderRadius: '8px', border: '2px solid', borderColor: page === p ? 'var(--navy)' : 'var(--border)', background: page === p ? 'var(--navy)' : 'white', color: page === p ? 'white' : 'var(--navy)', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
