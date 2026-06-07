const nodemailer = require('nodemailer');

// ===========================================
// ✅ Email Configuration for A1 Furnished
// ===========================================

const createTransporter = () => {
  // Check if email credentials exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ EMAIL_USER or EMAIL_PASS not set — emails will be skipped');
    return null;
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail', // gmail, outlook, yahoo, etc.
    host: process.env.EMAIL_HOST, // Optional: custom SMTP host
    port: process.env.EMAIL_PORT || 587, // Optional: custom SMTP port
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password (NOT your regular password)
    },
  });
};

// ===========================================
// Send Email Helper
// ===========================================
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('⚠️ Email skipped (no transporter) — To:', to, '| Subject:', subject);
    return { success: false, reason: 'Email not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'A1 Furnished Homes'}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || subject,
    });

    console.log('✅ Email sent:', info.messageId, '| To:', to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    return { success: false, reason: error.message };
  }
};

// ===========================================
// ✅ Notification: New Inquiry → Admin
// ===========================================
const sendInquiryNotificationToAdmin = async (inquiry) => {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_USER;

  return sendEmail({
    to: adminEmail,
    subject: `🔔 New Inquiry: ${inquiry.name} — ${inquiry.subject || 'General Inquiry'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #1a1a2e; color: #fff; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 20px;">📩 New Inquiry Received</h2>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td><td style="padding: 8px 0;">${inquiry.name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px 0;">${inquiry.phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td><td style="padding: 8px 0;">${inquiry.subject || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Type:</td><td style="padding: 8px 0;">${inquiry.type || 'general'}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f9f9f9; border-radius: 6px;">
            <p style="margin: 0 0 4px; font-weight: bold; color: #555;">Message:</p>
            <p style="margin: 0; line-height: 1.6;">${inquiry.message}</p>
          </div>
          ${inquiry.property ? `<p style="margin-top: 12px; color: #555;"><strong>Property:</strong> ${inquiry.property}</p>` : ''}
          <p style="margin-top: 20px; font-size: 13px; color: #999;">Received at: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}</p>
        </div>
      </div>
    `,
  });
};

// ===========================================
// ✅ Confirmation: Inquiry Received → Customer
// ===========================================
const sendInquiryConfirmationToCustomer = async (inquiry) => {
  return sendEmail({
    to: inquiry.email,
    subject: `Thank you for contacting A1 Furnished Homes!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #1a1a2e; color: #fff; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 20px;">A1 Furnished Homes</h2>
        </div>
        <div style="padding: 24px;">
          <p>Hi <strong>${inquiry.name}</strong>,</p>
          <p>Thank you for reaching out! We have received your inquiry and our team will get back to you within <strong>24 hours</strong>.</p>
          <div style="margin: 20px 0; padding: 16px; background: #f0f7ff; border-left: 4px solid #1a1a2e; border-radius: 4px;">
            <p style="margin: 0 0 4px; font-weight: bold;">Your Message:</p>
            <p style="margin: 0; color: #555;">${inquiry.message}</p>
          </div>
          <p>If you need immediate assistance, please call us at <strong>(416) 566-1102</strong>.</p>
          <p style="color: #555;">Best regards,<br><strong>A1 Furnished Homes Team</strong></p>
        </div>
      </div>
    `,
  });
};

// ===========================================
// ✅ Notification: New Booking → Admin
// ===========================================
const sendBookingNotificationToAdmin = async (booking, property) => {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_USER;

  const checkIn = new Date(booking.checkIn).toLocaleDateString('en-CA');
  const checkOut = new Date(booking.checkOut).toLocaleDateString('en-CA');

  return sendEmail({
    to: adminEmail,
    subject: `🏠 New Booking: ${booking.guest?.firstName} ${booking.guest?.lastName} — ${property?.title || 'Property'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #0d7c3d; color: #fff; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 20px;">🏠 New Booking Received</h2>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Booking Ref:</td><td style="padding: 8px 0;">${booking.bookingRef || booking._id}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Guest:</td><td style="padding: 8px 0;">${booking.guest?.firstName} ${booking.guest?.lastName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${booking.guest?.email}">${booking.guest?.email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px 0;">${booking.guest?.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Property:</td><td style="padding: 8px 0;">${property?.title || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Check-in:</td><td style="padding: 8px 0;">${checkIn}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Check-out:</td><td style="padding: 8px 0;">${checkOut}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Guests:</td><td style="padding: 8px 0;">${booking.guests || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Total:</td><td style="padding: 8px 0; font-size: 18px; color: #0d7c3d; font-weight: bold;">$${booking.pricing?.totalAmount?.toLocaleString()} CAD</td></tr>
          </table>
          ${booking.specialRequests ? `<div style="margin-top: 16px; padding: 12px; background: #fff8e1; border-radius: 6px;"><strong>Special Requests:</strong> ${booking.specialRequests}</div>` : ''}
          <p style="margin-top: 20px; font-size: 13px; color: #999;">Received at: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}</p>
        </div>
      </div>
    `,
  });
};

// ===========================================
// ✅ Confirmation: Booking Received → Customer
// ===========================================
const sendBookingConfirmationToCustomer = async (booking, property) => {
  if (!booking.guest?.email) return;

  const checkIn = new Date(booking.checkIn).toLocaleDateString('en-CA');
  const checkOut = new Date(booking.checkOut).toLocaleDateString('en-CA');

  return sendEmail({
    to: booking.guest.email,
    subject: `Booking Confirmation — A1 Furnished Homes (Ref: ${booking.bookingRef || booking._id})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #1a1a2e; color: #fff; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 20px;">A1 Furnished Homes — Booking Received</h2>
        </div>
        <div style="padding: 24px;">
          <p>Hi <strong>${booking.guest.firstName}</strong>,</p>
          <p>Thank you for your booking request! Here are your details:</p>
          <div style="margin: 20px 0; padding: 16px; background: #f0f7ff; border-radius: 6px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; font-weight: bold;">Reference:</td><td>${booking.bookingRef || booking._id}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Property:</td><td>${property?.title || 'N/A'}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Check-in:</td><td>${checkIn}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Check-out:</td><td>${checkOut}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Total:</td><td><strong>$${booking.pricing?.totalAmount?.toLocaleString()} CAD</strong></td></tr>
            </table>
          </div>
          <p>Our team will review your booking and confirm within <strong>24 hours</strong>. You will receive another email once confirmed.</p>
          <p style="margin-top: 20px; color: #555;">Best regards,<br><strong>A1 Furnished Homes Team</strong></p>
        </div>
      </div>
    `,
  });
};

// ===========================================
// ✅ Admin Reply → Customer (Inquiry Reply)
// ===========================================
const sendAdminReplyToCustomer = async (inquiry) => {
  if (!inquiry.email || !inquiry.adminReply) return;

  return sendEmail({
    to: inquiry.email,
    subject: `RE: Your Inquiry — A1 Furnished Homes`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #1a1a2e; color: #fff; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 20px;">A1 Furnished Homes</h2>
        </div>
        <div style="padding: 24px;">
          <p>Hi <strong>${inquiry.name}</strong>,</p>
          <p>Thank you for your inquiry. Here is our response:</p>
          <div style="margin: 20px 0; padding: 16px; background: #f0f7ff; border-left: 4px solid #1a1a2e; border-radius: 4px;">
            <p style="margin: 0; line-height: 1.6;">${inquiry.adminReply}</p>
          </div>
          <div style="margin-top: 16px; padding: 12px; background: #f9f9f9; border-radius: 6px;">
            <p style="margin: 0 0 4px; font-size: 13px; color: #999;">Your original message:</p>
            <p style="margin: 0; color: #777; font-size: 14px;">${inquiry.message}</p>
          </div>
          <p style="margin-top: 20px;">If you have any further questions, feel free to reply to this email or contact us directly.</p>
          <p style="color: #555;">Best regards,<br><strong>A1 Furnished Homes Team</strong></p>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendInquiryNotificationToAdmin,
  sendInquiryConfirmationToCustomer,
  sendBookingNotificationToAdmin,
  sendBookingConfirmationToCustomer,
  sendAdminReplyToCustomer,
};