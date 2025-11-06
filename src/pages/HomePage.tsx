import { useState } from "react";
import {
  Search,
  // MapPin,
  Calendar,
  // Users,
  Shield,
  Heart,
  Award,
  TrendingUp,
  Play,
  X,
} from "lucide-react";
import { useRouter } from "../utils/router";
import { useApp } from "../context/AppContext";
import { categories } from "../data/mockData";

export default function HomePage() {
  const { navigate } = useRouter();
  const { state, dispatch } = useApp();
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
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
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dgslbycvk/video/upload/v1762407500/codakraft-apartment_tfod0i.mov"
            type="video/mp4"
          />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in drop-shadow-2xl">
            Find Your Perfect Getaway
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-10 animate-slide-up drop-shadow-lg">
            Discover unique stays and experiences around the world
          </p>

          {/* Enhanced Book Now CTA */}
          <div className="mb-12 animate-scale-in">
            <button
              onClick={() => navigate("listings")}
              className="group relative inline-flex items-center justify-center bg-black hover:bg-gray-900 text-white px-12 py-5 rounded-full font-bold text-2xl shadow-2xl hover:shadow-black/60 transition-all duration-300 hover:scale-110"
            >
              <span className="relative z-10">Book Now</span>
              <div className="absolute inset-0 rounded-full bg-white/10 blur-lg group-hover:blur-xl transition-all duration-300"></div>
            </button>
          </div>

          {/* Search Bar */}
          {/* <div className="glass-effect rounded-2xl p-4 md:p-6 shadow-2xl animate-scale-in">
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
          </div> */}
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

      {/* Apartment Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Apartment Features
          </h2>
          <p className="text-gray-600">
            Explore the luxury amenities and spaces of our premium apartment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.length > 0 &&
            (() => {
              const property = featuredProperties[0];
              // Map specific images to room types
              const features = [
                {
                  title: "Living Room",
                  description: "Spacious and elegantly designed living area",
                  image: property.images[0], // First image for living room
                },
                {
                  title: "Bedroom",
                  description: "Comfortable bedrooms with premium bedding",
                  image: property.images[15], // Second image for bedroom
                },
                {
                  title: "Kitchen",
                  description: "Fully equipped modern kitchen",
                  image: property.images[24], // Third image for kitchen
                },
                {
                  title: "Luxury",
                  description: "Luxury apartment with modern fixtures",
                  image: property.images[1], // Fourth image for luxury
                },
              ];

              return features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => navigate("property", property.id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-md card-hover cursor-pointer group"
                >
                  <div className="relative h-64">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ));
            })()}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("property", featuredProperties[0]?.id)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg inline-flex items-center gap-2"
          >
            View Full Apartment
            <TrendingUp className="w-5 h-5" />
          </button>
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

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Codakraft-apartment
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the best in vacation rentals with our trusted platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Verified Properties
              </h3>
              <p className="text-gray-600">
                Every listing is verified to ensure quality and authenticity
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Best Price Guarantee
              </h3>
              <p className="text-gray-600">
                Competitive pricing with no hidden fees or surprise charges
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Our dedicated team is always here to help you with any questions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Take a Tour CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          className="relative rounded-3xl overflow-hidden bg-cover bg-center h-96 flex items-center justify-center"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/dgslbycvk/image/upload/v1762407635/1_cpaaj4.jpg)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-accent-600/90" />
          <div className="relative z-10 text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Take a Virtual Tour
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Explore every corner of our luxury apartment from the comfort of
              your home
            </p>
            <button
              onClick={() => setShowVideoPlayer(true)}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all hover:shadow-xl inline-flex items-center gap-3"
            >
              <Play className="w-6 h-6" />
              Watch Apartment Tour
            </button>
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {showVideoPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-6xl">
            <button
              onClick={() => setShowVideoPlayer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div
              className="relative bg-black rounded-lg overflow-hidden"
              style={{ paddingBottom: "56.25%" }}
            >
              <video
                controls
                autoPlay
                className="absolute inset-0 w-full h-full"
                src="https://res.cloudinary.com/dgslbycvk/video/upload/v1762411347/Apartment-tour_gdykqz.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
