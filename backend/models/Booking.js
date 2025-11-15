import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
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
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  guests: {
    adults: {
      type: Number,
      required: [true, 'Number of adults is required'],
      min: [1, 'Must have at least 1 adult']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children cannot be negative']
    },
    infants: {
      type: Number,
      default: 0,
      min: [0, 'Infants cannot be negative']
    }
  },
  guestDetails: {
    firstName: {
      type: String,
      required: [true, 'First name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    }
  },
  pricing: {
    pricePerNight: {
      type: Number,
      required: true
    },
    nights: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    serviceFee: {
      type: Number,
      required: true
    },
    cleaningFee: {
      type: Number,
      default: 75
    },
    total: {
      type: Number,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'bank_transfer', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    paystackReference: String,
    refundReference: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  cancellationReason: String,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Validate check-out is after check-in
bookingSchema.pre('save', function(next) {
  if (this.checkOut <= this.checkIn) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

// Calculate nights
bookingSchema.virtual('nights').get(function() {
  const diffTime = Math.abs(this.checkOut - this.checkIn);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Index for date range queries
bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
