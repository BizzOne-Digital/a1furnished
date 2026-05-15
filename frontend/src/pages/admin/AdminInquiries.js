import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Calendar, Send, X } from 'lucide-react';
import { inquiryAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  new:     { label: 'New',     bg: '#fee2e2', color: '#991b1b' },
  read:    { label: 'Read',    bg: '#fef3c7', color: '#92400e' },
  replied: { label: 'Replied', bg: '#d1fae5', color: '#065f46' },
  closed:  { label: 'Closed',  bg: '#f3f4f6', color: '#6b7280' }
};

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await inquiryAPI.getAll({ status: statusFilter, limit: 30 });
      setInquiries(res.data.inquiries);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, [statusFilter]);

  const openInquiry = async (inquiry) => {
    setSelected(inquiry);
    setReplyText('');
    if (inquiry.status === 'new') {
      try {
        await inquiryAPI.update(inquiry._id, { status: 'read' });
        setInquiries(prev => prev.map(i => i._id === inquiry._id ? { ...i, status: 'read' } : i));
      } catch {}
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) { toast.error('Please write a reply'); return; }
    setReplying(true);
    try {
      const res = await inquiryAPI.update(selected._id, { adminReply: replyText });
      setSelected(res.data.inquiry);
      setInquiries(prev => prev.map(i => i._id === selected._id ? res.data.inquiry : i));
      toast.success('Reply saved!');
    } catch (err) {
      toast.error('Failed to save reply');
    } finally {
      setReplying(false);
    }
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await inquiryAPI.update(inquiryId, { status: newStatus });
      setInquiries(prev => prev.map(i => i._id === inquiryId ? { ...i, status: newStatus } : i));
      if (selected?._id === inquiryId) setSelected(prev => ({ ...prev, status: newStatus }));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'Montserrat', fontSize: '24px', color: 'var(--navy)', marginBottom: '2px' }}>Inquiries</h1>
          <p style={{ color: 'var(--gray)', fontSize: '14px' }}>{total} total inquiries</p>
        </div>
        <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '20px' }}>

        {/* Inquiry List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loading ? (
            <div className="loading-screen"><div className="spinner"></div></div>
          ) : inquiries.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '14px', padding: '60px', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
              <MessageSquare size={50} style={{ margin: '0 auto 16px', color: 'var(--gray)', opacity: 0.3 }} />
              <h3 style={{ fontFamily: 'Montserrat', color: 'var(--navy)' }}>No inquiries</h3>
            </div>
          ) : inquiries.map(inquiry => {
            const sc = STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.new;
            const isSelected = selected?._id === inquiry._id;
            return (
              <div key={inquiry._id}
                onClick={() => openInquiry(inquiry)}
                style={{
                  background: 'white', borderRadius: '12px', padding: '18px 20px',
                  boxShadow: 'var(--shadow)', cursor: 'pointer', transition: 'all 0.2s',
                  border: `2px solid ${isSelected ? 'var(--navy)' : 'transparent'}`,
                  borderLeft: inquiry.status === 'new' ? '4px solid var(--red)' : '4px solid transparent'
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'transparent'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 800, color: 'var(--navy)', fontSize: '14px', flexShrink: 0 }}>
                      {inquiry.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '14px', color: 'var(--navy)' }}>{inquiry.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray)' }}>{inquiry.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ background: sc.bg, color: sc.color, padding: '3px 9px', borderRadius: '999px', fontSize: '11px', fontFamily: 'Montserrat', fontWeight: 700 }}>{sc.label}</span>
                    <span style={{ fontSize: '12px', color: 'var(--gray)' }}>{new Date(inquiry.createdAt).toLocaleDateString('en-CA')}</span>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--gray-dark)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {inquiry.message}
                </p>
                {inquiry.property && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🏠 Re: {inquiry.property.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Inquiry Detail Panel */}
        {selected && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow)', position: 'sticky', top: '24px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Montserrat', fontSize: '16px', color: 'var(--navy)' }}>Inquiry Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>

            {/* Contact Info */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <a href={`mailto:${selected.email}`} className="btn btn-sm" style={{ background: 'var(--off-white)', border: '1px solid var(--border)', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} /> {selected.email}
              </a>
              {selected.phone && (
                <a href={`tel:${selected.phone}`} className="btn btn-sm" style={{ background: 'var(--off-white)', border: '1px solid var(--border)', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} /> {selected.phone}
                </a>
              )}
            </div>

            {/* Details */}
            {(selected.moveInDate || selected.stayDuration || selected.guests) && (
              <div style={{ padding: '12px', background: 'var(--off-white)', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px' }}>
                {selected.moveInDate && <span>📅 Move-in: {new Date(selected.moveInDate).toLocaleDateString('en-CA')}</span>}
                {selected.stayDuration && <span>⏱ Duration: {selected.stayDuration}</span>}
                {selected.guests && <span>👥 Guests: {selected.guests}</span>}
              </div>
            )}

            {/* Message */}
            <div style={{ padding: '16px', background: '#f0f4ff', borderRadius: '10px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontFamily: 'Montserrat', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Message</div>
              <p style={{ fontSize: '15px', color: 'var(--gray-dark)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
            </div>

            {/* Previous reply */}
            {selected.adminReply && (
              <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '10px', marginBottom: '20px', borderLeft: '3px solid #10b981' }}>
                <div style={{ fontSize: '12px', fontFamily: 'Montserrat', fontWeight: 700, color: '#065f46', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Reply</div>
                <p style={{ fontSize: '14px', color: 'var(--gray-dark)', lineHeight: 1.7 }}>{selected.adminReply}</p>
                <div style={{ fontSize: '11px', color: 'var(--gray)', marginTop: '6px' }}>Replied on {selected.repliedAt ? new Date(selected.repliedAt).toLocaleDateString('en-CA') : '—'}</div>
              </div>
            )}

            {/* Reply Box */}
            <div>
              <label className="form-label">Write a Reply</label>
              <textarea className="form-control" value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} placeholder="Type your reply here..." style={{ marginBottom: '12px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary btn-sm" onClick={handleReply} disabled={replying} style={{ flex: 1, justifyContent: 'center' }}>
                  <Send size={14} /> {replying ? 'Saving...' : 'Save Reply'}
                </button>
                <select className="form-control" style={{ width: 'auto' }} value={selected.status} onChange={e => handleStatusChange(selected._id, e.target.value)}>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;
