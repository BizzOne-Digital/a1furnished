import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const IcoMenu = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IcoX = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease',
          boxShadow: scrolled
            ? '0 10px 30px rgba(15,23,42,0.08)'
            : '0 2px 10px rgba(15,23,42,0.04)'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '82px'
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            <img
              src="/logo.png"
              alt="A1 Furnished Homes"
              style={{
                width: 'auto',
                height: '62px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <ul
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              listStyle: 'none',
              gap: '8px',
              margin: 0,
              padding: 0
            }}
          >
            {navLinks.map((link) => {
              const active = location.pathname === link.to;

              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontFamily: 'Montserrat',
                      fontSize: '14px',
                      fontWeight: active ? 700 : 600,
                      color: active ? '#1b2a4a' : '#334155',
                      background: active
                        ? 'rgba(37,99,235,0.08)'
                        : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = '#1b2a4a';
                        e.currentTarget.style.background =
                          'rgba(37,99,235,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = '#334155';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Side */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {/* Desktop Button */}
        
<button
  type="button"
  className="desktop-nav"
  onClick={() => window.location.href = 'tel:+16477234567'}
  style={{
    background: '#1b2a4a',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '10px',
    fontFamily: 'Montserrat',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 8px 24px rgba(37,99,235,0.25)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = 'var(--red)';
    e.currentTarget.style.transform = 'translateY(-1px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = '#1b2a4a';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.15 6.15l1.17-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
  Call Us
</button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#0f172a',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isOpen ? <IcoX /> : <IcoMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            style={{
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              padding: '16px'
            }}
          >
            {navLinks.map((link) => {
              const active = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display: 'block',
                    padding: '14px 16px',
                    marginBottom: '6px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontFamily: 'Montserrat',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: active ? '#1b2a4a' : '#334155',
                    background: active
                      ? 'rgba(37,99,235,0.08)'
                      : 'transparent'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            <button
  type="button"
  onClick={() => window.location.href = 'tel:+16477234567'}
  style={{
    width: '100%',
    marginTop: '10px',
    background: '#1b2a4a',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '10px',
    fontFamily: 'Montserrat',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  }}
>
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.15 6.15l1.17-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
  Call Us
</button>
          </div>
        )}

        {/* Responsive */}
        <style>{`
          .mobile-menu-btn {
            display: none;
          }

          @media (max-width: 992px) {
            .desktop-nav {
              display: none !important;
            }

            .mobile-menu-btn {
              display: flex !important;
            }
          }

          @media (max-width: 768px) {
            nav .container {
              height: 72px !important;
            }

            nav img {
              height: 50px !important;
              max-width: 180px;
            }
          }

          @media (max-width: 480px) {
            nav .container {
              height: 68px !important;
            }

            nav img {
              height: 44px !important;
              max-width: 150px;
            }
          }
        `}</style>
      </nav>
    </>
  );
};

export default Navbar;