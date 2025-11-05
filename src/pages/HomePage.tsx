import { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Shield,
  Heart,
  Award,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "../utils/router";
import { useApp } from "../context/AppContext";
import { categories } from "../data/mockData";

export default function HomePage() {
  const { navigate } = useRouter();
  const { state, dispatch } = useApp();
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleSearch = () => {
    dispatch({
      type: "SET_SEARCH_FILTERS",
      payload: {
        location: searchData.location,
        checkIn: searchData.checkIn,
        checkOut: searchData.checkOut,
        guests: searchData.guests,
      },
    });
    navigate("listings");
  };

  const featuredProperties = state.properties
    .filter((p) => p.featured)
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600)",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Find Your Perfect Getaway
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 animate-slide-up">
            Discover unique stays and experiences around the world
          </p>

          {/* Search Bar */}
          <div className="glass-effect rounded-2xl p-4 md:p-6 shadow-2xl animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={searchData.location}
                  onChange={(e) =>
                    setSearchData({ ...searchData, location: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  placeholder="Check in"
                  value={searchData.checkIn}
                  onChange={(e) =>
                    setSearchData({ ...searchData, checkIn: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  placeholder="Check out"
                  value={searchData.checkOut}
                  onChange={(e) =>
                    setSearchData({ ...searchData, checkOut: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  placeholder="Guests"
                  value={searchData.guests}
                  onChange={(e) =>
                    setSearchData({
                      ...searchData,
                      guests: parseInt(e.target.value),
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto mt-4 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate("listings")}
              className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-primary-600 hover:shadow-lg transition-all card-hover group"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <div className="font-semibold text-gray-900 text-sm">
                {category.name}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Stays
            </h2>
            <p className="text-gray-600">
              Handpicked properties loved by guests
            </p>
          </div>
          <button
            onClick={() => navigate("listings")}
            className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
          >
            View All
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => navigate("property", property.id)}
              className="bg-white rounded-2xl overflow-hidden shadow-md card-hover cursor-pointer group"
            >
              <div className="relative h-64">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "TOGGLE_FAVORITE", payload: property.id });
                  }}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      state.favorites.includes(property.id)
                        ? "fill-primary-600 text-primary-600"
                        : "text-gray-700"
                    }`}
                  />
                </button>
                {property.instantBook && (
                  <div className="absolute bottom-3 left-3 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Instant Book
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">
                      {property.rating}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {property.location.city}, {property.location.country}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {property.bedrooms} bed · {property.bathrooms} bath · Up to{" "}
                  {property.maxGuests} guests
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${property.price}
                    </span>
                    <span className="text-gray-600 text-sm"> / night</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Search & Discover
            </h3>
            <p className="text-gray-600">
              Find the perfect place using our smart search filters and detailed
              listings
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Book Instantly
            </h3>
            <p className="text-gray-600">
              Secure your dates with instant booking or send a request to the
              host
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Enjoy Your Stay
            </h3>
            <p className="text-gray-600">
              Check in, relax, and create unforgettable memories at your
              destination
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose ShortLet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                <p className="text-gray-300">
                  Your payment information is encrypted and secure. We never
                  share your financial details.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Verified Hosts</h3>
                <p className="text-gray-300">
                  All hosts are verified through our rigorous screening process
                  for your safety.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
                <p className="text-gray-300">
                  Every property meets our high standards. Read real reviews
                  from real guests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className="relative rounded-3xl overflow-hidden bg-cover bg-center h-96 flex items-center justify-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-accent-600/90" />
          <div className="relative z-10 text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Earn Extra Income as a Host
            </h2>
            <p className="text-xl text-white/90 mb-8">
              List your property and start welcoming guests from around the
              world
            </p>
            <button
              onClick={() => navigate("host")}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all hover:shadow-xl"
            >
              Become a Host
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
