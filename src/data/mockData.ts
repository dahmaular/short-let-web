import type { Property, Review } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Beachfront Villa with Ocean Views',
    description: 'Experience paradise in this stunning beachfront villa featuring panoramic ocean views, private pool, and direct beach access. Perfect for a relaxing getaway with family or friends.',
    type: 'entire-place',
    price: 450,
    location: {
      city: 'Malibu',
      country: 'USA',
      address: '123 Pacific Coast Highway',
      coordinates: { lat: 34.0259, lng: -118.7798 }
    },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ],
    host: {
      id: 'h1',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      verified: true,
      joinedDate: '2020-03-15'
    },
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Free Parking', 'Air Conditioning', 'Ocean View', 'Beach Access', 'Hot Tub'],
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 3,
    rating: 4.9,
    reviewCount: 127,
    instantBook: true,
    category: 'Beach',
    houseRules: ['No smoking', 'No parties', 'Check-in after 3 PM', 'Check-out before 11 AM', 'Pets allowed with fee'],
    unavailableDates: ['2025-11-15', '2025-11-16', '2025-12-20', '2025-12-21', '2025-12-22'],
    featured: true
  },
  {
    id: '2',
    title: 'Modern Downtown Apartment',
    description: 'Stylish and modern apartment in the heart of the city. Walking distance to restaurants, shops, and entertainment. Perfect for business travelers or city explorers.',
    type: 'entire-place',
    price: 180,
    location: {
      city: 'New York',
      country: 'USA',
      address: '456 Broadway',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800'
    ],
    host: {
      id: 'h2',
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=12',
      verified: true,
      joinedDate: '2019-07-22'
    },
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Air Conditioning', 'Elevator', 'Gym', 'Workspace'],
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    rating: 4.8,
    reviewCount: 89,
    instantBook: true,
    category: 'City',
    houseRules: ['No smoking', 'No parties', 'Quiet hours after 10 PM'],
    unavailableDates: ['2025-11-01', '2025-11-02', '2025-11-03'],
    featured: true
  },
  {
    id: '3',
    title: 'Cozy Mountain Cabin Retreat',
    description: 'Escape to nature in this charming mountain cabin surrounded by pine trees. Features a fireplace, outdoor deck, and stunning mountain views.',
    type: 'entire-place',
    price: 220,
    location: {
      city: 'Aspen',
      country: 'USA',
      address: '789 Mountain Trail',
      coordinates: { lat: 39.1911, lng: -106.8175 }
    },
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
      'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800'
    ],
    host: {
      id: 'h3',
      name: 'Emily Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=5',
      verified: true,
      joinedDate: '2018-11-10'
    },
    amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Free Parking', 'Heating', 'Mountain View', 'BBQ Grill'],
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    rating: 4.95,
    reviewCount: 156,
    instantBook: false,
    category: 'Mountain',
    houseRules: ['No smoking', 'Pets allowed', 'Check-in flexible'],
    unavailableDates: [],
    featured: true
  },
  {
    id: '4',
    title: 'Charming Studio in Historic District',
    description: 'Perfectly located studio apartment in a historic building. Ideal for solo travelers or couples. Walking distance to major attractions.',
    type: 'entire-place',
    price: 95,
    location: {
      city: 'Boston',
      country: 'USA',
      address: '321 Beacon Street',
      coordinates: { lat: 42.3601, lng: -71.0589 }
    },
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
    ],
    host: {
      id: 'h4',
      name: 'David Park',
      avatar: 'https://i.pravatar.cc/150?img=13',
      verified: false,
      joinedDate: '2021-02-18'
    },
    amenities: ['WiFi', 'Kitchen', 'Workspace', 'Coffee Maker'],
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    rating: 4.6,
    reviewCount: 43,
    instantBook: true,
    category: 'City',
    houseRules: ['No smoking', 'No pets', 'No parties'],
    unavailableDates: ['2025-11-10', '2025-11-11'],
    featured: false
  },
  {
    id: '5',
    title: 'Tropical Paradise Villa with Private Pool',
    description: 'Luxurious tropical villa featuring lush gardens, infinity pool, and breathtaking sunset views. Complete privacy and ultimate relaxation.',
    type: 'entire-place',
    price: 580,
    location: {
      city: 'Bali',
      country: 'Indonesia',
      address: 'Jl. Raya Ubud',
      coordinates: { lat: -8.5069, lng: 115.2625 }
    },
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
    ],
    host: {
      id: 'h5',
      name: 'Maya Patel',
      avatar: 'https://i.pravatar.cc/150?img=9',
      verified: true,
      joinedDate: '2017-05-30'
    },
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Free Parking', 'Air Conditioning', 'Garden', 'Outdoor Dining', 'Staff'],
    maxGuests: 10,
    bedrooms: 5,
    beds: 6,
    bathrooms: 4,
    rating: 5.0,
    reviewCount: 201,
    instantBook: true,
    category: 'Tropical',
    houseRules: ['No smoking indoors', 'Respect local customs', 'Quiet hours after 11 PM'],
    unavailableDates: ['2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28'],
    featured: true
  },
  {
    id: '6',
    title: 'Lakefront Cottage with Dock',
    description: 'Peaceful lakefront cottage perfect for fishing, kayaking, and unwinding. Private dock and amazing sunrise views.',
    type: 'entire-place',
    price: 165,
    location: {
      city: 'Lake Tahoe',
      country: 'USA',
      address: '555 Lakeshore Drive',
      coordinates: { lat: 39.0968, lng: -120.0324 }
    },
    images: [
      'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800',
      'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800'
    ],
    host: {
      id: 'h6',
      name: 'Robert Williams',
      avatar: 'https://i.pravatar.cc/150?img=14',
      verified: true,
      joinedDate: '2019-09-05'
    },
    amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Free Parking', 'Lake Access', 'Kayaks', 'Fire Pit'],
    maxGuests: 5,
    bedrooms: 2,
    beds: 3,
    bathrooms: 1,
    rating: 4.85,
    reviewCount: 72,
    instantBook: false,
    category: 'Lake',
    houseRules: ['No smoking', 'Pets welcome', 'Life jackets required on water'],
    unavailableDates: [],
    featured: false
  },
  {
    id: '7',
    title: 'Penthouse with Rooftop Terrace',
    description: 'Stunning penthouse with private rooftop terrace offering 360-degree city views. Modern design with luxury finishes throughout.',
    type: 'entire-place',
    price: 375,
    location: {
      city: 'Miami',
      country: 'USA',
      address: '888 Brickell Avenue',
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800',
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ],
    host: {
      id: 'h7',
      name: 'Jessica Martinez',
      avatar: 'https://i.pravatar.cc/150?img=10',
      verified: true,
      joinedDate: '2020-01-12'
    },
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Gym', 'Air Conditioning', 'Elevator', 'Rooftop', 'City View', 'Concierge'],
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    rating: 4.92,
    reviewCount: 115,
    instantBook: true,
    category: 'City',
    houseRules: ['No smoking', 'No parties', 'Building quiet hours apply'],
    unavailableDates: ['2025-11-20', '2025-11-21'],
    featured: true
  },
  {
    id: '8',
    title: 'Rustic Farmhouse in Wine Country',
    description: 'Authentic farmhouse surrounded by vineyards. Perfect for wine enthusiasts and those seeking a peaceful countryside retreat.',
    type: 'entire-place',
    price: 285,
    location: {
      city: 'Napa Valley',
      country: 'USA',
      address: '777 Vineyard Lane',
      coordinates: { lat: 38.2975, lng: -122.2869 }
    },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'
    ],
    host: {
      id: 'h8',
      name: 'Thomas Anderson',
      avatar: 'https://i.pravatar.cc/150?img=15',
      verified: true,
      joinedDate: '2018-06-20'
    },
    amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Free Parking', 'Garden', 'BBQ Grill', 'Vineyard Views'],
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 3,
    rating: 4.88,
    reviewCount: 94,
    instantBook: false,
    category: 'Countryside',
    houseRules: ['No smoking', 'No pets', 'Enjoy wine responsibly'],
    unavailableDates: ['2025-12-01', '2025-12-02', '2025-12-03'],
    featured: false
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    propertyId: '1',
    userId: 'u1',
    userName: 'John Smith',
    userAvatar: 'https://i.pravatar.cc/150?img=33',
    rating: 5,
    comment: 'Absolutely stunning property! The ocean views were breathtaking and the villa was even better than the photos. Sarah was an excellent host and very responsive. Would definitely come back!',
    date: '2025-09-15',
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 4.5
    }
  },
  {
    id: 'r2',
    propertyId: '1',
    userId: 'u2',
    userName: 'Emma Wilson',
    userAvatar: 'https://i.pravatar.cc/150?img=45',
    rating: 5,
    comment: 'Perfect vacation spot! The private pool and beach access made our stay unforgettable. The house was impeccably clean and had everything we needed.',
    date: '2025-08-22',
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
    userName: 'Carlos Mendez',
    userAvatar: 'https://i.pravatar.cc/150?img=52',
    rating: 4.5,
    comment: 'Beautiful villa with amazing views. Only minor issue was the hot tub temperature, but Sarah fixed it quickly. Great experience overall!',
    date: '2025-07-10',
    categories: {
      cleanliness: 5,
      accuracy: 4.5,
      communication: 5,
      location: 5,
      checkIn: 4.5,
      value: 4
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
