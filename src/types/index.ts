export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'entire-place' | 'private-room' | 'shared-room';
  price: number;
  location: {
    city: string;
    country: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  host: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    joinedDate: string;
  };
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  reviewCount: number;
  instantBook: boolean;
  category: string;
  houseRules: string[];
  unavailableDates: string[];
  featured?: boolean;
  reviews?: Review[];
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  categories: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    checkIn: number;
    value: number;
  };
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  phone?: string;
  verified: boolean;
  isHost: boolean;
}

export interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  priceRange: [number, number];
  propertyTypes: string[];
  amenities: string[];
  instantBook: boolean;
  minRating: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export type ViewMode = 'grid' | 'list';

export type Page = 'home' | 'listings' | 'property' | 'booking' | 'confirmation' | 'dashboard' | 'host' | 'login' | 'signup';
