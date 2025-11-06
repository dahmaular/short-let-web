import { useState, useEffect } from "react";
import {
  Grid,
  List,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  Star,
  MapPin,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useRouter } from "../utils/router";
import { amenitiesList } from "../data/mockData";
import type { Property, ViewMode } from "../types";

export default function ListingsPage() {
  const { state, dispatch } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [localFilters, setLocalFilters] = useState({
    priceRange: [0, 1000] as [number, number],
    propertyTypes: [] as string[],
    amenities: [] as string[],
    instantBook: false,
    minRating: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    // Apply filters
    let filtered = [...state.properties];

    // Price filter
    filtered = filtered.filter(
      (p) =>
        p.price >= localFilters.priceRange[0] &&
        p.price <= localFilters.priceRange[1]
    );

    // Property type filter
    if (localFilters.propertyTypes.length > 0) {
      filtered = filtered.filter((p) =>
        localFilters.propertyTypes.includes(p.type)
      );
    }

    // Amenities filter
    if (localFilters.amenities.length > 0) {
      filtered = filtered.filter((p) =>
        localFilters.amenities.every((amenity) => p.amenities.includes(amenity))
      );
    }

    // Instant book filter
    if (localFilters.instantBook) {
      filtered = filtered.filter((p) => p.instantBook);
    }

    // Rating filter
    if (localFilters.minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= localFilters.minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Recommended - featured first, then by rating
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }

    dispatch({ type: "FILTER_PROPERTIES", payload: filtered });
  }, [localFilters, sortBy, state.properties, dispatch]);

  const togglePropertyType = (type: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const clearFilters = () => {
    setLocalFilters({
      priceRange: [0, 1000],
      propertyTypes: [],
      amenities: [],
      instantBook: false,
      minRating: 0,
    });
  };

  const paginatedProperties = state.filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(state.filteredProperties.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {state.filteredProperties.length} stays available
          </h1>
          {state.searchFilters.location && (
            <p className="text-gray-600">
              in{" "}
              <span className="font-semibold">
                {state.searchFilters.location}
              </span>
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {(localFilters.propertyTypes.length > 0 ||
                localFilters.amenities.length > 0 ||
                localFilters.instantBook ||
                localFilters.minRating > 0) && (
                <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {localFilters.propertyTypes.length +
                    localFilters.amenities.length +
                    (localFilters.instantBook ? 1 : 0) +
                    (localFilters.minRating > 0 ? 1 : 0)}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-full md:w-80 bg-white rounded-xl p-6 shadow-md h-fit animate-slide-down">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-primary-600 text-sm font-semibold hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={localFilters.priceRange[1]}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        priceRange: [0, parseInt(e.target.value)],
                      }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₦{localFilters.priceRange[0]}</span>
                    <span>₦{localFilters.priceRange[1]}+</span>
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Property Type
                </h3>
                <div className="space-y-2">
                  {["entire-place", "private-room", "shared-room"].map(
                    (type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={localFilters.propertyTypes.includes(type)}
                          onChange={() => togglePropertyType(type)}
                          className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600"
                        />
                        <span className="text-gray-700 capitalize">
                          {type.replace("-", " ")}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {amenitiesList.slice(0, 10).map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={localFilters.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600"
                      />
                      <span className="text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instant Book */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.instantBook}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        instantBook: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-600"
                  />
                  <span className="font-semibold text-gray-900">
                    Instant Book
                  </span>
                </label>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Minimum Rating
                </h3>
                <div className="space-y-2">
                  {[0, 4, 4.5, 4.8].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={localFilters.minRating === rating}
                        onChange={() =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            minRating: rating,
                          }))
                        }
                        className="w-4 h-4 text-primary-600 focus:ring-primary-600"
                      />
                      <span className="text-gray-700">
                        {rating === 0 ? "Any" : `${rating}+ stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Properties Grid/List */}
          <div className="flex-1">
            {paginatedProperties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg mb-4">
                  No properties found matching your criteria
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {paginatedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === page
                              ? "bg-primary-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({
  property,
  viewMode,
}: {
  property: Property;
  viewMode: ViewMode;
}) {
  const { navigate } = useRouter();
  const { state, dispatch } = useApp();
  const [currentImageIndex] = useState(0);

  if (viewMode === "list") {
    return (
      <div
        onClick={() => navigate("property", property.id)}
        className="bg-white rounded-xl overflow-hidden shadow-md card-hover cursor-pointer flex"
      >
        <div className="relative w-80 h-64 flex-shrink-0">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
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

        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {property.title}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{property.rating}</span>
              <span className="text-gray-500 text-sm">
                ({property.reviewCount})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>
              {property.location.city}, {property.location.country}
            </span>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {property.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>{property.bedrooms} bed</span>
            <span>·</span>
            <span>{property.bathrooms} bath</span>
            <span>·</span>
            <span>Up to {property.maxGuests} guests</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                +{property.amenities.length - 4} more
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-bold text-gray-900">
                ₦{property.price}
              </span>
              <span className="text-gray-600"> / night</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate("property", property.id)}
      className="bg-white rounded-2xl overflow-hidden shadow-md card-hover cursor-pointer group"
    >
      <div className="relative h-64">
        <img
          src={property.images[currentImageIndex]}
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
        <div className="absolute bottom-3 right-3 flex gap-1">
          {property.images.slice(0, 3).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentImageIndex === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm">{property.rating}</span>
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
              ₦{property.price}
            </span>
            <span className="text-gray-600 text-sm"> / night</span>
          </div>
        </div>
      </div>
    </div>
  );
}
