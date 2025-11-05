import { Check, Download, Mail, Calendar, MapPin } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useRouter } from "../utils/router";

export default function ConfirmationPage() {
  const { state } = useApp();
  const { navigate } = useRouter();

  const booking = state.currentBooking;
  const property = booking?.propertyId
    ? state.properties.find((p) => p.id === booking.propertyId)
    : null;

  const confirmedBooking = booking?.id
    ? state.bookings.find((b) => b.id === booking.id)
    : null;

  if (!booking || !property || !confirmedBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Booking not found
          </h2>
          <button onClick={() => navigate("home")} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Your reservation has been successfully confirmed
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Confirmation Number:{" "}
            <span className="font-semibold text-primary-600">
              {confirmedBooking.id}
            </span>
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 animate-slide-up">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full md:w-64 h-48 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h2>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {property.location.address}, {property.location.city},{" "}
                    {property.location.country}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-semibold">Check-in</span>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {new Date(confirmedBooking.checkIn).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-600">After 3:00 PM</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-semibold">Check-out</span>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {new Date(confirmedBooking.checkOut).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-600">Before 11:00 AM</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {(confirmedBooking.guests.adults || 0) +
                        (confirmedBooking.guests.children || 0)}{" "}
                      guests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${confirmedBooking.totalPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  A confirmation email has been sent to{" "}
                  <span className="font-semibold text-gray-900">
                    {confirmedBooking.guestDetails.email}
                  </span>
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
            </div>
          </div>
        </div>

        {/* Host Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Your Host</h3>
          <div className="flex items-center gap-4 mb-6">
            <img
              src={property.host.avatar}
              alt={property.host.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h4 className="font-semibold text-gray-900">
                {property.host.name}
              </h4>
              <p className="text-sm text-gray-600">
                {property.host.verified && "✓ Verified Host • "}
                Joined {new Date(property.host.joinedDate).getFullYear()}
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Your host will be in touch closer to your check-in date to
            coordinate details and answer any questions.
          </p>
          <button className="btn-secondary w-full md:w-auto">
            Contact Host
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-600 font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Check your email
                </h4>
                <p className="text-gray-600">
                  You'll receive a confirmation email with all the booking
                  details and check-in instructions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-600 font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Prepare for your trip
                </h4>
                <p className="text-gray-600">
                  Review the house rules and any special instructions from your
                  host.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-600 font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Enjoy your stay
                </h4>
                <p className="text-gray-600">
                  Check in after 3:00 PM and have an amazing experience!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => navigate("dashboard")}
            className="flex-1 btn-primary"
          >
            View All Bookings
          </button>
          <button
            onClick={() => navigate("home")}
            className="flex-1 btn-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
