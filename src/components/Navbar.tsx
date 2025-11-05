import { useState } from "react";
import { Heart, Menu, User, X } from "lucide-react";
import { useRouter } from "../utils/router";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigate } = useRouter();
  const { state } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("home")}
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              ShortLet
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("listings")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Explore
            </button>
            <button
              onClick={() => navigate("dashboard")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center gap-1"
            >
              <Heart className="w-4 h-4" />
              Favorites
              {state.favorites.length > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("dashboard")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Trips
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <button
              onClick={() => navigate("host")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Become a Host
            </button>
            <button
              onClick={() => navigate("dashboard")}
              className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:shadow-md transition-all"
            >
              <Menu className="w-4 h-4" />
              <User className="w-6 h-6 bg-gray-700 text-white rounded-full p-1" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-effect border-t border-gray-200 animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => {
                navigate("listings");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Explore
            </button>
            <button
              onClick={() => {
                navigate("dashboard");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favorites
              </span>
              {state.favorites.length > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                navigate("dashboard");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Trips
            </button>
            <button
              onClick={() => {
                navigate("host");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Become a Host
            </button>
            <button
              onClick={() => {
                navigate("dashboard");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
            >
              <User className="w-6 h-6 bg-gray-700 text-white rounded-full p-1" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
