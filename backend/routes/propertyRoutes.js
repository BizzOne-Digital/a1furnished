const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadImages,
  deleteImage,
  addReview,
  incrementViews
} = require('../controllers/propertyController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getProperties);
router.get('/:slug', getProperty);
router.post('/:id/views', incrementViews);
router.post('/:id/reviews', addReview);

// Admin routes (protected)
router.post('/', protect, adminOnly, createProperty);
router.put('/:id', protect, adminOnly, updateProperty);
router.delete('/:id', protect, adminOnly, deleteProperty);
router.post('/:id/images', protect, adminOnly, upload.array('images', 10), uploadImages);
router.delete('/:id/images/:imageId', protect, adminOnly, deleteImage);

module.exports = router;
