import React, { useState, useEffect } from 'react';
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
  Mail
} from 'lucide-react';
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

  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
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
          {
            url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200'
          }
        ];

  const amenityIcons = {
    wifi: '📶',
    wind: '❄️',
    thermometer: '🌡️',
    utensils: '🍳',
    shirt: '👕',
    tv: '📺',
    car: '🚗',
    dumbbell: '💪',
    bell: '🔔',
    tree: '🌳',
    flame: '🔥',
    zap: '⚡',
    monitor: '🖥️',
    home: '🏠',
    heart: '🐾'
  };

  return (
    <div>
      {/* HERO IMAGE */}
      <div
        style={{
          position: 'relative',
          height: 'clamp(260px, 45vh, 550px)',
          overflow: 'hidden',
          background: 'var(--navy-dark)'
        }}
      >
        <img
          src={allImages[currentImg]?.url}
          alt={property.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImg(i =>
                  i === 0 ? allImages.length - 1 : i - 1
                )
              }
              style={navBtnStyle('left')}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() =>
                setCurrentImg(i =>
                  i === allImages.length - 1 ? 0 : i + 1
                )
              }
              style={navBtnStyle('right')}
            >
              <ChevronRight size={20} />
            </button>

            {/* dots */}
            <div
              style={{
                position: 'absolute',
                bottom: 14,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 6
              }}
            >
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  style={{
                    width: i === currentImg ? 24 : 8,
                    height: 8,
                    borderRadius: 999,
                    border: 'none',
                    background:
                      i === currentImg
                        ? '#fff'
                        : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>

            {/* counter */}
            <div
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 999,
                fontSize: 13
              }}
            >
              {currentImg + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div
        className="container"
        style={{
          padding: '32px 20px 100px'
        }}
      >
        <div className="property-layout">
          {/* LEFT SIDE */}
          <div>
            {/* TITLE */}
            <div style={{ marginBottom: 30 }}>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                  marginBottom: 14
                }}
              >
                <span
                  className={`badge ${
                    property.status === 'available'
                      ? 'badge-success'
                      : 'badge-danger'
                  }`}
                >
                  {property.status === 'available'
                    ? '✓ Available'
                    : property.status}
                </span>

                <span className="badge badge-gray">
                  {property.propertyType}
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(26px, 5vw, 38px)',
                  marginBottom: 14,
                  lineHeight: 1.2,
                  color: 'var(--navy)'
                }}
              >
                {property.title}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  color: 'var(--gray)',
                  marginBottom: 20
                }}
              >
                <MapPin
                  size={18}
                  style={{ marginTop: 2, flexShrink: 0 }}
                />

                <span style={{ lineHeight: 1.6 }}>
                  {property.address?.street &&
                    `${property.address.street}, `}
                  {property.address?.city},{' '}
                  {property.address?.province}, Canada
                </span>
              </div>

              {/* FEATURES */}
              <div className="property-features">
                {[
                  {
                    icon: <Bed size={18} />,
                    label: `${property.bedrooms} Bedrooms`
                  },
                  {
                    icon: <Bath size={18} />,
                    label: `${property.bathrooms} Bathrooms`
                  },
                  {
                    icon: <Users size={18} />,
                    label: `Up to ${property.maxGuests} Guests`
                  }
                ].map((item, i) => (
                  <div key={i} className="feature-item">
                    <span style={{ color: 'var(--red)' }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* RATING */}
            {property.averageRating > 0 && (
              <div className="rating-box">
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={18}
                      fill={
                        s <= Math.round(property.averageRating)
                          ? '#f5a623'
                          : 'transparent'
                      }
                      color="#f5a623"
                    />
                  ))}
                </div>

                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 18
                  }}
                >
                  {property.averageRating}
                </span>

                <span style={{ color: 'var(--gray)' }}>
                  ({property.totalReviews} reviews)
                </span>
              </div>
            )}

            {/* DESCRIPTION */}
            <div style={{ marginBottom: 36 }}>
              <h2 className="section-title">
                About This Property
              </h2>

              <div
                style={{
                  lineHeight: 1.9,
                  color: 'var(--gray-dark)',
                  whiteSpace: 'pre-line'
                }}
              >
                {property.description}
              </div>
            </div>

            {/* AMENITIES */}
            {property.amenities?.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <h2 className="section-title">Amenities</h2>

                <div className="amenities-grid">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="amenity-card">
                      <span style={{ fontSize: 18 }}>
                        {amenityIcons[amenity.icon] || '✓'}
                      </span>

                      {amenity.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {property.reviews?.length > 0 && (
              <div>
                <h2 className="section-title">
                  Guest Reviews
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18
                  }}
                >
                  {property.reviews.slice(0, 5).map((review, i) => (
                    <div key={i} className="review-card">
                      <div className="review-top">
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              marginBottom: 4
                            }}
                          >
                            {review.name}
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              gap: 2
                            }}
                          >
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star
                                key={s}
                                size={13}
                                fill={
                                  s <= review.rating
                                    ? '#f5a623'
                                    : 'transparent'
                                }
                                color="#f5a623"
                              />
                            ))}
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: 13,
                            color: 'var(--gray)'
                          }}
                        >
                          {new Date(
                            review.date
                          ).toLocaleDateString('en-CA', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <p
                        style={{
                          lineHeight: 1.7,
                          color: 'var(--gray-dark)'
                        }}
                      >
                        {review.comment}
                      </p>
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
                <div className="booking-small">
                  STARTING FROM
                </div>

                <div className="booking-price">
                  $
                  {property.pricing?.perMonth?.toLocaleString()}
                </div>

                <div className="booking-small">
                  CAD / month
                </div>
              </div>

              <div style={{ padding: 24 }}>
                {[
                  {
                    label: 'Minimum Stay',
                    value: `${property.minimumStay || 30} days`
                  },
                  {
                    label: 'Utilities',
                    value: 'Included'
                  },
                  {
                    label: 'Cleaning Fee',
                    value: property.pricing?.cleaningFee
                      ? `$${property.pricing.cleaningFee}`
                      : 'Included'
                  }
                ].map((item, i) => (
                  <div key={i} className="price-row">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}

                <button
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: 18,
                    padding: 16,
                    borderRadius: 10
                  }}
                  onClick={() =>
                    navigate(`/book/${property.slug}`)
                  }
                >
                  Book This Property
                </button>

                <button
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: 12,
                    padding: 14,
                    borderRadius: 10
                  }}
                  onClick={() => setShowInquiryForm(true)}
                >
                  <Mail size={16} />
                  Send Inquiry
                </button>

                <div className="call-box">
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--gray)',
                      marginBottom: 8
                    }}
                  >
                    Have questions? Call us
                  </div>

                  <a
                    href="tel:+16477234567"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 8,
                      color: 'var(--navy)',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <Phone
                      size={16}
                      style={{ color: 'var(--red)' }}
                    />
                    +1 (647) 723-4567
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BAR */}
      <div className="mobile-book-bar">
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: 20,
              color: 'var(--navy)'
            }}
          >
            $
            {property.pricing?.perMonth?.toLocaleString()}
            <span
              style={{
                fontWeight: 400,
                fontSize: 13,
                color: 'var(--gray)'
              }}
            >
              /mo
            </span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate(`/book/${property.slug}`)}
        >
          Book Now
        </button>
      </div>

      {/* RESPONSIVE CSS */}
      <style>{`
        .property-layout{
          display:grid;
          grid-template-columns:1fr 380px;
          gap:40px;
          align-items:start;
        }

        .property-features{
          display:flex;
          flex-wrap:wrap;
          gap:18px;
        }

        .feature-item{
          display:flex;
          align-items:center;
          gap:8px;
          font-weight:600;
          color:var(--navy);
        }

        .rating-box{
          display:flex;
          align-items:center;
          gap:12px;
          padding:16px;
          background:#fffdf0;
          border-radius:12px;
          margin-bottom:32px;
          border:1px solid #f5e89a;
          flex-wrap:wrap;
        }

        .section-title{
          font-size:22px;
          margin-bottom:18px;
          color:var(--navy);
        }

        .amenities-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
          gap:14px;
        }

        .amenity-card{
          display:flex;
          align-items:center;
          gap:10px;
          padding:14px;
          background:var(--off-white);
          border-radius:10px;
          font-size:14px;
          font-weight:500;
        }

        .review-card{
          padding:20px;
          background:var(--off-white);
          border-radius:14px;
          border-left:4px solid var(--red);
        }

        .review-top{
          display:flex;
          justify-content:space-between;
          gap:12px;
          margin-bottom:12px;
        }

        .booking-wrapper{
          position:sticky;
          top:90px;
        }

        .booking-card{
          background:#fff;
          border-radius:20px;
          overflow:hidden;
          border:1px solid var(--border);
          box-shadow:var(--shadow-lg);
        }

        .booking-header{
          background:var(--navy);
          padding:26px;
          text-align:center;
        }

        .booking-small{
          color:rgba(255,255,255,0.7);
          font-size:13px;
        }

        .booking-price{
          font-size:42px;
          color:#fff;
          font-weight:900;
          line-height:1.1;
          margin:6px 0;
        }

        .price-row{
          display:flex;
          justify-content:space-between;
          gap:14px;
          padding:12px 0;
          border-bottom:1px solid var(--border);
          font-size:14px;
        }

        .call-box{
          margin-top:20px;
          padding:16px;
          border-radius:10px;
          background:var(--off-white);
          text-align:center;
        }

        .mobile-book-bar{
          display:none;
        }

        @media(max-width:992px){
          .property-layout{
            grid-template-columns:1fr;
          }

          .booking-wrapper{
            position:static;
          }
        }

        @media(max-width:768px){

          .container{
            padding-left:16px !important;
            padding-right:16px !important;
          }

          .property-features{
            flex-direction:column;
            gap:12px;
          }

          .amenities-grid{
            grid-template-columns:1fr;
          }

          .review-top{
            flex-direction:column;
            align-items:flex-start;
          }

          .booking-price{
            font-size:34px;
          }

          .mobile-book-bar{
            position:fixed;
            bottom:0;
            left:0;
            right:0;
            background:#fff;
            padding:14px 16px;
            display:flex;
            align-items:center;
            gap:12px;
            box-shadow:0 -4px 20px rgba(0,0,0,0.1);
            z-index:999;
          }
        }
      `}</style>
    </div>
  );
};

const navBtnStyle = side => ({
  position: 'absolute',
  [side]: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(255,255,255,0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
});

export default PropertyDetailPage;