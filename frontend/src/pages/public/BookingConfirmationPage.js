import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../utils/api';
import { CheckCircle, Home, Phone } from 'lucide-react';

const BookingConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  // Just show a success page - public users can't fetch booking details
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--off-white)', padding: '40px 24px' }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
        <div style={{
          width: '90px', height: '90px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #4ade80, #16a34a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px', boxShadow: '0 10px 40px rgba(74,222,128,0.4)'
        }}>
          <CheckCircle size={48} color="white" />
        </div>

        <h1 style={{ fontFamily: 'Montserrat', fontSize: '30px', color: 'var(--navy)', marginBottom: '12px' }}>
          Booking Request Submitted!
        </h1>

        <p style={{ color: 'var(--gray)', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px' }}>
          Thank you for choosing A1 Furnished Homes Canada! Your booking request has been received.
          Our team will review it and confirm within <strong>24 hours</strong>.
          You will receive a confirmation email shortly.
        </p>

        <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '24px', marginBottom: '28px', boxShadow: 'var(--shadow)', textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'Montserrat', fontSize: '15px', marginBottom: '16px', color: 'var(--navy)' }}>What happens next?</h3>
          {[
            { step: '1', text: 'Our team reviews your booking request' },
            { step: '2', text: 'You receive a confirmation email within 24 hours' },
            { step: '3', text: 'We send payment instructions and move-in details' },
            { step: '4', text: 'Get your keys and move in on your check-in date!' }
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', gap: '14px', marginBottom: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--navy)', color: 'white', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Montserrat', fontWeight: 700, fontSize: '13px'
              }}>{item.step}</div>
              <span style={{ fontSize: '14px', color: 'var(--gray-dark)', lineHeight: 1.5, paddingTop: '5px' }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/properties')}>
            <Home size={16} /> Browse More Properties
          </button>
          <a href="tel:+16477234567" className="btn btn-secondary">
            <Phone size={16} /> Call Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
