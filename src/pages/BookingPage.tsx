import { useState } from "react";
import { CreditCard, Shield, Lock, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useRouter } from "../utils/router";
import { calculateNights, generateBookingId } from "../utils/helpers";

export default function BookingPage() {
  const { state, dispatch } = useApp();
  const { navigate } = useRouter();
  const [step, setStep] = useState(1);
  const [guestDetails, setGuestDetails] = useState({
    firstName: state.currentUser?.firstName || "",
    lastName: state.currentUser?.lastName || "",
    email: state.currentUser?.email || "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const booking = state.currentBooking;
  const property = booking?.propertyId
    ? state.properties.find((p) => p.id === booking.propertyId)
    : null;

  if (!booking || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No booking in progress
          </h2>
          <button onClick={() => navigate("listings")} className="btn-primary">
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  const nights =
    booking.checkIn && booking.checkOut
      ? calculateNights(booking.checkIn, booking.checkOut)
      : 0;

  const subtotal = property.price * nights;
  const serviceFee = Math.round(subtotal * 0.14);
  const cleaningFee = 75;
  const total = subtotal + serviceFee + cleaningFee;

  const handleSubmit = () => {
    const newBooking = {
      id: generateBookingId(),
      propertyId: property.id,
      userId: state.currentUser?.id || "guest",
      checkIn: booking.checkIn!,
      checkOut: booking.checkOut!,
      guests: booking.guests!,
      totalPrice: total,
      status: "confirmed" as const,
      createdAt: new Date().toISOString(),
      guestDetails,
    };

    dispatch({ type: "ADD_BOOKING", payload: newBooking });
    dispatch({
      type: "SET_CURRENT_BOOKING",
      payload: { ...booking, id: newBooking.id },
    });
    navigate("confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= num
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      step > num ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto mt-3">
            <span
              className={`text-sm ${
                step >= 1 ? "text-primary-600 font-semibold" : "text-gray-500"
              }`}
            >
              Details
            </span>
            <span
              className={`text-sm ${
                step >= 2 ? "text-primary-600 font-semibold" : "text-gray-500"
              }`}
            >
              Payment
            </span>
            <span
              className={`text-sm ${
                step >= 3 ? "text-primary-600 font-semibold" : "text-gray-500"
              }`}
            >
              Review
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Guest Details */}
            {step === 1 && (
              <div className="bg-white rounded-2xl p-8 shadow-md animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Guest Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={guestDetails.firstName}
                        onChange={(e) =>
                          setGuestDetails({
                            ...guestDetails,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={guestDetails.lastName}
                        onChange={(e) =>
                          setGuestDetails({
                            ...guestDetails,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) =>
                        setGuestDetails({
                          ...guestDetails,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={guestDetails.phone}
                      onChange={(e) =>
                        setGuestDetails({
                          ...guestDetails,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          Your information is secure
                        </h4>
                        <p className="text-sm text-blue-700">
                          We use industry-standard encryption to protect your
                          personal data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={
                    !guestDetails.firstName ||
                    !guestDetails.lastName ||
                    !guestDetails.email ||
                    !guestDetails.phone
                  }
                  className="w-full btn-primary mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-8 shadow-md animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Payment Method
                </h2>

                {/* Payment Method Selection */}
                <div className="space-y-3 mb-6">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="credit-card"
                      checked={paymentMethod === "credit-card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold">Credit or Debit Card</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                      P
                    </div>
                    <span className="font-semibold">PayPal</span>
                  </label>
                </div>

                {/* Card Details */}
                {paymentMethod === "credit-card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardDetails.number}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            number: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiry: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvv: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">
                        Secure Payment
                      </h4>
                      <p className="text-sm text-green-700">
                        Your payment information is encrypted and secure. We
                        never store your card details.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={
                      paymentMethod === "credit-card" &&
                      (!cardDetails.number ||
                        !cardDetails.name ||
                        !cardDetails.expiry ||
                        !cardDetails.cvv)
                    }
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Review Booking
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <div className="bg-white rounded-2xl p-8 shadow-md animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Review Your Booking
                </h2>

                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Guest Information
                    </h3>
                    <div className="text-gray-700 space-y-1">
                      <p>
                        {guestDetails.firstName} {guestDetails.lastName}
                      </p>
                      <p>{guestDetails.email}</p>
                      <p>{guestDetails.phone}</p>
                    </div>
                  </div>

                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Reservation Details
                    </h3>
                    <div className="text-gray-700 space-y-1">
                      <p>
                        Check-in:{" "}
                        {new Date(booking.checkIn!).toLocaleDateString()}
                      </p>
                      <p>
                        Check-out:{" "}
                        {new Date(booking.checkOut!).toLocaleDateString()}
                      </p>
                      <p>
                        Guests:{" "}
                        {(booking.guests?.adults || 0) +
                          (booking.guests?.children || 0)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Cancellation Policy
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Free cancellation for 48 hours after booking. Cancel
                      before check-in on{" "}
                      {new Date(booking.checkIn!).toLocaleDateString()} for a
                      partial refund.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      By selecting the button below, I agree to the Host's House
                      Rules, Ground rules for guests, Codakraft-apartment's
                      Rebooking and Refund Policy, and that Codakraft-apartment
                      can charge my payment method if I'm responsible for
                      damage.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 btn-secondary"
                  >
                    Back
                  </button>
                  <button onClick={handleSubmit} className="flex-1 btn-primary">
                    Confirm and Pay
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-4">
                Booking Summary
              </h3>

              <div className="flex gap-4 mb-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                    {property.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {property.location.city}, {property.location.country}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    ₦{property.price} x {nights} nights
                  </span>
                  <span className="text-gray-900">₦{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-gray-900">₦{serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cleaning fee</span>
                  <span className="text-gray-900">${cleaningFee}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold text-base">
                  <span>Total (USD)</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
