import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Users, Star, Wifi, Car, ChevronLeft, ChevronRight, Heart, Share2, Phone, Mail } from 'lucide-react';
import { propertyAPI } from '../../utils/api';

const PropertyDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  useEffect(() => {
    propertyAPI.getBySlug(slug)
      .then(res => {
        setProperty(res.data.property);
        propertyAPI.incrementViews(res.data.property._id).catch(() => {});
      })
      .catch(() => navigate('/properties'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="loading-screen" style={{ minHeight: '80vh' }}>
      <div className="spinner"></div>
      <p>Loading property...</p>
    </div>
  );

  if (!property) return null;

  const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];
  const allImages = property.images?.length > 0 ? property.images : [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200' }];

  const amenityIcons = {
    wifi: '📶', wind: '❄️', thermometer: '🌡️', utensils: '🍳',
    shirt: '👕', tv: '📺', car: '🚗', dumbbell: '💪',
    bell: '🔔', tree: '🌳', flame: '🔥', zap: '⚡', monitor: '🖥️', home: '🏠', heart: '🐾'
  };

  return (
    <div>
      {/* Image Gallery */}
      <div style={{ position: 'relative', height: 'clamp(300px, 50vh, 550px)', background: 'var(--navy-dark)', overflow: 'hidden' }}>
        <img
          src={allImages[currentImg]?.url}
          alt={property.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
        />

        {/* Gallery Controls */}
        {allImages.length > 1 && (
          <>
            <button onClick={() => setCurrentImg(i => i === 0 ? allImages.length - 1 : i - 1)}
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentImg(i => i === allImages.length - 1 ? 0 : i + 1)}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              <ChevronRight size={20} />
            </button>

            {/* Thumbnail dots */}
            <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
              {allImages.map((_, i) => (
                <button key={i} onClick={() => setCurrentImg(i)} style={{ width: i === currentImg ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === currentImg ? 'white' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
              ))}
            </div>

            {/* Image counter */}
            <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontFamily: 'Montserrat', fontWeight: 600 }}>
              {currentImg + 1} / {allImages.length}
            </div>
          </>
        )}

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div style={{ position: 'absolute', bottom: '40px', left: '16px', display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: 'calc(100% - 32px)' }}>
            {allImages.slice(0, 6).map((img, i) => (
              <img key={i} src={img.url} alt="" onClick={() => setCurrentImg(i)}
                style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: i === currentImg ? '2px solid white' : '2px solid transparent', flexShrink: 0 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>

          {/* Left Column */}
          <div>
            {/* Title & Info */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className={`badge ${property.status === 'available' ? 'badge-success' : 'badge-danger'}`}>
                  {property.status === 'available' ? '✓ Available' : property.status}
                </span>
                <span className="badge badge-gray">{property.propertyType}</span>
              </div>

              <h1 style={{ fontFamily: 'Montserrat', fontSize: 'clamp(22px, 4vw, 34px)', marginBottom: '12px', color: 'var(--navy)' }}>
                {property.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gray)', marginBottom: '16px' }}>
                <MapPin size={16} />
                <span>{property.address?.street && `${property.address.street}, `}{property.address?.city}, {property.address?.province}, Canada</span>
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[
                  { icon: <Bed size={18} />, label: `${property.bedrooms} ${property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}` },
                  { icon: <Bath size={18} />, label: `${property.bathrooms} ${property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}` },
                  { icon: <Users size={18} />, label: `Up to ${property.maxGuests} Guests` },
                  ...(property.squareFeet ? [{ icon: '📐', label: `${property.squareFeet} sqft` }] : [])
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--navy)', fontFamily: 'Montserrat', fontWeight: 600, fontSize: '15px' }}>
                    <span style={{ color: 'var(--red)' }}>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            {property.averageRating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#fffdf0', borderRadius: '10px', marginBottom: '32px', border: '1px solid #f5e89a' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={18} fill={s <= Math.round(property.averageRating) ? '#f5a623' : 'transparent'} color="#f5a623" />
                  ))}
                </div>
                <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '18px' }}>{property.averageRating}</span>
                <span style={{ color: 'var(--gray)' }}>({property.totalReviews} verified reviews)</span>
              </div>
            )}

            {/* Description */}
            <div style={{ marginBottom: '36px' }}>
              <h2 style={{ fontFamily: 'Montserrat', fontSize: '20px', marginBottom: '16px' }}>About This Property</h2>
              <div style={{ color: 'var(--gray-dark)', lineHeight: 1.8, fontSize: '16px', whiteSpace: 'pre-line' }}>
                {property.description}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div style={{ marginBottom: '36px' }}>
                <h2 style={{ fontFamily: 'Montserrat', fontSize: '20px', marginBottom: '20px' }}>Amenities</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  {property.amenities.map((amenity, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 16px', background: 'var(--off-white)',
                      borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--navy)'
                    }}>
                      <span style={{ fontSize: '18px' }}>{amenityIcons[amenity.icon] || '✓'}</span>
                      {amenity.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {property.reviews?.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'Montserrat', fontSize: '20px', marginBottom: '20px' }}>Guest Reviews</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {property.reviews.slice(0, 5).map((review, i) => (
                    <div key={i} style={{ padding: '20px', background: 'var(--off-white)', borderRadius: '12px', borderLeft: '3px solid var(--red)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '15px' }}>{review.name}</div>
                          <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                            {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= review.rating ? '#f5a623' : 'transparent'} color="#f5a623" />)}
                          </div>
                        </div>
                        <span style={{ color: 'var(--gray)', fontSize: '13px' }}>
                          {new Date(review.date).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p style={{ color: 'var(--gray-dark)', fontSize: '15px', lineHeight: 1.6 }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              {/* Pricing Header */}
              <div style={{ background: 'var(--navy)', padding: '24px', textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: 'Montserrat', marginBottom: '4px' }}>STARTING FROM</div>
                <div style={{ color: 'white', fontFamily: 'Montserrat', fontWeight: 900, fontSize: '38px', lineHeight: 1 }}>
                  ${property.pricing?.perMonth?.toLocaleString()}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '4px' }}>CAD / month</div>
                {property.pricing?.perNight && (
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginTop: '6px' }}>
                    ${property.pricing.perNight} / night · ${property.pricing.perWeek?.toLocaleString()} / week
                  </div>
                )}
              </div>

              <div style={{ padding: '24px' }}>
                {/* Pricing breakdown */}
                <div style={{ marginBottom: '20px' }}>
                  {[
                    { label: 'Minimum Stay', value: `${property.minimumStay || 30} days` },
                    { label: 'Security Deposit', value: property.pricing?.securityDeposit ? `$${property.pricing.securityDeposit.toLocaleString()} CAD` : 'Contact us' },
                    { label: 'Cleaning Fee', value: property.pricing?.cleaningFee ? `$${property.pricing.cleaningFee} CAD` : 'Included' },
                    { label: 'Utilities', value: 'Included' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
                      <span style={{ color: 'var(--gray)' }}>{item.label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--navy)', fontFamily: 'Montserrat' }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {property.status === 'available' ? (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '16px', borderRadius: '10px', marginBottom: '12px' }}
                    onClick={() => navigate(`/book/${property.slug}`)}
                  >
                    Book This Property
                  </button>
                ) : (
                  <button className="btn" style={{ width: '100%', justifyContent: 'center', padding: '16px', background: 'var(--gray-light)', color: 'var(--gray)', borderRadius: '10px', marginBottom: '12px', cursor: 'not-allowed', fontFamily: 'Montserrat', fontWeight: 600 }} disabled>
                    Currently Unavailable
                  </button>
                )}

                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', borderRadius: '10px' }}
                  onClick={() => setShowInquiryForm(true)}
                >
                  <Mail size={16} /> Send Inquiry
                </button>

                <div style={{ marginTop: '20px', padding: '14px', background: 'var(--off-white)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '8px' }}>Have questions? Call us</div>
                  <a href="tel:+16477234567" style={{ fontFamily: 'Montserrat', fontWeight: 700, color: 'var(--navy)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Phone size={16} style={{ color: 'var(--red)' }} />
                    +1 (647) 723-4567
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '16px 24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', display: 'none', zIndex: 50 }} className="mobile-book-bar">
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: '20px', color: 'var(--navy)' }}>${property.pricing?.perMonth?.toLocaleString()}<span style={{ fontWeight: 400, fontSize: '13px', color: 'var(--gray)' }}>/mo</span></div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate(`/book/${property.slug}`)}>Book Now</button>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .mobile-book-bar { display: block !important; } }`}</style>
    </div>
  );
};

export default PropertyDetailPage;
