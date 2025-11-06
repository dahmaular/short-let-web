import { useState } from "react";
import { Calendar, Heart, User, Settings, Star, MapPin, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useRouter } from "../utils/router";

export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<"trips" | "favorites" | "profile">(
    "trips"
  );

  const upcomingBookings = state.bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.checkIn) > new Date()
  );

  const pastBookings = state.bookings.filter(
    (b) => b.status === "completed" || new Date(b.checkOut) < new Date()
  );

  const favoriteProperties = state.properties.filter((p) =>
    state.favorites.includes(p.id)
  );

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
            onClick={() => setActiveTab("trips")}
            className={`pb-4 px-4 font-semibold transition-colors relative ${
              activeTab === "trips"
                ? "text-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              My Trips
            </div>
            {activeTab === "trips" && (
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

        {/* Trips Tab */}
        {activeTab === "trips" && (
          <div className="space-y-8">
            {/* Upcoming Trips */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upcoming Trips
              </h2>
              {upcomingBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No upcoming trips
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
                    const property = state.properties.find(
                      (p) => p.id === booking.propertyId
                    );
                    if (!property) return null;

                    return (
                      <div
                        key={booking.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                      >
                        <img
                          src={property.images[0]}
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
                              {property.location.city},{" "}
                              {property.location.country}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mb-4 text-sm">
                            <div>
                              <p className="text-gray-600">Check-in</p>
                              <p className="font-semibold">
                                {new Date(booking.checkIn).toLocaleDateString()}
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
                                ₦{booking.totalPrice}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to cancel this booking?"
                                  )
                                ) {
                                  dispatch({
                                    type: "CANCEL_BOOKING",
                                    payload: booking.id,
                                  });
                                }
                              }}
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

            {/* Past Trips */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Past Trips
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastBookings.map((booking) => {
                    const property = state.properties.find(
                      (p) => p.id === booking.propertyId
                    );
                    if (!property) return null;

                    return (
                      <div
                        key={booking.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-md opacity-75 hover:opacity-100 transition-opacity"
                      >
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all"
                        />
                        <div className="p-6">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {property.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                            {new Date(booking.checkOut).toLocaleDateString()}
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
                              ₦{property.price}
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
                  <p className="text-gray-600">{state.currentUser?.email}</p>
                  {state.currentUser?.verified && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Verified Account
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={state.currentUser?.firstName || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={state.currentUser?.lastName || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={state.currentUser?.email || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                    readOnly
                  />
                </div>

                <div className="pt-6">
                  <button className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
