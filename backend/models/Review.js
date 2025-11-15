import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
  rating: {
    type: Number,
    required: [true, 'Overall rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  categories: {
    cleanliness: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    accuracy: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    communication: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    location: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    checkIn: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    value: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    }
  },
  hostResponse: {
    comment: String,
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Ensure one review per booking
reviewSchema.index({ booking: 1 }, { unique: true });
reviewSchema.index({ property: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
