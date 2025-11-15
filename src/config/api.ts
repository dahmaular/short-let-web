// API Configuration
// This file centralizes API URL configuration for easy deployment management

const getApiUrl = (): string => {
  // In production, use environment variable
  // In development, fallback to localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:5001';
};

const getAppUrl = (): string => {
  return import.meta.env.VITE_APP_URL || window.location.origin;
};

export const config = {
  apiUrl: getApiUrl(),
  appUrl: getAppUrl(),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  login: `${config.apiUrl}/api/auth/login`,
  signup: `${config.apiUrl}/api/auth/register`,
  
  // Users
  profile: `${config.apiUrl}/api/users/profile`,
  updateProfile: `${config.apiUrl}/api/users/profile`,
  
  // Properties
  properties: `${config.apiUrl}/api/properties`,
  propertyById: (id: string) => `${config.apiUrl}/api/properties/${id}`,
  
  // Bookings
  bookings: `${config.apiUrl}/api/bookings`,
  bookingById: (id: string) => `${config.apiUrl}/api/bookings/${id}`,
  cancelBooking: (id: string) => `${config.apiUrl}/api/bookings/${id}/cancel`,
  
  // Payments
  initializePayment: `${config.apiUrl}/api/payments/initialize`,
  verifyPayment: (reference: string) => `${config.apiUrl}/api/payments/verify/${reference}`,
  
  // Reviews
  reviews: `${config.apiUrl}/api/reviews`,
  propertyReviews: (propertyId: string) => `${config.apiUrl}/api/reviews/property/${propertyId}`,
};

export default config;
