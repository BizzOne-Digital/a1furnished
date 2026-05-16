import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../../components/property/PropertyCard';
import { propertyAPI } from '../../utils/api';

// ============================================================
// SVG ICON COMPONENTS — no emoji
// ============================================================
const IcoSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcoPin = ({ sz = 16 }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcoCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IcoDown = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IcoPhone = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.15 6.15l1.17-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IcoArrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcoStar = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

// Feature icons
const IcoHome = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcoWifi = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;
const IcoKey = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const IcoShield = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoSparkle = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoHeadset = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;

// Process icons
const IcoCalendar = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoCheckCircle = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IcoTruck = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;

// Stat icons
const IcoUsers = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoAward = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
const IcoClock = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoThumb = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>;

// ============================================================

const testimonials = [
  { name: 'Sarah Mitchell', role: 'Business Consultant', city: 'Toronto', avatar: 'SM', text: 'I stayed at A1 for a 3-month work assignment and it was absolutely perfect. The apartment was spotless, well-furnished, and the location was unbeatable. Would 100% recommend to anyone relocating for work.' },
  { name: 'Rahul Sharma', role: 'Software Engineer', city: 'Mississauga', avatar: 'RS', text: 'Moved from India and was worried about finding temporary housing. A1 Furnished Homes made everything so easy. Fully equipped kitchen, fast WiFi, and the team was incredibly responsive.' },
  { name: 'Jennifer & Tom', role: 'Relocating Family', city: 'Brampton', avatar: 'JT', text: 'We needed a place while our new home was being built. The 3-bedroom house was perfect for our family. Kids loved the backyard, and we felt right at home from day one.' }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchForm, setSearchForm] = useState({ city: '', bedrooms: '' });

  useEffect(() => {
    propertyAPI.getAll({ featured: true, limit: 3 })
      .then(res => setFeaturedProperties(res.data.properties))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(searchForm).forEach(([k, v]) => { if (v) params.set(k, v); });
    navigate(`/properties?${params.toString()}`);
  };

  const cities = ['Toronto', 'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Oakville'];

  const features = [
    { icon: <IcoHome />, title: 'Fully Furnished', desc: 'Every property is move-in ready with premium furniture, bedding, cookware, and all daily essentials included.' },
    { icon: <IcoWifi />, title: 'High-Speed WiFi', desc: 'Blazing-fast internet included in every property. Perfect for remote work, streaming, and staying connected.' },
    { icon: <IcoKey />, title: 'Flexible Terms', desc: 'Monthly, weekly or nightly stays — no long-term lease required. Stay as long, or as short, as you need.' },
    { icon: <IcoShield />, title: 'Verified & Safe', desc: 'Every property is personally inspected, verified, and professionally cleaned before your arrival.' },
    { icon: <IcoSparkle />, title: 'Premium Quality', desc: 'Only the best properties make our portfolio. High standards for furniture, appliances, and finishes.' },
    { icon: <IcoHeadset />, title: '24/7 Support', desc: 'Our dedicated team is always available — any time, day or night, throughout your entire stay.' }
  ];

  const steps = [
    { icon: <IcoSearch />, num: '01', title: 'Browse Properties', desc: 'Filter by city, bedrooms, price, and type to find exactly what you need.' },
    { icon: <IcoCalendar />, num: '02', title: 'Book Your Dates', desc: 'Fill in move-in date, guest details, and confirm with our simple booking form.' },
    { icon: <IcoCheckCircle />, num: '03', title: 'Get Confirmed', desc: 'Our team reviews every booking personally and confirms within 24 hours.' },
    { icon: <IcoTruck />, num: '04', title: 'Move In & Enjoy', desc: 'Get your keys on check-in day and settle into your fully furnished home.' }
  ];

  const whyStats = [
    { icon: <IcoUsers />, stat: '500+', label: 'Guests Served', desc: 'Hundreds of satisfied guests' },
    { icon: <IcoAward />, stat: '4.9/5', label: 'Guest Rating', desc: 'Consistently top-rated' },
    { icon: <IcoClock />, stat: '24h', label: 'Response Time', desc: 'Fast confirmation & support' },
    { icon: <IcoThumb />, stat: '98%', label: 'Satisfaction Rate', desc: 'Guests who recommend us' }
  ];

  return (
    <div>
      {/* ====================================================
    HERO — Full background image
==================================================== */}
<section style={{ minHeight: '92vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

  {/* Background image — full cover */}
  <div style={{
    position: 'absolute', inset: 0,
    backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1800&q=85)',
    backgroundSize: 'cover',
    backgroundPosition: 'center 30%',
  }} />

  {/* Overlay */}
  <div style={{
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(17,26,46,0.92) 0%, rgba(17,26,46,0.80) 60%, rgba(17,26,46,0.70) 100%)'
  }} />

  {/* Top accent line */}
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--red)', zIndex: 5 }} />

  <div className="container" style={{ position: 'relative', zIndex: 3, padding: '110px 24px 90px', width: '100%' }}>
    <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: 'rgba(200,16,46,0.15)', border: '1px solid rgba(200,16,46,0.45)',
        padding: '7px 18px', borderRadius: '999px', marginBottom: '30px'
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--red)"><path d="M17 8C8 10 5.9 16.17 3.82 19.82a2.83 2.83 0 0 0 3.39 4.06c4.24-2.44 9-6 10.77-12.88"/></svg>
        <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: '12px', fontFamily: 'Montserrat', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
          Premium Furnished Homes — Canada
        </span>
      </div>

      {/* Headline */}
      <h1 style={{ fontSize: 'clamp(38px, 6vw, 68px)', color: 'white', fontFamily: 'Montserrat', fontWeight: 900, lineHeight: 1.08, marginBottom: '22px', letterSpacing: '-0.5px' }}>
        Your Perfect<br />
        <span style={{ color: 'var(--red)' }}>Furnished Home</span><br />
        <span style={{ fontWeight: 400, fontSize: '0.74em', color: 'rgba(255,255,255,0.82)' }}>Across the GTA</span>
      </h1>

      <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', margin: '0 auto 36px', lineHeight: 1.78, maxWidth: '500px' }}>
        Move-in ready furnished apartments, suites, and houses with all utilities included.
        No long-term lease. No hassle. Just home.
      </p>

      {/* Search bar */}
      <form onSubmit={handleSearch}>
        <div style={{
          background: 'white', borderRadius: '14px', padding: '7px',
          display: 'flex', flexWrap: 'wrap', gap: '7px',
          boxShadow: '0 28px 70px rgba(0,0,0,0.45)',
          margin: '0 auto 22px', maxWidth: '570px'
        }}>
          <div style={{ flex: '1', minWidth: '155px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', pointerEvents: 'none' }}>
              <IcoPin sz={15} />
            </div>
            <select value={searchForm.city} onChange={e => setSearchForm(p => ({ ...p, city: e.target.value }))}
              style={{ width: '100%', padding: '13px 10px 13px 34px', border: 'none', background: 'var(--off-white)', borderRadius: '8px', fontSize: '14px', fontFamily: 'Lato', color: 'var(--text)', appearance: 'none', cursor: 'pointer' }}>
              <option value="">Select City</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: '1', minWidth: '130px' }}>
            <select value={searchForm.bedrooms} onChange={e => setSearchForm(p => ({ ...p, bedrooms: e.target.value }))}
              style={{ width: '100%', padding: '13px 10px', border: 'none', background: 'var(--off-white)', borderRadius: '8px', fontSize: '14px', fontFamily: 'Lato', color: 'var(--text)', appearance: 'none', cursor: 'pointer' }}>
              <option value="">Any Bedrooms</option>
              {[0,1,2,3,4].map(n => <option key={n} value={n}>{n === 0 ? 'Studio' : `${n} Bed${n > 1 ? 's' : ''}`}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '13px 26px', borderRadius: '8px', gap: '8px' }}>
            <IcoSearch /> Search
          </button>
        </div>
      </form>

      {/* Trust badges */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['All Utilities Included', 'No Long-term Lease', 'Instant Booking'].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontFamily: 'Montserrat', fontWeight: 600 }}>
            <span style={{ color: '#4ade80', display: 'flex' }}><IcoCheck /></span>
            {item}
          </div>
        ))}
      </div>

    </div>
  </div>

  {/* Floating stats card — desktop only */}
  <div style={{ position: 'absolute', right: '48px', bottom: '70px', background: 'white', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'none', zIndex: 4 }} className="hero-card">
    <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '28px', color: 'var(--navy)', lineHeight: 1 }}>50<span style={{ color: 'var(--red)' }}>+</span></div>
    <div style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '12px' }}>Properties Available</div>
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {[1,2,3,4,5].map(s => <IcoStar key={s} />)}
      <span style={{ color: 'var(--gray)', fontSize: '12px', marginLeft: '4px' }}>4.9 avg</span>
    </div>
  </div>

  {/* Scroll hint */}
  <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.35)', animation: 'heroBounce 2s infinite', zIndex: 3, cursor: 'pointer' }}
    onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}>
    <IcoDown />
  </div>

  <style>{`
    @keyframes heroBounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
    @media(min-width:1100px){.hero-card{display:block !important}}
    @media(max-width:640px){.stats-bar-grid{grid-template-columns:1fr 1fr !important}}
  `}</style>
</section>

      {/* ====================================================
          STATS BAR — red strip
      ==================================================== */}
      <section style={{ background: 'var(--red)', padding: '22px 0' }}>
        <div className="container">
          <div className="stats-bar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', textAlign: 'center' }}>
            {[
              { n: '50+', l: 'Properties' },
              { n: '500+', l: 'Happy Guests' },
              { n: '4.9★', l: 'Avg Rating' },
              { n: '5+', l: 'Years Experience' }
            ].map((s, i) => (
              <div key={i} style={{ padding: '6px 12px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.22)' : 'none' }}>
                <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '26px', color: 'white', lineHeight: 1 }}>{s.n}</div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', marginTop: '4px', fontFamily: 'Montserrat', fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          FEATURED PROPERTIES
      ==================================================== */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header">
            <p style={{ color: 'var(--red)', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>HAND-PICKED FOR YOU</p>
            <h2>Featured Properties</h2>
            <div className="section-title-line" />
            <p>Premium furnished homes in top GTA locations — selected for quality, comfort, and value.</p>
          </div>

          {loading ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : (
            <>
              <div className="properties-grid">
{(featuredProperties || []).map(p => (
  <PropertyCard key={p._id} property={p} />
))}              </div>
              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <button onClick={() => navigate('/properties')} className="btn btn-secondary btn-lg">
                  View All Properties &nbsp;<IcoArrow />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ====================================================
          HOW IT WORKS
      ==================================================== */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <p style={{ color: 'var(--red)', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>SIMPLE PROCESS</p>
            <h2>How It Works</h2>
            <div className="section-title-line" />
            <p>Book your furnished home in minutes — just 4 simple steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 20px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: i % 2 === 0 ? 'var(--navy)' : 'var(--red)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', marginBottom: '20px', position: 'relative',
                  boxShadow: `0 12px 30px ${i % 2 === 0 ? 'rgba(26,39,68,0.22)' : 'rgba(200,16,46,0.3)'}`
                }}>
                  {step.icon}
                  <div style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'white', border: '2px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Montserrat', fontWeight: 900, fontSize: '10px', color: 'var(--navy)'
                  }}>{step.num}</div>
                </div>
                <h3 style={{ fontFamily: 'Montserrat', fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: 'var(--navy)' }}>{step.title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '14px', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <button onClick={() => navigate('/properties')} className="btn btn-primary btn-lg">
              Find My Home &nbsp;<IcoArrow />
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================
          WHY CHOOSE US — image + content
      ==================================================== */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="why-grid">

            {/* Image collage */}
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: '14px' }}>
              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" alt="Living Room"
                style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '16px', gridRow: '1 / 3' }} />
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80" alt="Kitchen"
                style={{ width: '100%', height: '118px', objectFit: 'cover', borderRadius: '12px' }} />
              <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80" alt="Bedroom"
                style={{ width: '100%', height: '118px', objectFit: 'cover', borderRadius: '12px' }} />
              {/* floating badge */}
              <div style={{ position: 'absolute', bottom: '-18px', left: '20px', background: 'var(--red)', color: 'white', padding: '14px 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(200,16,46,0.4)', fontFamily: 'Montserrat' }}>
                <div style={{ fontWeight: 900, fontSize: '22px' }}>500+</div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Happy Guests</div>
              </div>
            </div>

            {/* Content */}
            <div style={{ paddingBottom: '20px' }}>
              <p style={{ color: 'var(--red)', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '12px' }}>WHY CHOOSE US</p>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', marginBottom: '16px', lineHeight: 1.2 }}>
                We Make Short-Term<br />Living Feel Like Home
              </h2>
              <p style={{ color: 'var(--gray)', fontSize: '16px', lineHeight: 1.82, marginBottom: '28px' }}>
                At A1 Furnished Homes, we go beyond just providing a roof. Every detail is curated — from premium mattresses and quality cookware to fast WiFi and a round-the-clock support team.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                {whyStats.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'white', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '18px', color: 'var(--navy)' }}>{item.stat}</div>
                      <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '12px', color: 'var(--navy)', marginBottom: '1px' }}>{item.label}</div>
                      <div style={{ color: 'var(--gray)', fontSize: '11px' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/about')} className="btn btn-primary">
                Learn More About Us &nbsp;<IcoArrow />
              </button>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.why-grid{grid-template-columns:1fr !important}}`}</style>
      </section>

      {/* ====================================================
          FEATURES GRID
      ==================================================== */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <p style={{ color: 'var(--red)', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>WHAT'S INCLUDED</p>
            <h2>Everything You Need, Included</h2>
            <div className="section-title-line" />
            <p>Every A1 property comes fully equipped — focus on settling in, not shopping</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(278px, 1fr))', gap: '22px' }}>
            {features.map((f, i) => (
              <div key={i}
                style={{ padding: '32px 28px', background: 'white', border: '2px solid var(--border)', borderRadius: 'var(--radius)', transition: 'var(--transition)', cursor: 'default' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--red)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(200,16,46,0.12)';
                  e.currentTarget.querySelector('.fi').style.background = 'var(--red)';
                  e.currentTarget.querySelector('.fi').style.color = 'white';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.querySelector('.fi').style.background = '#eef1fa';
                  e.currentTarget.querySelector('.fi').style.color = 'var(--navy)';
                }}
              >
                <div className="fi" style={{ width: '58px', height: '58px', borderRadius: '14px', background: '#eef1fa', color: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', transition: 'all 0.3s' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '17px', fontFamily: 'Montserrat', fontWeight: 700, marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '14px', lineHeight: 1.78 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          TESTIMONIALS — dark section
      ==================================================== */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div className="section-header">
            <p style={{ color: 'var(--red)', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>GUEST REVIEWS</p>
            <h2 style={{ color: 'white' }}>What Our Guests Say</h2>
            <div className="section-title-line" />
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Real experiences from people who called A1 Furnished Homes their home</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))', gap: '22px' }}>
            {testimonials.map((t, i) => (
              <div key={i}
                style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(200,16,46,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.055)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                  {[1,2,3,4,5].map(s => <IcoStar key={s} />)}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.83)', fontSize: '15px', lineHeight: 1.78, marginBottom: '22px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 800, fontSize: '13px', flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ color: 'white', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '14px' }}>{t.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.48)', fontSize: '12px' }}>{t.role} · {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          CITIES
      ==================================================== */}
      <section style={{ background: 'var(--off-white)', padding: '60px 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '36px' }}>
            <p style={{ color: 'var(--red)', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>SERVICE AREA</p>
            <h2>We Serve Across the GTA</h2>
            <div className="section-title-line" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {cities.map(city => (
              <button key={city} onClick={() => navigate(`/properties?city=${city}`)}
                style={{ padding: '12px 26px', background: 'white', border: '2px solid var(--border)', borderRadius: '10px', color: 'var(--navy)', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--navy)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <span style={{ color: 'var(--red)' }}><IcoPin sz={14} /></span>
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          FINAL CTA
      ==================================================== */}
      <section style={{ background: 'linear-gradient(130deg, var(--navy-dark) 0%, var(--navy) 55%, #1e3a6e 100%)', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '340px', height: '340px', borderRadius: '50%', background: 'rgba(200,16,46,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-90px', left: '-50px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(200,16,46,0.18)', border: '1px solid rgba(200,16,46,0.4)', padding: '6px 16px', borderRadius: '999px', marginBottom: '24px' }}>
            <svg width="8" height="8" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="var(--red)"/></svg>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', fontFamily: 'Montserrat', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Available Now</span>
          </div>

          <h2 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: 'clamp(26px, 4vw, 46px)', fontWeight: 900, marginBottom: '16px', lineHeight: 1.15 }}>
            Ready to Find Your<br /><span style={{ color: 'var(--red)' }}>Perfect Home</span> in Canada?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: '17px', maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.75 }}>
            Browse our available properties or speak with our team to find the right furnished home for your stay.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/properties')} className="btn btn-primary btn-lg">
              Browse All Properties &nbsp;<IcoArrow />
            </button>
            <button onClick={() => navigate('/contact')} className="btn btn-outline-white btn-lg">
              <IcoPhone /> &nbsp;Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
