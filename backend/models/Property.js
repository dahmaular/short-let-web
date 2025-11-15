import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['entire-place', 'private-room', 'shared-room']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: String,
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    zipCode: String,
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  images: [{
    type: String,
    required: true
  }],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amenities: [{
    type: String
  }],
  maxGuests: {
    type: Number,
    required: [true, 'Maximum guests is required'],
    min: [1, 'Must allow at least 1 guest']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  beds: {
    type: Number,
    required: [true, 'Number of beds is required'],
    min: [1, 'Must have at least 1 bed']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0.5, 'Must have at least half a bathroom']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  instantBook: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['Beach', 'City', 'Mountain', 'Lake', 'Tropical', 'Countryside', 'Villa', 'Cabin']
  },
  houseRules: [{
    type: String
  }],
  unavailableDates: [{
    type: Date
  }],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews
propertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'property'
});

// Index for location-based searches
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ price: 1, rating: -1 });
propertySchema.index({ featured: -1, rating: -1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;
