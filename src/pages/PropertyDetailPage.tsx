import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  MapPin,
  Wifi,
  Share2,
  Heart,
  Calendar,
  Shield,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useRouter } from "../utils/router";
import { mockReviews } from "../data/mockData";
import { calculateNights, calculateTotalPrice } from "../utils/helpers";

export default function PropertyDetailPage() {
  const { state, dispatch } = useApp();
  const { navigate, currentPropertyId } = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState({
    checkIn: "",
    checkOut: "",
  });
  const [guestCount, setGuestCount] = useState({
    adults: 2,
    children: 0,
    infants: 0,
  });

  const property = state.properties.find((p) => p.id === currentPropertyId);
  const reviews = mockReviews.filter((r) => r.propertyId === currentPropertyId);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Property not found
          </h2>
          <button onClick={() => navigate("home")} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const nights =
    selectedDates.checkIn && selectedDates.checkOut
      ? calculateNights(selectedDates.checkIn, selectedDates.checkOut)
      : 0;

  const totalPrice =
    nights > 0 ? calculateTotalPrice(property.price, nights) : 0;
  const totalGuests = guestCount.adults + guestCount.children;

  const handleReserve = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    dispatch({
      type: "SET_CURRENT_BOOKING",
      payload: {
        propertyId: property.id,
        checkIn: selectedDates.checkIn,
        checkOut: selectedDates.checkOut,
        guests: guestCount,
        totalPrice,
      },
    });
    navigate("booking");
  };

  const similarProperties = state.properties
    .filter((p) => p.id !== property.id && p.category === property.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("listings")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to listings
        </button>

        {/* Property Title & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{property.rating}</span>
                <span>({property.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                <span>
                  {property.location.city}, {property.location.country}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() =>
                dispatch({ type: "TOGGLE_FAVORITE", payload: property.id })
              }
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${
                  state.favorites.includes(property.id)
                    ? "fill-primary-600 text-primary-600"
                    : ""
                }`}
              />
              Save
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-8 h-[500px]">
          <div
            className="col-span-4 md:col-span-2 row-span-2 cursor-pointer relative group"
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
          >
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:brightness-90 transition-all"
            />
          </div>
          {property.images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="col-span-2 md:col-span-1 cursor-pointer relative group"
              onClick={() => {
                setLightboxIndex(index + 1);
                setLightboxOpen(true);
              }}
            >
              <img
                src={image}
                alt={`${property.title} ${index + 2}`}
                className="w-full h-full object-cover group-hover:brightness-90 transition-all"
              />
              {index === 3 && property.images.length > 5 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-lg">
                  +{property.images.length - 5} more photos
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Host Info */}
            <div className="pb-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {property.type === "entire-place"
                      ? "Entire place"
                      : property.type === "private-room"
                      ? "Private room"
                      : "Shared room"}{" "}
                    hosted by {property.host.name}
                  </h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span>{property.maxGuests} guests</span>
                    <span>·</span>
                    <span>{property.bedrooms} bedrooms</span>
                    <span>·</span>
                    <span>{property.beds} beds</span>
                    <span>·</span>
                    <span>{property.bathrooms} baths</span>
                  </div>
                </div>
                <img
                  src={property.host.avatar}
                  alt={property.host.name}
                  className="w-16 h-16 rounded-full"
                />
              </div>
            </div>

            {/* Features */}
            <div className="py-8 border-b border-gray-200">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {property.host.verified
                        ? "Verified Host"
                        : "Trusted Host"}
                    </h3>
                    <p className="text-gray-600">
                      This host has been verified and maintains high standards
                      for their listings.
                    </p>
                  </div>
                </div>

                {property.instantBook && (
                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-accent-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Instant Book
                      </h3>
                      <p className="text-gray-600">
                        Book this property instantly without waiting for host
                        approval.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Great Location
                    </h3>
                    <p className="text-gray-600">
                      100% of recent guests gave the location a 5-star rating.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="py-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this place
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="py-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="py-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                House Rules
              </h2>
              <ul className="space-y-2">
                {property.houseRules.map((rule, index) => (
                  <li
                    key={index}
                    className="text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-primary-600 mt-1">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            <div className="py-8">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {property.rating} · {property.reviewCount} reviews
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {reviews.length > 0 && reviews[0].categories && (
                  <>
                    {Object.entries(reviews[0].categories).map(
                      ([key, value]) => (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600 capitalize">
                              {key}
                            </span>
                            <span className="text-sm font-semibold">
                              {value}
                            </span>
                          </div>
                          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-900"
                              style={{ width: `${(value / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review.userName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {review.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">
                              {review.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-300 rounded-2xl p-6 shadow-xl">
              <div className="mb-6">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${property.price}
                  </span>
                  <span className="text-gray-600">/ night</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{property.rating}</span>
                  <span className="text-gray-500">
                    ({property.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-lg overflow-hidden">
                  <div className="p-3 border-r border-gray-300">
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      CHECK-IN
                    </label>
                    <input
                      type="date"
                      value={selectedDates.checkIn}
                      onChange={(e) =>
                        setSelectedDates({
                          ...selectedDates,
                          checkIn: e.target.value,
                        })
                      }
                      className="w-full text-sm outline-none"
                    />
                  </div>
                  <div className="p-3">
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      CHECKOUT
                    </label>
                    <input
                      type="date"
                      value={selectedDates.checkOut}
                      onChange={(e) =>
                        setSelectedDates({
                          ...selectedDates,
                          checkOut: e.target.value,
                        })
                      }
                      className="w-full text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Selection */}
              <div className="mb-6 border border-gray-300 rounded-lg p-3">
                <label className="text-xs font-semibold text-gray-700 block mb-2">
                  GUESTS
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Adults</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setGuestCount({
                            ...guestCount,
                            adults: Math.max(1, guestCount.adults - 1),
                          })
                        }
                        className="w-8 h-8 border border-gray-300 rounded-full hover:border-gray-900"
                      >
                        -
                      </button>
                      <span className="w-4 text-center">
                        {guestCount.adults}
                      </span>
                      <button
                        onClick={() =>
                          setGuestCount({
                            ...guestCount,
                            adults: Math.min(
                              property.maxGuests - guestCount.children,
                              guestCount.adults + 1
                            ),
                          })
                        }
                        className="w-8 h-8 border border-gray-300 rounded-full hover:border-gray-900"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Children</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setGuestCount({
                            ...guestCount,
                            children: Math.max(0, guestCount.children - 1),
                          })
                        }
                        className="w-8 h-8 border border-gray-300 rounded-full hover:border-gray-900"
                      >
                        -
                      </button>
                      <span className="w-4 text-center">
                        {guestCount.children}
                      </span>
                      <button
                        onClick={() =>
                          setGuestCount({
                            ...guestCount,
                            children: Math.min(
                              property.maxGuests - guestCount.adults,
                              guestCount.children + 1
                            ),
                          })
                        }
                        className="w-8 h-8 border border-gray-300 rounded-full hover:border-gray-900"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              {nights > 0 && (
                <div className="mb-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ${property.price} x {nights} nights
                    </span>
                    <span className="text-gray-900">
                      ${property.price * nights}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span className="text-gray-900">
                      ${Math.round(property.price * nights * 0.14)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cleaning fee</span>
                    <span className="text-gray-900">$75</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleReserve}
                disabled={totalGuests > property.maxGuests}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {totalGuests > property.maxGuests
                  ? `Max ${property.maxGuests} guests`
                  : property.instantBook
                  ? "Reserve"
                  : "Request to book"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    dispatch({ type: "SET_PROPERTY", payload: p.id });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md card-hover cursor-pointer group"
                >
                  <div className="relative h-48">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                      {p.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {p.location.city}, {p.location.country}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-gray-900">
                          ${p.price}
                        </span>
                        <span className="text-gray-600 text-sm"> / night</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">
                          {p.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={() =>
              setLightboxIndex(
                lightboxIndex === 0
                  ? property.images.length - 1
                  : lightboxIndex - 1
              )
            }
            className="absolute left-4 text-white hover:text-gray-300"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <img
            src={property.images[lightboxIndex]}
            alt={property.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          <button
            onClick={() =>
              setLightboxIndex(
                lightboxIndex === property.images.length - 1
                  ? 0
                  : lightboxIndex + 1
              )
            }
            className="absolute right-4 text-white hover:text-gray-300"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <div className="absolute bottom-4 text-white text-sm">
            {lightboxIndex + 1} / {property.images.length}
          </div>
        </div>
      )}
    </div>
  );
}
