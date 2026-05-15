const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  bookingRef: {
    type: String,
    unique: true
  },

  // Guest Info
  guest: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    nationality: String,
    idType: { type: String, enum: ['passport', 'drivers_license', 'national_id'] },
    idNumber: String
  },

  // Stay Details
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 }
  },
  totalNights: Number,

  // Pricing
  pricing: {
    baseAmount: Number,
    cleaningFee: Number,
    securityDeposit: Number,
    taxes: Number,
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'CAD' }
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'refunded'],
    default: 'pending'
  },

  // Payment
  payment: {
    method: { type: String, enum: ['stripe', 'etransfer', 'cash', 'bank_transfer'] },
    status: { type: String, enum: ['pending', 'partial', 'paid', 'refunded'], default: 'pending' },
    stripePaymentId: String,
    paidAmount: { type: Number, default: 0 },
    paidAt: Date
  },

  // Special Requests
  specialRequests: String,
  internalNotes: String,

  // Timestamps
  confirmedAt: Date,
  cancelledAt: Date,
  cancellationReason: String

}, { timestamps: true });

// Auto-generate booking reference
bookingSchema.pre('save', function(next) {
  if (!this.bookingRef) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ref = 'A1-';
    for (let i = 0; i < 8; i++) {
      ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.bookingRef = ref;
  }

  // Calculate total nights
  if (this.checkIn && this.checkOut) {
    const diff = this.checkOut - this.checkIn;
    this.totalNights = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
