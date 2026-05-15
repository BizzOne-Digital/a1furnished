const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  name: String,
  icon: String
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  avatar: String
});

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  propertyType: {
    type: String,
    enum: ['Apartment', 'House', 'Condo', 'Townhouse', 'Suite', 'Studio'],
    default: 'Apartment'
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance', 'draft'],
    default: 'available'
  },
  featured: { type: Boolean, default: false },

  // Location
  address: {
    street: String,
    city: { type: String, required: true },
    province: { type: String, default: 'Ontario' },
    postalCode: String,
    country: { type: String, default: 'Canada' },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Details
  bedrooms: { type: Number, required: true, min: 0 },
  bathrooms: { type: Number, required: true, min: 1 },
  maxGuests: { type: Number, required: true, default: 2 },
  squareFeet: Number,
  floor: Number,
  parkingSpots: { type: Number, default: 0 },

  // Pricing
  pricing: {
    perMonth: { type: Number, required: true },
    perWeek: Number,
    perNight: Number,
    securityDeposit: Number,
    cleaningFee: Number,
    currency: { type: String, default: 'CAD' }
  },

  // Availability
  minimumStay: { type: Number, default: 30 }, // days
  availableFrom: { type: Date },
  availableTo: { type: Date },

  // Media
  images: [{
    url: { type: String, required: true },
    caption: String,
    isPrimary: { type: Boolean, default: false },
    publicId: String // cloudinary public id
  }],

  // Amenities
  amenities: [amenitySchema],

  // Tags for search
  tags: [String],

  // Reviews
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  // SEO
  metaTitle: String,
  metaDescription: String,

  // Contact override
  contactEmail: String,
  contactPhone: String,

  // Stats
  views: { type: Number, default: 0 },
  bookingCount: { type: Number, default: 0 }

}, { timestamps: true });

// Auto-generate slug
propertySchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + Date.now().toString(36);
  }

  // Calculate average rating
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = Math.round((total / this.reviews.length) * 10) / 10;
    this.totalReviews = this.reviews.length;
  }

  next();
});

module.exports = mongoose.model('Property', propertySchema);
