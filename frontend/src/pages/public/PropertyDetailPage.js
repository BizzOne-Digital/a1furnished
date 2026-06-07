import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Camera,
  X,
  Heart,
  Send,
  User,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { propertyAPI, inquiryAPI } from '../../utils/api';

/* ───────────────────────────────────────────
   FULLSCREEN LIGHTBOX
   ─────────────────────────────────────────── */
const Lightbox = ({ images, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);

  const prev = useCallback(
    () => setIdx(i => (i === 0 ? images.length - 1 : i - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setIdx(i => (i === images.length - 1 ? 0 : i + 1)),
    [images.length]
  );

  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <div className="lb-overlay" onClick={onClose}>
      <div className="lb-inner" onClick={e => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose}><X size={22} /></button>
        <div className="lb-counter">{idx + 1} / {images.length}</div>
        {images.length > 1 && (
          <>
            <button className="lb-arrow lb-arrow-left" onClick={prev}><ChevronLeft size={26} /></button>
            <button className="lb-arrow lb-arrow-right" onClick={next}><ChevronRight size={26} /></button>
          </>
        )}
        <img src={images[idx]?.url} alt={`Photo ${idx + 1}`} className="lb-img" />
        <div className="lb-thumbs">
          {images.map((img, i) => (
            <button key={i} className={`lb-thumb ${i === idx ? 'lb-thumb-active' : ''}`} onClick={() => setIdx(i)}>
              <img src={img.url} alt="" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────
   INQUIRY MODAL
   ─────────────────────────────────────────── */
const InquiryModal = ({ property, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in "${property.title}". Please share more details about availability and booking.`
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSending(true);
    try {
      // Same endpoint as ContactPage → shows in admin panel + sends email
      await inquiryAPI.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: `[Property: ${property.title}]\n${window.location.href}\n\n${form.message.trim()}`,
        moveInDate: '',
        stayDuration: ''
      });
      setSent(true);
    } catch (err) {
      // Fallback — open mail client if API fails
      const subject = encodeURIComponent(`Inquiry: ${property.title}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nProperty: ${property.title}\nLink: ${window.location.href}\n\nMessage:\n${form.message}`
      );
      window.location.href = `mailto:info@yoursite.com?subject=${subject}&body=${body}`;
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="inquiry-overlay" onClick={onClose}>
      <div className="inquiry-modal" onClick={e => e.stopPropagation()}>
        <button className="inquiry-close" onClick={onClose}><X size={20} /></button>

        {sent ? (
          <div className="inquiry-success">
            <div className="inquiry-success-icon"><CheckCircle size={48} /></div>
            <h3>Inquiry Sent!</h3>
            <p>Thank you for your interest. Our team will get back to you within 24 hours.</p>
            <button className="btn btn-primary inquiry-done-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="inquiry-header">
              <div className="inquiry-header-icon"><Mail size={22} /></div>
              <h3>Send Inquiry</h3>
              <p>Fill the form below and we'll get back to you soon</p>
            </div>

            <div className="inquiry-property-card">
              <div className="inquiry-property-img">
                <img
                  src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}
                  alt={property.title}
                />
              </div>
              <div className="inquiry-property-info">
                <div className="inquiry-property-title">{property.title}</div>
                <div className="inquiry-property-location">
                  <MapPin size={13} />
                  {property.address?.city}, {property.address?.province}
                </div>
                <div className="inquiry-property-price">
                  ${property.pricing?.perMonth?.toLocaleString()} <span>/month</span>
                </div>
              </div>
            </div>

            <div className="inquiry-form">
              <div className="inquiry-field">
                <label>Full Name <span className="inquiry-req">*</span></label>
                <div className={`inquiry-input-wrap ${errors.name ? 'inquiry-input-error' : ''}`}>
                  <User size={16} className="inquiry-input-icon" />
                  <input type="text" placeholder="Enter your full name" value={form.name} onChange={e => handleChange('name', e.target.value)} />
                </div>
                {errors.name && <span className="inquiry-err">{errors.name}</span>}
              </div>

              <div className="inquiry-field">
                <label>Email Address <span className="inquiry-req">*</span></label>
                <div className={`inquiry-input-wrap ${errors.email ? 'inquiry-input-error' : ''}`}>
                  <Mail size={16} className="inquiry-input-icon" />
                  <input type="email" placeholder="you@email.com" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                </div>
                {errors.email && <span className="inquiry-err">{errors.email}</span>}
              </div>

              <div className="inquiry-field">
                <label>Phone Number <span className="inquiry-req">*</span></label>
                <div className={`inquiry-input-wrap ${errors.phone ? 'inquiry-input-error' : ''}`}>
                  <Phone size={16} className="inquiry-input-icon" />
                  <input type="tel" placeholder="+1 (xxx) xxx-xxxx" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
                </div>
                {errors.phone && <span className="inquiry-err">{errors.phone}</span>}
              </div>

              <div className="inquiry-field">
                <label>Message <span className="inquiry-req">*</span></label>
                <div className={`inquiry-input-wrap inquiry-textarea-wrap ${errors.message ? 'inquiry-input-error' : ''}`}>
                  <MessageSquare size={16} className="inquiry-input-icon inquiry-textarea-icon" />
                  <textarea rows={4} placeholder="Write your message..." value={form.message} onChange={e => handleChange('message', e.target.value)} />
                </div>
                {errors.message && <span className="inquiry-err">{errors.message}</span>}
              </div>

              <button className="btn btn-primary inquiry-submit-btn" onClick={handleSubmit} disabled={sending}>
                {sending ? (<><span className="inquiry-spinner"></span>Sending...</>) : (<><Send size={16} />Send Inquiry</>)}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────
   MAIN PAGE
   ─────────────────────────────────────────── */
const PropertyDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [mobileImg, setMobileImg] = useState(0);

  useEffect(() => {
    propertyAPI
      .getBySlug(slug)
      .then(res => {
        setProperty(res.data.property);
        propertyAPI.incrementViews(res.data.property._id).catch(() => {});
      })
      .catch(() => navigate('/properties'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div className="spinner"></div>
        <p>Loading property...</p>
      </div>
    );
  }

  if (!property) return null;

  const allImages =
    property.images?.length > 0
      ? property.images
      : [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200' },
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600' },
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600' },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600' },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600' },
          { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600' }
        ];

  const gridImages = allImages.slice(0, 5);
  const smallImages = gridImages.slice(1);
  const extraCount = allImages.length - 5;
  const openLightbox = idx => setLightbox({ open: true, index: idx });

  const amenityIcons = {
    wifi: '📶', wind: '❄️', thermometer: '🌡️', utensils: '🍳',
    shirt: '👕', tv: '📺', car: '🚗', dumbbell: '💪',
    bell: '🔔', tree: '🌳', flame: '🔥', zap: '⚡',
    monitor: '🖥️', home: '🏠', heart: '🐾'
  };

  return (
    <div>
      {/* AGODA-STYLE IMAGE GRID (desktop) */}
      <div className="gallery-section">
        <div className="gallery-grid">
          <div className="gallery-main" onClick={() => openLightbox(0)}>
            <img src={gridImages[0]?.url} alt={property.title} />
            <button className="see-all-btn" onClick={e => { e.stopPropagation(); openLightbox(0); }}>
              <Camera size={16} />See all photos
            </button>
          </div>
          {smallImages.map((img, i) => {
            const isLast = i === smallImages.length - 1 && extraCount > 0;
            return (
              <div key={i} className="gallery-thumb" onClick={() => openLightbox(i + 1)}>
                <img src={img.url} alt={`Photo ${i + 2}`} />
                {isLast && <div className="gallery-more-overlay"><span>+{extraCount}</span></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE CAROUSEL */}
      <div className="gallery-mobile">
        <div className="gallery-mobile-track" style={{ transform: `translateX(-${mobileImg * 100}%)` }}>
          {allImages.map((img, i) => (
            <div className="gallery-mobile-slide" key={i}>
              <img src={img.url} alt={`Photo ${i + 1}`} onClick={() => openLightbox(i)} />
            </div>
          ))}
        </div>
        {allImages.length > 1 && (
          <>
            <button className="mob-nav mob-nav-left" onClick={() => setMobileImg(i => (i === 0 ? allImages.length - 1 : i - 1))}><ChevronLeft size={18} /></button>
            <button className="mob-nav mob-nav-right" onClick={() => setMobileImg(i => (i === allImages.length - 1 ? 0 : i + 1))}><ChevronRight size={18} /></button>
          </>
        )}
        <div className="mob-dots">
          {allImages.slice(0, 8).map((_, i) => (
            <button key={i} className={`mob-dot ${i === mobileImg ? 'mob-dot-active' : ''}`} onClick={() => setMobileImg(i)} />
          ))}
          {allImages.length > 8 && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>+{allImages.length - 8}</span>}
        </div>
        <div className="mob-counter">{mobileImg + 1} / {allImages.length}</div>
        <button className="mob-see-all" onClick={() => openLightbox(0)}><Camera size={14} />All Photos</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="container" style={{ padding: '32px 20px 100px' }}>
        <div className="property-layout">
          {/* LEFT SIDE */}
          <div>
            <div style={{ marginBottom: 30 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                <span className={`badge ${property.status === 'available' ? 'badge-success' : 'badge-danger'}`}>
                  {property.status === 'available' ? '✓ Available' : property.status}
                </span>
                <span className="badge badge-gray">{property.propertyType}</span>
              </div>

              <h1 style={{ fontSize: 'clamp(26px, 5vw, 38px)', marginBottom: 14, lineHeight: 1.2, color: 'var(--navy)' }}>
                {property.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: 'var(--gray)', marginBottom: 20 }}>
                <MapPin size={18} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ lineHeight: 1.6 }}>
                  {property.address?.street && `${property.address.street}, `}
                  {property.address?.city}, {property.address?.province}, Canada
                </span>
              </div>

              <div className="property-features">
                {[
                  { icon: <Bed size={18} />, label: `${property.bedrooms} Bedrooms` },
                  { icon: <Bath size={18} />, label: `${property.bathrooms} Bathrooms` },
                  { icon: <Users size={18} />, label: `Up to ${property.maxGuests} Guests` }
                ].map((item, i) => (
                  <div key={i} className="feature-item">
                    <span style={{ color: 'var(--red)' }}>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {property.averageRating > 0 && (
              <div className="rating-box">
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={18} fill={s <= Math.round(property.averageRating) ? '#f5a623' : 'transparent'} color="#f5a623" />
                  ))}
                </div>
                <span style={{ fontWeight: 700, fontSize: 18 }}>{property.averageRating}</span>
                <span style={{ color: 'var(--gray)' }}>({property.totalReviews} reviews)</span>
              </div>
            )}

            <div style={{ marginBottom: 36 }}>
              <h2 className="section-title">About This Property</h2>
              <div style={{ lineHeight: 1.9, color: 'var(--gray-dark)', whiteSpace: 'pre-line' }}>{property.description}</div>
            </div>

            {property.amenities?.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <h2 className="section-title">Amenities</h2>
                <div className="amenities-grid">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="amenity-card">
                      <span style={{ fontSize: 18 }}>{amenityIcons[amenity.icon] || '✓'}</span>
                      {amenity.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.reviews?.length > 0 && (
              <div>
                <h2 className="section-title">Guest Reviews</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {property.reviews.slice(0, 5).map((review, i) => (
                    <div key={i} className="review-card">
                      <div className="review-top">
                        <div>
                          <div style={{ fontWeight: 700, marginBottom: 4 }}>{review.name}</div>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={13} fill={s <= review.rating ? '#f5a623' : 'transparent'} color="#f5a623" />
                            ))}
                          </div>
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--gray)' }}>
                          {new Date(review.date).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p style={{ lineHeight: 1.7, color: 'var(--gray-dark)' }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="booking-wrapper">
            <div className="booking-card">
              <div className="booking-header">
                <div className="booking-small">STARTING FROM</div>
                <div className="booking-price">${property.pricing?.perMonth?.toLocaleString()}</div>
                <div className="booking-small">CAD / month</div>
              </div>
              <div style={{ padding: 24 }}>
                {[
                  { label: 'Minimum Stay', value: `${property.minimumStay || 30} days` },
                  { label: 'Utilities', value: 'Included' },
                  { label: 'Cleaning Fee', value: property.pricing?.cleaningFee ? `$${property.pricing.cleaningFee}` : 'Included' }
                ].map((item, i) => (
                  <div key={i} className="price-row">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 18, padding: 16, borderRadius: 10 }}
                  onClick={() => navigate(`/book/${property.slug}`)}>
                  Book This Property
                </button>

                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: 14, borderRadius: 10 }}
                  onClick={() => setShowInquiryForm(true)}>
                  <Mail size={16} />Send Inquiry
                </button>

                <div className="call-box">
                  <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 8 }}>Have questions? Call us</div>
                  <a href="tel:+14165661102" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, color: 'var(--navy)', fontWeight: 700, textDecoration: 'none' }}>
                    <Phone size={16} style={{ color: 'var(--red)' }} />+1 (416) 566-1102
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM BAR */}
      <div className="mobile-book-bar">
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: 20, color: 'var(--navy)' }}>
            ${property.pricing?.perMonth?.toLocaleString()}
            <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--gray)' }}>/mo</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/book/${property.slug}`)}>Book Now</button>
      </div>

      {lightbox.open && (
        <Lightbox images={allImages} startIndex={lightbox.index} onClose={() => setLightbox({ open: false, index: 0 })} />
      )}

      {showInquiryForm && (
        <InquiryModal property={property} onClose={() => setShowInquiryForm(false)} />
      )}

      <style>{`
        .gallery-section{ max-width:1280px; margin:0 auto; padding:0 20px; }
        .gallery-grid{ display:grid; grid-template-columns:1fr 1fr 1fr 1fr; grid-template-rows:1fr 1fr; gap:4px; height:clamp(300px,46vh,520px); border-radius:12px; overflow:hidden; }
        .gallery-main{ grid-column:1/3; grid-row:1/3; position:relative; cursor:pointer; overflow:hidden; }
        .gallery-main img{ width:100%; height:100%; object-fit:cover; transition:transform 0.35s ease; }
        .gallery-main:hover img{ transform:scale(1.03); }
        .see-all-btn{ position:absolute; bottom:16px; right:16px; display:flex; align-items:center; gap:8px; padding:10px 18px; background:rgba(255,255,255,0.95); border:none; border-radius:8px; font-weight:600; font-size:13px; color:#1a1a2e; cursor:pointer; box-shadow:0 2px 12px rgba(0,0,0,0.15); transition:background 0.2s; z-index:2; }
        .see-all-btn:hover{ background:#fff; }
        .gallery-thumb{ position:relative; cursor:pointer; overflow:hidden; }
        .gallery-thumb img{ width:100%; height:100%; object-fit:cover; transition:transform 0.35s ease; }
        .gallery-thumb:hover img{ transform:scale(1.06); }
        .gallery-more-overlay{ position:absolute; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; pointer-events:none; }
        .gallery-more-overlay span{ color:#fff; font-size:28px; font-weight:700; text-shadow:0 2px 8px rgba(0,0,0,0.3); }

        .gallery-mobile{ display:none; position:relative; overflow:hidden; height:clamp(240px,42vh,340px); background:var(--navy-dark,#0f0f1a); }
        .gallery-mobile-track{ display:flex; height:100%; transition:transform 0.35s ease; }
        .gallery-mobile-slide{ min-width:100%; height:100%; }
        .gallery-mobile-slide img{ width:100%; height:100%; object-fit:cover; }
        .mob-nav{ position:absolute; top:50%; transform:translateY(-50%); width:36px; height:36px; border-radius:50%; border:none; background:rgba(255,255,255,0.85); display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:3; box-shadow:0 1px 6px rgba(0,0,0,0.2); }
        .mob-nav-left{ left:10px; } .mob-nav-right{ right:10px; }
        .mob-dots{ position:absolute; bottom:12px; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:5px; z-index:3; }
        .mob-dot{ width:7px; height:7px; border-radius:999px; border:none; background:rgba(255,255,255,0.45); padding:0; cursor:pointer; transition:all 0.25s; }
        .mob-dot-active{ width:22px; background:#fff; }
        .mob-counter{ position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.55); color:#fff; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:500; z-index:3; }
        .mob-see-all{ position:absolute; bottom:12px; right:12px; display:flex; align-items:center; gap:6px; padding:7px 14px; background:rgba(255,255,255,0.92); border:none; border-radius:6px; font-weight:600; font-size:12px; color:#1a1a2e; cursor:pointer; z-index:3; }

        .lb-overlay{ position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:9999; display:flex; align-items:center; justify-content:center; animation:lbFadeIn 0.25s ease; }
        @keyframes lbFadeIn{ from{opacity:0} to{opacity:1} }
        .lb-inner{ position:relative; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px 100px; }
        .lb-close{ position:absolute; top:16px; right:16px; width:44px; height:44px; border-radius:50%; border:none; background:rgba(255,255,255,0.1); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:2; transition:background 0.2s; }
        .lb-close:hover{ background:rgba(255,255,255,0.25); }
        .lb-counter{ position:absolute; top:24px; left:50%; transform:translateX(-50%); color:rgba(255,255,255,0.8); font-size:14px; font-weight:500; }
        .lb-arrow{ position:absolute; top:50%; transform:translateY(-50%); width:48px; height:48px; border-radius:50%; border:none; background:rgba(255,255,255,0.1); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background 0.2s; z-index:2; }
        .lb-arrow:hover{ background:rgba(255,255,255,0.25); }
        .lb-arrow-left{ left:16px; } .lb-arrow-right{ right:16px; }
        .lb-img{ max-width:90%; max-height:calc(100vh - 180px); object-fit:contain; border-radius:6px; animation:lbSlideUp 0.3s ease; }
        @keyframes lbSlideUp{ from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .lb-thumbs{ position:absolute; bottom:16px; left:50%; transform:translateX(-50%); display:flex; gap:6px; max-width:90%; overflow-x:auto; padding:8px 4px; scrollbar-width:none; }
        .lb-thumbs::-webkit-scrollbar{ display:none; }
        .lb-thumb{ flex-shrink:0; width:56px; height:42px; border-radius:6px; overflow:hidden; border:2px solid transparent; cursor:pointer; opacity:0.5; transition:all 0.2s; padding:0; background:none; }
        .lb-thumb:hover{ opacity:0.8; }
        .lb-thumb-active{ opacity:1; border-color:#fff; }
        .lb-thumb img{ width:100%; height:100%; object-fit:cover; }

        .property-layout{ display:grid; grid-template-columns:1fr 380px; gap:40px; align-items:start; }
        .property-features{ display:flex; flex-wrap:wrap; gap:18px; }
        .feature-item{ display:flex; align-items:center; gap:8px; font-weight:600; color:var(--navy); }
        .rating-box{ display:flex; align-items:center; gap:12px; padding:16px; background:#fffdf0; border-radius:12px; margin-bottom:32px; border:1px solid #f5e89a; flex-wrap:wrap; }
        .section-title{ font-size:22px; margin-bottom:18px; color:var(--navy); }
        .amenities-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; }
        .amenity-card{ display:flex; align-items:center; gap:10px; padding:14px; background:var(--off-white); border-radius:10px; font-size:14px; font-weight:500; }
        .review-card{ padding:20px; background:var(--off-white); border-radius:14px; border-left:4px solid var(--red); }
        .review-top{ display:flex; justify-content:space-between; gap:12px; margin-bottom:12px; }
        .booking-wrapper{ position:sticky; top:90px; }
        .booking-card{ background:#fff; border-radius:20px; overflow:hidden; border:1px solid var(--border); box-shadow:var(--shadow-lg); }
        .booking-header{ background:var(--navy); padding:26px; text-align:center; }
        .booking-small{ color:rgba(255,255,255,0.7); font-size:13px; }
        .booking-price{ font-size:42px; color:#fff; font-weight:900; line-height:1.1; margin:6px 0; }
        .price-row{ display:flex; justify-content:space-between; gap:14px; padding:12px 0; border-bottom:1px solid var(--border); font-size:14px; }
        .call-box{ margin-top:20px; padding:16px; border-radius:10px; background:var(--off-white); text-align:center; }
        .mobile-book-bar{ display:none; }

        .inquiry-overlay{ position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); z-index:10000; display:flex; align-items:center; justify-content:center; padding:20px; animation:inquiryFadeIn 0.25s ease; }
        @keyframes inquiryFadeIn{ from{opacity:0} to{opacity:1} }
        @keyframes inquirySlideUp{ from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .inquiry-modal{ background:#fff; border-radius:20px; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; position:relative; box-shadow:0 25px 60px rgba(0,0,0,0.3); animation:inquirySlideUp 0.3s ease; }
        .inquiry-close{ position:absolute; top:16px; right:16px; width:36px; height:36px; border-radius:50%; border:none; background:var(--off-white,#f5f5f5); color:var(--navy,#1a1a2e); display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:2; transition:background 0.2s; }
        .inquiry-close:hover{ background:#e8e8e8; }
        .inquiry-header{ padding:28px 28px 0; text-align:center; }
        .inquiry-header-icon{ width:52px; height:52px; border-radius:14px; background:var(--red,#e63946); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; }
        .inquiry-header h3{ font-size:22px; color:var(--navy,#1a1a2e); margin:0 0 6px; }
        .inquiry-header p{ font-size:14px; color:var(--gray,#888); margin:0; }
        .inquiry-property-card{ display:flex; gap:14px; margin:20px 28px 0; padding:14px; background:var(--off-white,#f8f8f8); border-radius:12px; border:1px solid var(--border,#e5e5e5); }
        .inquiry-property-img{ width:80px; height:64px; border-radius:8px; overflow:hidden; flex-shrink:0; }
        .inquiry-property-img img{ width:100%; height:100%; object-fit:cover; }
        .inquiry-property-info{ display:flex; flex-direction:column; justify-content:center; gap:4px; min-width:0; }
        .inquiry-property-title{ font-weight:700; font-size:14px; color:var(--navy,#1a1a2e); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .inquiry-property-location{ display:flex; align-items:center; gap:4px; font-size:12px; color:var(--gray,#888); }
        .inquiry-property-price{ font-weight:800; font-size:15px; color:var(--red,#e63946); }
        .inquiry-property-price span{ font-weight:400; font-size:12px; color:var(--gray,#888); }
        .inquiry-form{ padding:22px 28px 28px; }
        .inquiry-field{ margin-bottom:16px; }
        .inquiry-field label{ display:block; font-size:13px; font-weight:600; color:var(--navy,#1a1a2e); margin-bottom:6px; }
        .inquiry-req{ color:var(--red,#e63946); }
        .inquiry-input-wrap{ display:flex; align-items:center; gap:10px; border:1.5px solid var(--border,#e0e0e0); border-radius:10px; padding:0 14px; background:#fff; transition:border-color 0.2s,box-shadow 0.2s; }
        .inquiry-input-wrap:focus-within{ border-color:var(--red,#e63946); box-shadow:0 0 0 3px rgba(230,57,70,0.1); }
        .inquiry-input-error{ border-color:#e63946 !important; box-shadow:0 0 0 3px rgba(230,57,70,0.08) !important; }
        .inquiry-input-icon{ color:var(--gray,#999); flex-shrink:0; }
        .inquiry-input-wrap input{ flex:1; border:none; outline:none; padding:12px 0; font-size:14px; color:var(--navy,#1a1a2e); background:transparent; }
        .inquiry-input-wrap input::placeholder{ color:#bbb; }
        .inquiry-textarea-wrap{ align-items:flex-start; padding-top:12px; }
        .inquiry-textarea-icon{ margin-top:2px; }
        .inquiry-textarea-wrap textarea{ flex:1; border:none; outline:none; padding:0 0 12px; font-size:14px; color:var(--navy,#1a1a2e); background:transparent; resize:vertical; font-family:inherit; line-height:1.6; min-height:80px; }
        .inquiry-textarea-wrap textarea::placeholder{ color:#bbb; }
        .inquiry-err{ display:block; font-size:12px; color:#e63946; margin-top:5px; padding-left:2px; }
        .inquiry-submit-btn{ width:100%; justify-content:center; padding:15px; border-radius:10px; margin-top:6px; font-size:15px; font-weight:700; gap:8px; }
        .inquiry-submit-btn:disabled{ opacity:0.7; cursor:not-allowed; }
        .inquiry-spinner{ width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:inquirySpin 0.6s linear infinite; }
        @keyframes inquirySpin{ to{transform:rotate(360deg)} }
        .inquiry-success{ padding:48px 28px; text-align:center; }
        .inquiry-success-icon{ color:#22c55e; margin-bottom:18px; animation:inquiryPop 0.4s ease; }
        @keyframes inquiryPop{ 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
        .inquiry-success h3{ font-size:22px; color:var(--navy,#1a1a2e); margin:0 0 10px; }
        .inquiry-success p{ font-size:14px; color:var(--gray,#888); margin:0 0 24px; line-height:1.6; }
        .inquiry-done-btn{ display:inline-flex; padding:12px 40px; border-radius:10px; }

        @media(max-width:1024px){
          .gallery-grid{ grid-template-columns:1fr 1fr 1fr; height:clamp(260px,40vh,440px); }
          .gallery-main{ grid-column:1/3; grid-row:1/3; }
          .gallery-thumb:nth-child(n+4){ display:none; }
        }
        @media(max-width:992px){
          .property-layout{ grid-template-columns:1fr; }
          .booking-wrapper{ position:static; }
        }
        @media(max-width:768px){
          .gallery-section{ display:none; }
          .gallery-mobile{ display:block; }
          .container{ padding-left:16px !important; padding-right:16px !important; }
          .property-features{ flex-direction:column; gap:12px; }
          .amenities-grid{ grid-template-columns:1fr; }
          .review-top{ flex-direction:column; align-items:flex-start; }
          .booking-price{ font-size:34px; }
          .mobile-book-bar{ position:fixed; bottom:0; left:0; right:0; background:#fff; padding:14px 16px; display:flex; align-items:center; gap:12px; box-shadow:0 -4px 20px rgba(0,0,0,0.1); z-index:999; }
          .lb-arrow{ width:36px; height:36px; }
          .lb-arrow-left{ left:8px; } .lb-arrow-right{ right:8px; }
          .lb-img{ max-width:96%; max-height:calc(100vh - 160px); }
          .lb-thumb{ width:44px; height:34px; }
          .lb-inner{ padding:50px 10px 80px; }
          .inquiry-overlay{ align-items:flex-end; padding:0; }
          .inquiry-modal{ border-radius:20px 20px 0 0; max-height:94vh; }
          .inquiry-header{ padding:24px 20px 0; }
          .inquiry-property-card{ margin:16px 20px 0; }
          .inquiry-form{ padding:18px 20px 28px; }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetailPage;