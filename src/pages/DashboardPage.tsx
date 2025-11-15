import { useState, useEffect } from "react";
import {
  Calendar,
  Heart,
  User,
  Settings,
  Star,
  MapPin,
  X,
  AlertCircle,
  Check,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useRouter } from "../utils/router";
import { API_ENDPOINTS } from "../config/api";
import { formatCurrency } from "../utils/helpers";

interface BookingFromAPI {
  _id: string;
  property: {
    _id: string;
    title: string;
    images?: string[];
    location?: {
      city: string;
      country: string;
    };
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  pricing?: {
    total: number;
  };
}

export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<
    "bookings" | "favorites" | "profile"
  >("bookings");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    firstName: state.currentUser?.firstName || "",
    lastName: state.currentUser?.lastName || "",
    email: state.currentUser?.email || "",
  });

  // State for fetched bookings
  const [bookings, setBookings] = useState<BookingFromAPI[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  // Fetch user bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        setBookingsError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setBookingsError("Please login to view your bookings");
          setBookingsLoading(false);
          return;
        }

        const response = await fetch(API_ENDPOINTS.bookings, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookingsError(
          err instanceof Error ? err.message : "Failed to load bookings"
        );
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setBookingsError("Please login to cancel booking");
        return;
      }

      const response = await fetch(API_ENDPOINTS.cancelBooking(bookingId), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      // Update bookings state with the cancelled booking
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      setSuccess("Booking cancelled successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setBookingsError(
        err instanceof Error ? err.message : "Failed to cancel booking"
      );
      setTimeout(() => setBookingsError(""), 3000);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.checkIn) > new Date()
  );

  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || new Date(b.checkOut) < new Date()
  );

  const favoriteProperties = state.properties.filter((p) =>
    state.favorites.includes(p.id)
  );

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if canceling
      setFormData({
        firstName: state.currentUser?.firstName || "",
        lastName: state.currentUser?.lastName || "",
        email: state.currentUser?.email || "",
      });
      setError("");
      setSuccess("");
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(API_ENDPOINTS.updateProfile, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      // Update local storage and context
      const updatedUser = { ...state.currentUser, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "SET_USER", payload: updatedUser });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during update"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your bookings, favorites, and account settings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-4 px-4 font-semibold transition-colors relative ${
              activeTab === "bookings"
                ? "text-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              My Bookings
            </div>
            {activeTab === "bookings" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`pb-4 px-4 font-semibold transition-colors relative ${
              activeTab === "favorites"
                ? "text-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Favorites
              {state.favorites.length > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.favorites.length}
                </span>
              )}
            </div>
            {activeTab === "favorites" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-4 px-4 font-semibold transition-colors relative ${
              activeTab === "profile"
                ? "text-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </div>
            {activeTab === "profile" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-8">
            {/* Loading State */}
            {bookingsLoading && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your bookings...</p>
              </div>
            )}

            {/* Error State */}
            {bookingsError && !bookingsLoading && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-1">
                    Error Loading Bookings
                  </h3>
                  <p className="text-red-700">{bookingsError}</p>
                </div>
              </div>
            )}

            {/* Bookings Content */}
            {!bookingsLoading && !bookingsError && (
              <>
                {/* Upcoming Bookings */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Upcoming Bookings
                  </h2>
                  {upcomingBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No upcoming bookings
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start planning your next adventure!
                      </p>
                      <button
                        onClick={() => navigate("listings")}
                        className="btn-primary"
                      >
                        Explore Properties
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {upcomingBookings.map((booking) => {
                        const property = booking.property;
                        if (!property) return null;

                        return (
                          <div
                            key={booking._id}
                            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                          >
                            <img
                              src={
                                property.images?.[0] ||
                                "https://via.placeholder.com/400x300"
                              }
                              alt={property.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                                {property.title}
                              </h3>
                              <div className="flex items-center gap-1 text-gray-600 mb-4">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">
                                  {property.location?.city},{" "}
                                  {property.location?.country}
                                </span>
                              </div>

                              <div className="flex items-center justify-between mb-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Check-in</p>
                                  <p className="font-semibold">
                                    {new Date(
                                      booking.checkIn
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Check-out</p>
                                  <p className="font-semibold">
                                    {new Date(
                                      booking.checkOut
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div>
                                  <span className="text-2xl font-bold text-gray-900">
                                    ₦
                                    {booking.pricing?.total?.toLocaleString() ||
                                      "0"}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    handleCancelBooking(booking._id)
                                  }
                                  className="text-sm text-red-600 hover:text-red-700 font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Past Bookings */}
                {pastBookings.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Past Bookings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {pastBookings.map((booking) => {
                        const property = booking.property;
                        if (!property) return null;

                        return (
                          <div
                            key={booking._id}
                            className="bg-white rounded-2xl overflow-hidden shadow-md opacity-75 hover:opacity-100 transition-opacity"
                          >
                            <img
                              src={
                                property.images?.[0] ||
                                "https://via.placeholder.com/400x300"
                              }
                              alt={property.title}
                              className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all"
                            />
                            <div className="p-6">
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {property.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-4">
                                {new Date(booking.checkIn).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  booking.checkOut
                                ).toLocaleDateString()}
                              </p>
                              <button className="btn-secondary w-full">
                                Write a Review
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              My Favorites
            </h2>
            {favoriteProperties.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Save your favorite properties for easy access
                </p>
                <button
                  onClick={() => navigate("listings")}
                  className="btn-primary"
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md card-hover group relative"
                  >
                    <div
                      onClick={() => navigate("property", property.id)}
                      className="cursor-pointer"
                    >
                      <div className="relative h-48">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {property.location.city},{" "}
                            {property.location.country}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-gray-900">
                              {formatCurrency(property.price)}
                            </span>
                            <span className="text-gray-600 text-sm">
                              {" "}
                              / night
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-sm">
                              {property.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({
                          type: "TOGGLE_FAVORITE",
                          payload: property.id,
                        });
                      }}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Profile Settings
            </h2>
            <div className="bg-white rounded-2xl shadow-md p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-600 to-accent-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {state.currentUser?.firstName?.[0]}
                  {state.currentUser?.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {state.currentUser?.firstName} {state.currentUser?.lastName}
                  </h3>
                  <p className="text-gray-600">
                    @{state.currentUser?.username}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {state.currentUser?.email}
                  </p>
                  {state.currentUser?.verified && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Verified Account
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={
                      isEditing
                        ? formData.firstName
                        : state.currentUser?.firstName || ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    readOnly={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={
                      isEditing
                        ? formData.lastName
                        : state.currentUser?.lastName || ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    readOnly={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      @
                    </span>
                    <input
                      type="text"
                      value={state.currentUser?.username || ""}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 outline-none"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Username cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={
                      isEditing
                        ? formData.email
                        : state.currentUser?.email || ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    readOnly={!isEditing}
                    required
                  />
                </div>

                <div className="pt-6 flex gap-3">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        disabled={loading}
                        className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
