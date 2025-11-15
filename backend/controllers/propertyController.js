import Property from '../models/Property.js';

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const {
      search,
      city,
      minPrice,
      maxPrice,
      type,
      minRating,
      amenities,
      category,
      sortBy = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    const query = { status: 'active' };

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by city
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Filter by property type
    if (type) {
      query.type = type;
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Filter by amenities
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const properties = await Property.find(query)
      .populate('host', 'firstName lastName avatar verified')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('host', 'firstName lastName avatar verified joinedDate')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'firstName lastName avatar'
        }
      });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private (Host/Admin)
export const createProperty = async (req, res) => {
  try {
    // Add host to property
    req.body.host = req.user.id;

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Host/Admin)
export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user owns the property
    if (
      property.host.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Host/Admin)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user owns the property
    if (
      property.host.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
export const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ featured: true, status: 'active' })
      .populate('host', 'firstName lastName avatar verified')
      .limit(6)
      .sort('-rating');

    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
