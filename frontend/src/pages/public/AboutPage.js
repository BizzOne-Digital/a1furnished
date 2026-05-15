import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, Star, MapPin, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))', padding: '80px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(200,16,46,0.1) 0%, transparent 60%)' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'inline-block', padding: '6px 18px', background: 'rgba(200,16,46,0.2)', borderRadius: '999px', color: 'rgba(255,255,255,0.9)', fontFamily: 'Montserrat', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', marginBottom: '20px' }}>
            🍁 ABOUT US
          </div>
          <h1 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: 'clamp(28px, 5vw, 50px)', marginBottom: '16px' }}>
            A1 Furnished Homes Canada
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Your trusted partner for premium short-term furnished housing across the Greater Toronto Area
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'Montserrat', fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: '20px' }}>Our Story</h2>
              <p style={{ color: 'var(--gray-dark)', lineHeight: 1.8, fontSize: '16px', marginBottom: '16px' }}>
                A1 Furnished Homes Canada was founded with a simple mission: to make short-term furnished housing easy, comfortable, and accessible for everyone coming to or relocating within Canada.
              </p>
              <p style={{ color: 'var(--gray-dark)', lineHeight: 1.8, fontSize: '16px', marginBottom: '16px' }}>
                Whether you're a business traveler, a newcomer to Canada, a healthcare professional on assignment, or a family in transition, we provide premium fully-furnished homes that feel just like home — only better equipped.
              </p>
              <p style={{ color: 'var(--gray-dark)', lineHeight: 1.8, fontSize: '16px', marginBottom: '28px' }}>
                With properties across Toronto, Mississauga, Brampton, and the broader GTA, we're here to ensure you have a seamless and comfortable experience from the moment you arrive.
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/properties')}>
                Browse Our Properties →
              </button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"
                alt="Furnished Home"
                style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', width: '100%', height: '380px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2>What We Stand For</h2>
            <div className="section-title-line"></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              { icon: <Shield size={32} />, title: 'Quality & Safety', desc: 'Every property is thoroughly inspected, professionally cleaned, and verified for your safety.' },
              { icon: <Star size={32} />, title: 'Premium Experience', desc: 'We select only the best properties with high-quality furniture and all essential amenities.' },
              { icon: <Clock size={32} />, title: 'Flexibility', desc: 'Short-term, monthly, or longer stays — we accommodate your timeline, no questions asked.' },
              { icon: <MapPin size={32} />, title: 'Prime Locations', desc: 'All our properties are located near transit, shopping, healthcare, and business districts.' }
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '32px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
                <div style={{ color: 'var(--red)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'Montserrat', fontSize: '17px', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '14px', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Who We Serve</h2>
            <div className="section-title-line"></div>
            <p>Our furnished homes are perfect for a wide range of guests</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { emoji: '💼', title: 'Business Travelers', desc: 'Corporate relocations and extended work assignments' },
              { emoji: '🏥', title: 'Healthcare Workers', desc: 'Medical professionals on temporary placements' },
              { emoji: '🎓', title: 'Students', desc: 'Graduate students and visiting academics' },
              { emoji: '👨‍👩‍👧', title: 'Families', desc: 'Families in transition or awaiting permanent housing' },
              { emoji: '🌏', title: 'New Immigrants', desc: 'Newcomers to Canada settling in Ontario' },
              { emoji: '🏡', title: 'Home Renovators', desc: 'Homeowners during major renovations' }
            ].map((item, i) => (
              <div key={i} style={{ padding: '24px', border: '2px solid var(--border)', borderRadius: 'var(--radius)', transition: 'var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.emoji}</div>
                <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '13px', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--navy)', padding: '70px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: 'clamp(24px, 4vw, 38px)', marginBottom: '16px' }}>
            Ready to Find Your Home?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', marginBottom: '32px' }}>
            Browse our available properties and book your perfect furnished home today
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/properties')}>View Properties</button>
            <button className="btn btn-outline-white btn-lg" onClick={() => navigate('/contact')}>Contact Us</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
