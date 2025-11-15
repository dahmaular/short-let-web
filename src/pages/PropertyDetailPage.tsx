import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  MapPin,
  Wifi,
  Share2,
  // Heart,
  Calendar,
  Shield,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  MessageCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useRouter } from "../utils/router";
import {
  calculateNights,
  calculateTotalPrice,
  formatCurrency,
} from "../utils/helpers";
import type { Property, Review } from "../types";
import Toast from "../components/Toast";
import type { ToastType } from "../components/Toast";
import { API_ENDPOINTS, config } from "../config/api";

export default function PropertyDetailPage() {
  const { dispatch } = useApp();
  const { navigate, currentPropertyId } = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [selectedDates, setSelectedDates] = useState({
    checkIn: "",
    checkOut: "",
  });
  const [guestCount, setGuestCount] = useState({
    adults: 2,
    children: 0,
    infants: 0,
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Clear any previous booking data when component mounts
  useEffect(() => {
    dispatch({
      type: "SET_CURRENT_BOOKING",
      payload: null,
    });
  }, [dispatch]);

  // Fetch property by ID from API
  useEffect(() => {
    const fetchProperty = async () => {
      if (!currentPropertyId) {
        setError("No property ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          API_ENDPOINTS.propertyById(currentPropertyId)
        );
        const data = await response.json();
        console.log("Property data:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch property");
        }

        setProperty(data.property);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [currentPropertyId]);

  // Fetch similar properties when property is loaded
  useEffect(() => {
    const fetchSimilarProperties = async () => {
      if (!property?.category) return;

      try {
        const params = new URLSearchParams();
        params.append("category", property.category);
        params.append("limit", "4");

        const response = await fetch(
          `${config.apiUrl}/api/properties?${params.toString()}`
        );
        const data = await response.json();

        if (response.ok) {
          // Filter out current property and limit to 3
          const filtered = (data.properties || [])
            .filter((p: Property) => p.id !== property.id)
            .slice(0, 3);
          setSimilarProperties(filtered);
        }
      } catch (err) {
        console.error("Error fetching similar properties:", err);
      }
    };

    fetchSimilarProperties();
  }, [property?.id, property?.category]);

  const reviews = property?.reviews || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Property not found"}
          </h2>
          <button onClick={() => navigate("listings")} className="btn-primary">
            Back to Listings
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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = property?.title || "Check out this property";
    const text = `${title} - ${property?.location.city}, ${property?.location.country}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      email: `mailto:?subject=${encodeURIComponent(
        title
      )}&body=${encodeURIComponent(text + "\n\n" + url)}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url).then(() => {
        setToast({
          message: "Link copied to clipboard!",
          type: "success",
        });
        setShareModalOpen(false);
      });
    } else {
      window.open(
        shareUrls[platform as keyof typeof shareUrls],
        "_blank",
        "width=600,height=400"
      );
      setShareModalOpen(false);
    }
  };

  const handleReserve = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      setToast({
        message: "Please select check-in and check-out dates",
        type: "warning",
      });
      return;
    }

    // Date validations
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    const checkInDate = new Date(selectedDates.checkIn);
    const checkOutDate = new Date(selectedDates.checkOut);

    // Validate check-in date is not in the past
    if (checkInDate < today) {
      setToast({
        message:
          "Check-in date cannot be in the past. Please select a future date.",
        type: "error",
      });
      return;
    }

    // Validate check-out date is after check-in date
    if (checkOutDate <= checkInDate) {
      setToast({
        message:
          "Check-out date must be after check-in date. Please select valid dates.",
        type: "error",
      });
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
            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            {/* <button
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
            </button> */}
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
                  {/* <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {property.type === "entire-place"
                      ? "Entire place"
                      : property.type === "private-room"
                      ? "Private room"
                      : "Shared room"}{" "}
                    hosted by {property.host.name}
                  </h2> */}
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
                {/* <img
                  src={property.host.avatar}
                  alt={property.host.name}
                  className="w-16 h-16 rounded-full"
                /> */}
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
                              {value as number}
                            </span>
                          </div>
                          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-900"
                              style={{
                                width: `${((value as number) / 5) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>

              <div className="space-y-6">
                {reviews.map((review: Review) => (
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
                    {formatCurrency(property.price)}
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
                      min={new Date().toISOString().split("T")[0]}
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
                      min={
                        selectedDates.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
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
                      {formatCurrency(property.price)} x {nights} nights
                    </span>
                    <span className="text-gray-900">
                      {formatCurrency(property.price * nights)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span className="text-gray-900">
                      {formatCurrency(
                        Math.round(property.price * nights * 0.14)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cleaning fee</span>
                    <span className="text-gray-900">{formatCurrency(75)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
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
                          {formatCurrency(p.price)}
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

      {/* Share Modal */}
      {shareModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Share this property
              </h3>
              <button
                onClick={() => setShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => handleShare("facebook")}
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  Facebook
                </span>
              </button>

              <button
                onClick={() => handleShare("twitter")}
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Twitter className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  Twitter
                </span>
              </button>

              <button
                onClick={() => handleShare("whatsapp")}
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  WhatsApp
                </span>
              </button>

              <button
                onClick={() => handleShare("linkedin")}
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  LinkedIn
                </span>
              </button>

              <button
                onClick={() => handleShare("email")}
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">Email</span>
              </button>

              <button
                onClick={() => handleShare("copy")}
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Copy className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  Copy Link
                </span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2 font-medium">
                Property Link:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none"
                />
                <button
                  onClick={() => handleShare("copy")}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
