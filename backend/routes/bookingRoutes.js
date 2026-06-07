const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { protect, adminOnly } = require('../middleware/auth');
const {
  sendBookingNotificationToAdmin,
  sendBookingConfirmationToCustomer,
} = require('../config/email');

// @route POST /api/bookings - Create booking (public)
router.post('/', async (req, res) => {
  try {
    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Calculate pricing
    const checkIn = new Date(req.body.checkIn);
    const checkOut = new Date(req.body.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const months = nights / 30;

    let baseAmount;
    if (nights >= 30) {
      baseAmount = property.pricing.perMonth * months;
    } else if (nights >= 7) {
      baseAmount = property.pricing.perWeek * (nights / 7);
    } else {
      baseAmount = (property.pricing.perNight || property.pricing.perMonth / 30) * nights;
    }

    const cleaningFee = property.pricing.cleaningFee || 0;
    const securityDeposit = property.pricing.securityDeposit || 0;
    const taxes = Math.round(baseAmount * 0.13); // 13% HST Ontario
    const totalAmount = baseAmount + cleaningFee + taxes;

    const booking = await Booking.create({
      ...req.body,
      pricing: {
        baseAmount: Math.round(baseAmount),
        cleaningFee,
        securityDeposit,
        taxes,
        totalAmount: Math.round(totalAmount),
        currency: 'CAD'
      }
    });

    // Increment booking count on property
    await Property.findByIdAndUpdate(req.body.property, { $inc: { bookingCount: 1 } });

    // ✅ Send notification email to admin + confirmation to customer (non-blocking)
    Promise.allSettled([
      sendBookingNotificationToAdmin(booking, property),
      sendBookingConfirmationToCustomer(booking, property),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`❌ Booking email ${i} failed:`, r.reason);
        }
      });
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route GET /api/bookings - Get all bookings (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { bookingRef: { $regex: search, $options: 'i' } },
        { 'guest.email': { $regex: search, $options: 'i' } },
        { 'guest.firstName': { $regex: search, $options: 'i' } },
        { 'guest.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('property', 'title address images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ success: true, total, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/bookings/:id
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('property');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/bookings/:id - Update booking status (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('property');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route GET /api/bookings/check/:propertyId - Check availability
router.get('/check/:propertyId', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    const bookings = await Booking.find({
      property: req.params.propertyId,
      status: { $in: ['confirmed', 'checked_in'] },
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } }
      ]
    });

    res.json({ success: true, available: bookings.length === 0, conflictingBookings: bookings.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;