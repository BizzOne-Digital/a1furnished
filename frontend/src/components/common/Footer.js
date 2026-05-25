import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--navy-dark)', color: 'rgba(255,255,255,0.8)', marginTop: 'auto' }}>
      {/* Main footer content */}
      <div className="container" style={{ padding: '60px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px' }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '22px', color: 'white', lineHeight: 1.2 }}>
                <span style={{ color: 'var(--red)' }}>A1</span> FURNISHED
                <div style={{ fontSize: '12px', letterSpacing: '3px', fontWeight: 600, opacity: 0.7 }}>HOMES CANADA</div>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.8, marginBottom: '24px', opacity: 0.75 }}>
              Premium short-term furnished homes across the Greater Toronto Area. Your home away from home in Canada.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)',
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/properties', label: 'All Properties' },
              
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' }
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} style={{
                    fontSize: '14px', opacity: 0.75, transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                    onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.color = 'var(--red)'; }}
                    onMouseLeave={e => { e.target.style.opacity = 0.75; e.target.style.color = 'inherit'; }}
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
<div>
  <h4 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>
    Property Types
  </h4>
  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
    {[
      { label: 'Apartments', value: 'Apartment' },
      { label: 'Suites', value: 'Suite' },
      { label: 'Houses', value: 'House' },
      { label: 'Condos', value: 'Condo' },
      { label: 'Townhouses', value: 'Townhouse' },
      { label: 'Studios', value: 'Studio' },
    ].map(type => (
      <li key={type.value}>
        <Link to={`/properties?propertyType=${type.value}`} style={{
          fontSize: '14px', opacity: 0.75,
          display: 'flex', alignItems: 'center', gap: '6px'
        }}
          onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.color = 'var(--red)'; }}
          onMouseLeave={e => { e.target.style.opacity = 0.75; e.target.style.color = 'inherit'; }}
        >
          → {type.label}
        </Link>
      </li>
    ))}
  </ul>
</div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={18} style={{ color: 'var(--red)', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '14px', opacity: 0.8, lineHeight: 1.6 }}>
                  Greater Toronto Area<br />Ontario, Canada
                </span>
              </div>
              <a href="tel:+4165661102" style={{ display: 'flex', gap: '12px', fontSize: '14px', opacity: 0.8, alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--red)', flexShrink: 0 }} />
                +1 4165661102
              </a>
              <a href="mailto:nadeemrealty@gmail.com." style={{ display: 'flex', gap: '12px', fontSize: '14px', opacity: 0.8, alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--red)', flexShrink: 0 }} />
                nadeemrealty@gmail.com.
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '13px', opacity: 0.6 }}>
            © {new Date().getFullYear()} A1 Furnished Homes Canada. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cancellation Policy'].map(item => (
              <a key={item} href="#" style={{ fontSize: '13px', opacity: 0.6, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.target.style.opacity = 1}
                onMouseLeave={e => e.target.style.opacity = 0.6}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
