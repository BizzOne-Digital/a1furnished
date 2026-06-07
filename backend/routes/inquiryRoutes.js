const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect, adminOnly } = require('../middleware/auth');
const {
  sendInquiryNotificationToAdmin,
  sendInquiryConfirmationToCustomer,
  sendAdminReplyToCustomer,
} = require('../config/email');

// @route POST /api/inquiries - Submit inquiry (public)
router.post('/', async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    // ✅ Send notification email to admin + confirmation to customer (non-blocking)
    Promise.allSettled([
      sendInquiryNotificationToAdmin(inquiry),
      sendInquiryConfirmationToCustomer(inquiry),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`❌ Email ${i} failed:`, r.reason);
        }
      });
    });

    res.status(201).json({ success: true, inquiry, message: 'Your inquiry has been submitted. We will contact you shortly!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route GET /api/inquiries - Get all inquiries (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .populate('property', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ success: true, total, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/inquiries/:id - Update inquiry (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (req.body.adminReply) {
      req.body.status = 'replied';
      req.body.repliedAt = new Date();
    }
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // ✅ If admin replied, send reply email to customer (non-blocking)
    if (req.body.adminReply && inquiry) {
      sendAdminReplyToCustomer(inquiry).catch((err) =>
        console.error('❌ Reply email failed:', err.message)
      );
    }

    res.json({ success: true, inquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;