const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');
const { protect, adminOnly, superAdminOnly } = require('../middleware/auth');

// @route GET /api/admin/stats - Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalProperties,
      availableProperties,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      newInquiries,
      totalRevenue
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'available' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: { $in: ['confirmed', 'checked_in'] } }),
      Inquiry.countDocuments({ status: 'new' }),
      Booking.aggregate([
        { $match: { 'payment.status': 'paid' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
      ])
    ]);

    // Monthly bookings chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('property', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalProperties,
        availableProperties,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        newInquiries,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      monthlyBookings,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/admin/users - Get all admin users (superadmin only)
router.get('/users', protect, superAdminOnly, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/admin/users - Create admin user (superadmin only)
router.post('/users', protect, superAdminOnly, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/admin/users/:id
router.delete('/users/:id', protect, superAdminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
