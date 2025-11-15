import Review from '../models/Review.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { propertyId, bookingId, rating, comment, categories } = req.body;

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this booking'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking: bookingId });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    // Create review
    const review = await Review.create({
      property: propertyId,
      user: req.user.id,
      booking: bookingId,
      rating,
      comment,
      categories
    });

    // Update property rating
    const property = await Property.findById(propertyId);
    const reviews = await Review.find({ property: propertyId });
    
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    property.rating = avgRating;
    property.reviewCount = reviews.length;
    await property.save();

    await review.populate('user', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reviews for a property
// @route   GET /api/reviews/:propertyId
// @access  Public
export const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'firstName lastName avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName avatar');

    // Recalculate property rating
    const property = await Property.findById(review.property);
    const reviews = await Review.find({ property: review.property });
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    property.rating = avgRating;
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const propertyId = review.property;
    await review.deleteOne();

    // Recalculate property rating
    const property = await Property.findById(propertyId);
    const reviews = await Review.find({ property: propertyId });
    
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      property.rating = avgRating;
    } else {
      property.rating = 0;
    }
    
    property.reviewCount = reviews.length;
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add host response to review
// @route   PUT /api/reviews/:id/response
// @access  Private (Host/Admin)
export const addHostResponse = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('property');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the property host
    if (
      review.property.host.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this review'
      });
    }

    review.hostResponse = {
      comment: req.body.comment,
      respondedAt: Date.now()
    };

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Host response added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
