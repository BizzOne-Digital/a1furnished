import React from 'react';
import { Link } from 'react-router-dom';

// SVG Icons — no emoji
const IcoBed = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
  </svg>
);
const IcoBath = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/>
  </svg>
);
const IcoUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IcoStar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IcoArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const PropertyCard = ({ property }) => {
  const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];

  const statusConfig = {
    available: { label: 'Available', bg: '#d1fae5', color: '#065f46' },
    booked:    { label: 'Booked',    bg: '#fee2e2', color: '#991b1b' },
    maintenance: { label: 'Maintenance', bg: '#fef3c7', color: '#92400e' }
  };
  const sc = statusConfig[property.status] || statusConfig.available;

  return (
    <Link to={`/properties/${property.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: 'white',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 4px 18px rgba(26,39,68,0.07)',
        border: '1px solid var(--border)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 20px 50px rgba(26,39,68,0.14)';
          e.currentTarget.style.borderColor = 'rgba(200,16,46,0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 4px 18px rgba(26,39,68,0.07)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: '235px', overflow: 'hidden', background: 'var(--gray-light)' }}>
          <img
            src={primaryImage?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'}
            alt={property.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'none'}
          />

          {/* Status badge */}
          <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
            <span style={{ background: sc.bg, color: sc.color, padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontFamily: 'Montserrat', fontWeight: 700 }}>
              {sc.label}
            </span>
          </div>

          {/* Featured badge */}
          {property.featured && (
            <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
              <span style={{ background: 'var(--navy)', color: 'white', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontFamily: 'Montserrat', fontWeight: 700 }}>
                Featured
              </span>
            </div>
          )}

          {/* Price overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(17,26,46,0.7))',
            padding: '28px 16px 12px'
          }}>
            <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '20px', color: 'white' }}>
              ${property.pricing?.perMonth?.toLocaleString()}
              <span style={{ fontWeight: 400, fontSize: '13px', opacity: 0.85 }}> CAD/mo</span>
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 20px 20px' }}>
          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gray)', fontSize: '12px', marginBottom: '7px', fontFamily: 'Montserrat', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span style={{ color: 'var(--red)' }}><IcoPin /></span>
            {property.address?.city}, Ontario
          </div>

          {/* Title */}
          <h3 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '16px', color: 'var(--navy)', marginBottom: '12px', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {property.title}
          </h3>

          {/* Features row */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
            {[
              { icon: <IcoBed />, label: `${property.bedrooms} ${property.bedrooms === 1 ? 'Bed' : 'Beds'}` },
              { icon: <IcoBath />, label: `${property.bathrooms} ${property.bathrooms === 1 ? 'Bath' : 'Baths'}` },
              { icon: <IcoUsers />, label: `${property.maxGuests} Guests` }
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--gray-dark)', fontSize: '13px', fontFamily: 'Montserrat', fontWeight: 500 }}>
                <span style={{ color: 'var(--navy)', opacity: 0.6 }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Rating */}
            {property.averageRating > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <IcoStar />
                <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '13px', color: 'var(--navy)' }}>{property.averageRating}</span>
                <span style={{ color: 'var(--gray)', fontSize: '12px' }}>({property.totalReviews})</span>
              </div>
            ) : (
              <span style={{ color: 'var(--gray)', fontSize: '12px' }}>{property.propertyType}</span>
            )}

            {/* CTA */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'var(--navy)', color: 'white',
              padding: '7px 16px', borderRadius: '8px',
              fontFamily: 'Montserrat', fontWeight: 700, fontSize: '12px',
              transition: 'background 0.2s'
            }}>
              View Details <IcoArrow />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
