import {
  Home,
  DollarSign,
  Shield,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react";
import { useRouter } from "../utils/router";

export default function HostPage() {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Become a Host & Earn Money
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Share your space and turn your property into a thriving business
          </p>
          <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:scale-105">
            Get Started
          </button>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Why Host with ShortLet?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Earn Extra Income
            </h3>
            <p className="text-gray-600">
              Average hosts earn $10,000+ per year. Set your own prices and
              availability.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-accent-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Host Protection
            </h3>
            <p className="text-gray-600">
              $1M property damage protection and 24/7 support for all hosts.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Easy Management
            </h3>
            <p className="text-gray-600">
              Powerful tools to manage bookings, communicate with guests, and
              track earnings.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            How to Get Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6">
                1
              </div>
              <Home className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                List Your Space
              </h3>
              <p className="text-gray-600">
                Create a listing in minutes with photos, description, and
                amenities.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6">
                2
              </div>
              <Calendar className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Set Your Schedule
              </h3>
              <p className="text-gray-600">
                Control your availability and pricing. You're in complete
                control.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6">
                3
              </div>
              <Users className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Welcome Guests
              </h3>
              <p className="text-gray-600">
                Receive bookings, communicate with guests, and earn money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">
              500K+
            </div>
            <p className="text-gray-600">Active Hosts</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">$2B+</div>
            <p className="text-gray-600">Paid to Hosts</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">4.8</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">99%</div>
            <p className="text-gray-600">Payout Success</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-500 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Hosting?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of successful hosts and start earning today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all">
              List Your Property
            </button>
            <button
              onClick={() => navigate("home")}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
