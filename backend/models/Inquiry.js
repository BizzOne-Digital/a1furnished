const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  message: { type: String, required: true },
  moveInDate: Date,
  stayDuration: String,
  guests: Number,
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  adminReply: String,
  repliedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
