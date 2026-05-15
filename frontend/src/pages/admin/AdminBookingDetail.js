import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, Calendar, User, Phone, Mail, DollarSign, FileText, Save } from 'lucide-react';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',     bg: '#fef3c7', color: '#92400e' },
  confirmed:  { label: 'Confirmed',   bg: '#d1fae5', color: '#065f46' },
  checked_in: { label: 'Checked In',  bg: '#dbeafe', color: '#1e40af' },
  checked_out:{ label: 'Checked Out', bg: '#f3f4f6', color: '#374151' },
  cancelled:  { label: 'Cancelled',   bg: '#fee2e2', color: '#991b1b' },
  refunded:   { label: 'Refunded',    bg: '#ede9fe', color: '#5b21b6' }
};

const InfoRow = ({ label, value, mono = false }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
    <span style={{ color: 'var(--gray)', fontSize: '14px' }}>{label}</span>
    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--navy)', fontFamily: mono ? 'Montserrat' : 'inherit' }}>{value}</span>
  </div>
);

const AdminBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    bookingAPI.getById(id)
      .then(res => {
        const b = res.data.booking;
        setBooking(b);
        setStatus(b.status);
        setPaymentStatus(b.payment?.status || 'pending');
        setNotes(b.internalNotes || '');
      })
      .catch(() => { toast.error('Booking not found'); navigate('/admin/bookings'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await bookingAPI.update(id, {
        status,
        payment: { ...booking.payment, status: paymentStatus },
        internalNotes: notes
      });
      setBooking(res.data.booking);
      toast.success('Booking updated!');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!booking) return null;

  const sc = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/bookings')}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'Montserrat', fontSize: '22px', color: 'var(--navy)' }}>{booking.bookingRef}</h1>
            <span style={{ background: sc.bg, color: sc.color, padding: '5px 14px', borderRadius: '999px', fontSize: '13px', fontFamily: 'Montserrat', fontWeight: 600 }}>{sc.label}</span>
          </div>
          <p style={{ color: 'var(--gray)', fontSize: '13px', marginTop: '2px' }}>Created {new Date(booking.createdAt).toLocaleString('en-CA')}</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Guest Info */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} style={{ color: 'var(--red)' }} /> Guest Information
            </h3>
            <InfoRow label="Full Name" value={`${booking.guest?.firstName} ${booking.guest?.lastName}`} />
            <InfoRow label="Email" value={booking.guest?.email} />
            <InfoRow label="Phone" value={booking.guest?.phone} />
            <InfoRow label="Nationality" value={booking.guest?.nationality || '—'} />
            <InfoRow label="Adults" value={booking.guests?.adults || 1} />
            <InfoRow label="Children" value={booking.guests?.children || 0} />
          </div>

          {/* Stay Details */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} style={{ color: 'var(--red)' }} /> Stay Details
            </h3>
            <InfoRow label="Property" value={booking.property?.title || '—'} />
            <InfoRow label="Check-in" value={booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'} />
            <InfoRow label="Check-out" value={booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'} />
            <InfoRow label="Total Nights" value={`${booking.totalNights} nights`} mono />
            {booking.specialRequests && (
              <div style={{ marginTop: '16px', padding: '12px', background: 'var(--off-white)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--gray)', fontFamily: 'Montserrat', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Special Requests</div>
                <p style={{ fontSize: '14px', color: 'var(--gray-dark)', lineHeight: 1.6 }}>{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={16} style={{ color: 'var(--red)' }} /> Pricing Breakdown (CAD)
            </h3>
            <InfoRow label="Base Amount" value={`$${booking.pricing?.baseAmount?.toLocaleString() || 0}`} />
            <InfoRow label="Cleaning Fee" value={`$${booking.pricing?.cleaningFee?.toLocaleString() || 0}`} />
            <InfoRow label="HST (13%)" value={`$${booking.pricing?.taxes?.toLocaleString() || 0}`} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '2px solid var(--navy)', marginTop: '4px' }}>
              <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '16px' }}>Total</span>
              <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '20px', color: 'var(--navy)' }}>${booking.pricing?.totalAmount?.toLocaleString()}</span>
            </div>
            {booking.pricing?.securityDeposit > 0 && (
              <div style={{ fontSize: '13px', color: 'var(--gray)', marginTop: '4px' }}>
                Security deposit: ${booking.pricing.securityDeposit.toLocaleString()} (separate)
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} style={{ color: 'var(--red)' }} /> Internal Notes
            </h3>
            <textarea className="form-control" value={notes} onChange={e => setNotes(e.target.value)} rows={4}
              placeholder="Add internal notes about this booking (not visible to guest)..." />
          </div>
        </div>

        {/* Right Column - Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Update Status */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '16px' }}>Booking Status</h3>
            <select className="form-control" value={status} onChange={e => setStatus(e.target.value)} style={{ marginBottom: '12px' }}>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <div style={{ background: STATUS_CONFIG[status]?.bg, color: STATUS_CONFIG[status]?.color, padding: '10px 14px', borderRadius: '8px', textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '14px' }}>
              {STATUS_CONFIG[status]?.label}
            </div>
          </div>

          {/* Payment Status */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '16px' }}>Payment Status</h3>
            <select className="form-control" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href={`mailto:${booking.guest?.email}?subject=Booking ${booking.bookingRef}&body=Dear ${booking.guest?.firstName},`}
                className="btn btn-secondary btn-sm" style={{ justifyContent: 'center', display: 'flex' }}>
                <Mail size={14} /> Email Guest
              </a>
              <a href={`tel:${booking.guest?.phone}`}
                className="btn btn-sm" style={{ justifyContent: 'center', display: 'flex', background: 'var(--off-white)', border: '2px solid var(--border)', color: 'var(--navy)', borderRadius: '8px', fontFamily: 'Montserrat', fontWeight: 600, padding: '8px 18px', fontSize: '13px' }}>
                <Phone size={14} /> Call Guest
              </a>
              {booking.property?.slug && (
                <a href={`/properties/${booking.property.slug}`} target="_blank" rel="noreferrer"
                  className="btn btn-sm" style={{ justifyContent: 'center', display: 'flex', background: 'var(--off-white)', border: '2px solid var(--border)', color: 'var(--navy)', borderRadius: '8px', fontFamily: 'Montserrat', fontWeight: 600, padding: '8px 18px', fontSize: '13px' }}>
                  <MapPin size={14} /> View Property
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetail;
