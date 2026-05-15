const Property = require('../models/Property');
const { cloudinary } = require('../config/cloudinary');

// @desc  Get all properties (with filters)
// @route GET /api/properties
exports.getProperties = async (req, res) => {
  try {
    const {
      city, bedrooms, minPrice, maxPrice, status,
      featured, search, sort, page = 1, limit = 12,
      propertyType
    } = req.query;

    const query = {};

    // Only show non-draft properties to public
    if (!req.user) {
      query.status = { $ne: 'draft' };
    }

    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    if (propertyType) query.propertyType = propertyType;
    if (status && req.user) query.status = status;
    if (featured === 'true') query.featured = true;

    if (minPrice || maxPrice) {
      query['pricing.perMonth'] = {};
      if (minPrice) query['pricing.perMonth'].$gte = parseInt(minPrice);
      if (maxPrice) query['pricing.perMonth'].$lte = parseInt(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { 'pricing.perMonth': 1 };
    if (sort === 'price_desc') sortOption = { 'pricing.perMonth': -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };
    if (sort === 'popular') sortOption = { views: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews'); // Don't return reviews in list view

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get single property by slug
// @route GET /api/properties/:slug
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create property
// @route POST /api/properties
exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Update property
// @route PUT /api/properties/:id
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({ success: true, property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Delete property
// @route DELETE /api/properties/:id
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Delete images from cloudinary
    for (const img of property.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Upload images to property
// @route POST /api/properties/:id/images
exports.uploadImages = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const newImages = req.files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      caption: req.body.captions ? req.body.captions[index] : '',
      isPrimary: property.images.length === 0 && index === 0
    }));

    property.images.push(...newImages);
    await property.save();

    res.json({ success: true, images: property.images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete image from property
// @route DELETE /api/properties/:id/images/:imageId
exports.deleteImage = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const image = property.images.id(req.params.imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Delete from cloudinary
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    image.deleteOne();
    await property.save();

    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Add review to property
// @route POST /api/properties/:id/reviews
exports.addReview = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.reviews.push(req.body);
    await property.save();

    res.status(201).json({ success: true, reviews: property.reviews });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Increment property views
// @route POST /api/properties/:id/views
exports.incrementViews = async (req, res) => {
  try {
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
