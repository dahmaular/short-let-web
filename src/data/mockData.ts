import type { Property, Review } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Codakraft Apartment - Modern Living at Its Finest',
    description: 'Discover exceptional comfort in this beautifully designed luxury apartment. Featuring contemporary interiors, premium amenities, and elegant furnishings throughout. Perfect for families, groups, or extended stays seeking a home away from home with hotel-quality service.',
    type: 'entire-place',
    price: 350,
    location: {
      city: 'Lagos',
      country: 'Nigeria',
      address: 'Premium Residential Area',
      coordinates: { lat: 6.5244, lng: 3.3792 }
    },
    images: [
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407635/1_cpaaj4.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407730/2_vtceaj.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407739/3_ojshqf.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407740/4_x5s5k8.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407741/5_wd5cq1.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407742/6_isql1x.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407743/7_wx9mzl.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407744/8_ggcju8.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407746/9_ez1syl.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407679/10_k4hlxw.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407678/11_nl4qev.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407678/12_blujcv.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407680/14_opjm8v.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407680/16_leq6bk.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407729/18_qjkbr9.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407731/20_vhqvmx.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407732/21_i7se8r.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407733/22_eyaya7.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407733/23_wt61vo.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407734/24_jnewrz.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407737/25_dciogh.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407736/26_kigbb5.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407737/27_kht2q6.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407738/28_rhch2e.jpg',
      'https://res.cloudinary.com/dgslbycvk/image/upload/v1762407739/29_prdgwp.jpg'
    ],
    host: {
      id: 'h1',
      name: 'Codakraft Hospitality',
      avatar: 'https://i.pravatar.cc/150?img=1',
      verified: true,
      joinedDate: '2024-01-15'
    },
    amenities: ['WiFi', 'Kitchen', 'Free Parking', 'Air Conditioning', 'TV', 'Washer', 'Dryer', 'Workspace', 'City View', 'Elevator', 'Heating', 'Patio'],
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    rating: 5.0,
    reviewCount: 48,
    instantBook: true,
    category: 'City',
    houseRules: ['No smoking', 'No parties or events', 'Check-in after 2 PM', 'Check-out before 12 PM', 'Quiet hours: 10 PM - 7 AM'],
    unavailableDates: [],
    featured: true
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    propertyId: '1',
    userId: 'u1',
    userName: 'Chinedu Okafor',
    userAvatar: 'https://i.pravatar.cc/150?img=33',
    rating: 5,
    comment: 'Absolutely stunning apartment! The modern design and attention to detail exceeded our expectations. Everything was spotless and the location was perfect. Codakraft Hospitality was incredibly responsive and helpful throughout our stay.',
    date: '2025-10-15',
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5
    }
  },
  {
    id: 'r2',
    propertyId: '1',
    userId: 'u2',
    userName: 'Amaka Johnson',
    userAvatar: 'https://i.pravatar.cc/150?img=45',
    rating: 5,
    comment: 'Perfect for our family vacation! The apartment had everything we needed and more. The kids loved the spacious living areas and we appreciated the fully equipped kitchen. Highly recommend!',
    date: '2025-09-28',
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5
    }
  },
  {
    id: 'r3',
    propertyId: '1',
    userId: 'u3',
    userName: 'Michael Adebayo',
    userAvatar: 'https://i.pravatar.cc/150?img=52',
    rating: 5,
    comment: 'Exceptional property! The photos don\'t do it justice. The apartment is even more beautiful in person. Great amenities, comfortable beds, and the host was wonderful. Will definitely book again!',
    date: '2025-09-10',
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5
    }
  },
  {
    id: 'r4',
    propertyId: '1',
    userId: 'u4',
    userName: 'Sarah Williams',
    userAvatar: 'https://i.pravatar.cc/150?img=20',
    rating: 5,
    comment: 'Best accommodation experience in Lagos! The apartment is luxurious, clean, and perfectly located. Check-in was seamless and the host provided excellent recommendations for local restaurants.',
    date: '2025-08-25',
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5
    }
  }
];

export const categories = [
  { id: 'beach', name: 'Beach', icon: '🏖️' },
  { id: 'city', name: 'City', icon: '🏙️' },
  { id: 'mountain', name: 'Mountain', icon: '⛰️' },
  { id: 'lake', name: 'Lake', icon: '🏞️' },
  { id: 'tropical', name: 'Tropical', icon: '🌴' },
  { id: 'countryside', name: 'Countryside', icon: '🌾' },
  { id: 'villa', name: 'Villa', icon: '🏰' },
  { id: 'cabin', name: 'Cabin', icon: '🏕️' }
];

export const amenitiesList = [
  'WiFi',
  'Kitchen',
  'Washer',
  'Dryer',
  'Air Conditioning',
  'Heating',
  'TV',
  'Pool',
  'Hot Tub',
  'Free Parking',
  'Gym',
  'Elevator',
  'Workspace',
  'Fireplace',
  'BBQ Grill',
  'Beach Access',
  'Ocean View',
  'Mountain View',
  'City View',
  'Garden',
  'Patio',
  'Fire Pit',
  'Lake Access'
];
