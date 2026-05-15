import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyAPI, bookingAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { MapPin, Bed, Bath, Calendar, User, Mail, Phone, ChevronRight } from 'lucide-react';

const BookingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    checkIn: '', checkOut: '',
    adults: 1, children: 0,
    firstName: '', lastName: '',
    email: '', phone: '',
    nationality: '',
    specialRequests: ''
  });

  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    propertyAPI.getBySlug(slug)
      .then(res => setProperty(res.data.property))
      .catch(() => navigate('/properties'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (form.checkIn && form.checkOut && property) {
      const checkIn = new Date(form.checkIn);
      const checkOut = new Date(form.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

      if (nights > 0) {
        const months = nights / 30;
        let baseAmount;
        if (nights >= 30) baseAmount = property.pricing.perMonth * months;
        else if (nights >= 7) baseAmount = (property.pricing.perWeek || property.pricing.perMonth / 4) * (nights / 7);
        else baseAmount = (property.pricing.perNight || property.pricing.perMonth / 30) * nights;

        const cleaningFee = property.pricing.cleaningFee || 0;
        const taxes = Math.round(baseAmount * 0.13);
        const total = Math.round(baseAmount + cleaningFee + taxes);

        setPricing({ nights, baseAmount: Math.round(baseAmount), cleaningFee, taxes, total, securityDeposit: property.pricing.securityDeposit || 0 });
      }
    }
  }, [form.checkIn, form.checkOut, property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!form.checkIn || !form.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookingAPI.create({
        property: property._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: { adults: form.adults, children: form.children },
        guest: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          nationality: form.nationality
        },
        specialRequests: form.specialRequests
      });
      navigate(`/booking-confirmed/${res.data.booking._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen" style={{ minHeight: '80vh' }}><div className="spinner"></div></div>;
  if (!property) return null;

  const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container-sm">
        <h1 style={{ fontFamily: 'Montserrat', fontSize: '28px', marginBottom: '8px' }}>Complete Your Booking</h1>
        <p style={{ color: 'var(--gray)', marginBottom: '32px' }}>Fill in the details below to reserve this property</p>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '36px' }}>
          {['Stay Details', 'Guest Info', 'Review & Confirm'].map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step > i + 1 ? '#4ade80' : step === i + 1 ? 'var(--navy)' : 'var(--border)',
                  color: step >= i + 1 ? 'white' : 'var(--gray)',
                  fontFamily: 'Montserrat', fontWeight: 700, fontSize: '14px'
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '13px', fontFamily: 'Montserrat', fontWeight: 600, color: step === i + 1 ? 'var(--navy)' : 'var(--gray)', display: window.innerWidth < 480 ? 'none' : 'block' }}>
                  {s}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '2px', background: step > i + 1 ? '#4ade80' : 'var(--border)' }} />}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>

          {/* Form */}
          <div>
            {/* Step 1 */}
            {step === 1 && (
              <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '28px', boxShadow: 'var(--shadow)' }}>
                <h2 style={{ fontFamily: 'Montserrat', fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} style={{ color: 'var(--red)' }} /> Stay Dates
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Check-in Date *</label>
                    <input name="checkIn" type="date" className="form-control" value={form.checkIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Check-out Date *</label>
                    <input name="checkOut" type="date" className="form-control" value={form.checkOut}
                      min={form.checkIn || new Date().toISOString().split('T')[0]}
                      onChange={handleChange} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Adults</label>
                    <select name="adults" className="form-control" value={form.adults} onChange={handleChange}>
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Children</label>
                    <select name="children" className="form-control" value={form.children} onChange={handleChange}>
                      {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                {pricing && (
                  <div style={{ marginTop: '20px', padding: '16px', background: 'var(--off-white)', borderRadius: '10px' }}>
                    <div style={{ fontFamily: 'Montserrat', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                      {pricing.nights} nights stay
                    </div>
                    <div style={{ color: 'var(--gray)', fontSize: '14px' }}>
                      Estimated total: <strong style={{ color: 'var(--navy)' }}>${pricing.total.toLocaleString()} CAD</strong> (incl. taxes)
                    </div>
                  </div>
                )}

                <button className="btn btn-primary" style={{ marginTop: '24px', width: '100%', justifyContent: 'center', padding: '14px' }} onClick={() => {
                  if (!form.checkIn || !form.checkOut) { toast.error('Please select dates'); return; }
                  setStep(2);
                }}>
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '28px', boxShadow: 'var(--shadow)' }}>
                <h2 style={{ fontFamily: 'Montserrat', fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={20} style={{ color: 'var(--red)' }} /> Guest Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">First Name *</label>
                    <input name="firstName" className="form-control" value={form.firstName} onChange={handleChange} placeholder="John" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Last Name *</label>
                    <input name="lastName" className="form-control" value={form.lastName} onChange={handleChange} placeholder="Doe" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Phone Number *</label>
                    <input name="phone" type="tel" className="form-control" value={form.phone} onChange={handleChange} placeholder="+1 (647) 000-0000" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Nationality</label>
                    <input name="nationality" className="form-control" value={form.nationality} onChange={handleChange} placeholder="e.g. Canadian" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Special Requests</label>
                  <textarea name="specialRequests" className="form-control" value={form.specialRequests} onChange={handleChange} rows={3} placeholder="Early check-in, dietary requirements, accessibility needs..." />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>← Back</button>
                  <button className="btn btn-primary" onClick={() => {
                    if (!form.firstName || !form.email || !form.phone) { toast.error('Please fill required fields'); return; }
                    setStep(3);
                  }} style={{ flex: 2, justifyContent: 'center', padding: '14px' }}>
                    Review Booking <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '28px', boxShadow: 'var(--shadow)' }}>
                <h2 style={{ fontFamily: 'Montserrat', fontSize: '18px', marginBottom: '24px' }}>Review & Confirm</h2>

                {/* Summary rows */}
                <div style={{ marginBottom: '24px' }}>
                  {[
                    { label: 'Property', value: property.title },
                    { label: 'Check-in', value: new Date(form.checkIn).toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                    { label: 'Check-out', value: new Date(form.checkOut).toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                    { label: 'Duration', value: `${pricing?.nights} nights` },
                    { label: 'Guests', value: `${form.adults} adult${form.adults > 1 ? 's' : ''}${form.children > 0 ? `, ${form.children} child${form.children > 1 ? 'ren' : ''}` : ''}` },
                    { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone }
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid var(--border)', gap: '16px' }}>
                      <span style={{ color: 'var(--gray)', fontSize: '14px', minWidth: '100px' }}>{row.label}</span>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--navy)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {pricing && (
                  <div style={{ background: 'var(--navy)', borderRadius: '10px', padding: '20px', marginBottom: '24px', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', opacity: 0.85 }}>
                      <span>Base Amount ({pricing.nights} nights)</span><span>${pricing.baseAmount.toLocaleString()}</span>
                    </div>
                    {pricing.cleaningFee > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', opacity: 0.85 }}>
                        <span>Cleaning Fee</span><span>${pricing.cleaningFee}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px', opacity: 0.85 }}>
                      <span>HST (13%)</span><span>${pricing.taxes.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat', fontWeight: 800, fontSize: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px' }}>
                      <span>Total</span><span>${pricing.total.toLocaleString()} CAD</span>
                    </div>
                    {pricing.securityDeposit > 0 && (
                      <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
                        * Security deposit of ${pricing.securityDeposit.toLocaleString()} CAD required separately
                      </div>
                    )}
                  </div>
                )}

                <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '20px', lineHeight: 1.6 }}>
                  By confirming this booking, you agree to our cancellation policy and terms of service. Your booking will be reviewed and confirmed within 24 hours.
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>← Back</button>
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting} style={{ flex: 2, justifyContent: 'center', padding: '14px', opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? '⏳ Submitting...' : '✓ Confirm Booking'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Property Summary Sidebar */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
              <img src={primaryImage?.url || ''} alt={property.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '8px', color: 'var(--navy)' }}>{property.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gray)', fontSize: '13px', marginBottom: '12px' }}>
                  <MapPin size={13} /> {property.address?.city}, Ontario
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--gray-dark)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Bed size={13} /> {property.bedrooms} bed</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Bath size={13} /> {property.bathrooms} bath</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
