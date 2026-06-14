import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { inquiryAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', moveInDate: '', stayDuration: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await inquiryAPI.submit(form);
      setSubmitted(true);
      toast.success('Message sent! We will get back to you soon.');
    } catch (err) {
      toast.error('Failed to send. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '60px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '12px' }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px' }}>We're here to help you find your perfect furnished home</p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'start' }}>

          {/* Contact Info */}
          <div>
            <h2 style={{ fontFamily: 'Montserrat', fontSize: '24px', marginBottom: '24px' }}>Get In Touch</h2>
            <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: '36px', fontSize: '16px' }}>
              Have questions about our properties or want to discuss your short-term housing needs? We'd love to hear from you. Our team is available 7 days a week to assist you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              {[
                { icon: <Phone size={22} />, title: 'Phone', values: [{ label: 'Canada: +1 (416) 566-1102', link: 'tel:+14165661102' }, { label: 'USA,New York: +1 (347) 298-2876', link: 'tel:+13472982876' },] },
                { icon: <Mail size={22} />, title: 'Email', values: [{ label: 'a1furnished@gmail.com', link: 'mailto:a1furnished@gmail.com' }] },
                { icon: <MapPin size={22} />, title: 'Service Area', values: [{ label: 'Greater Toronto Area, Ontario, Canada', link: null }] },
                { icon: <Clock size={22} />, title: 'Hours', values: [{ label: 'Mon–Sun: 8:00 AM – 9:00 PM EST', link: null }] }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--off-white)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: 'var(--navy)' }}>{item.title}</div>
                    {item.values.map((v, j) => (
                      v.link ? (
                        <a key={j} href={v.link} style={{ color: 'var(--gray-dark)', fontSize: '15px', display: 'block', lineHeight: 1.8 }}>{v.label}</a>
                      ) : (
                        <span key={j} style={{ color: 'var(--gray-dark)', fontSize: '15px', display: 'block', lineHeight: 1.8 }}>{v.label}</span>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Cities served */}
            <div style={{ background: 'var(--off-white)', borderRadius: 'var(--radius)', padding: '24px' }}>
              <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '14px' }}>We Have Properties In</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Toronto', 'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Oakville', 'Burlington'].map(city => (
                  <span key={city} style={{ padding: '6px 14px', background: 'white', borderRadius: '999px', fontSize: '13px', fontFamily: 'Montserrat', fontWeight: 600, color: 'var(--navy)', border: '1px solid var(--border)' }}>
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '36px', boxShadow: 'var(--shadow-md)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>✉️</div>
                <h3 style={{ fontFamily: 'Montserrat', fontSize: '22px', marginBottom: '12px', color: 'var(--navy)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.7 }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => setSubmitted(false)}>Send Another Message</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'Montserrat', fontSize: '20px', marginBottom: '24px' }}>Send Us a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
                    </div>
                    <div>
                      <label className="form-label">Phone</label>
                      <input className="form-control" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (647) 000-0000" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="form-control" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label className="form-label">Move-in Date</label>
                      <input type="date" className="form-control" value={form.moveInDate} onChange={e => setForm(p => ({ ...p, moveInDate: e.target.value }))} />
                    </div>
                    <div>
                      <label className="form-label">Stay Duration</label>
                      <select className="form-control" value={form.stayDuration} onChange={e => setForm(p => ({ ...p, stayDuration: e.target.value }))}>
                        <option value="">Select...</option>
                        <option value="1 to 7 days">1 to 7 days</option>
                        <option value="1-2 weeks">1-2 weeks</option>
                        <option value="1 month">1 month</option>
                        <option value="2-3 months">2-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6+ months">6+ months</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-control" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4} placeholder="Tell us about your needs, preferred location, budget..." />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }} disabled={submitting}>
                    {submitting ? '⏳ Sending...' : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;