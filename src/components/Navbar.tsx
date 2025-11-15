import { useState, useRef, useEffect } from "react";
import {
  Heart,
  Menu,
  User,
  X,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import { useRouter } from "../utils/router";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { navigate } = useRouter();
  const { state, logout } = useApp();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("home");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("home")}
          >
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("listings")}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Explore
            </button>

            {state.currentUser ? (
              <>
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
                  Bookings
                </button>
                <div className="w-px h-6 bg-gray-300" />

                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:shadow-md transition-all"
                  >
                    <Menu className="w-4 h-4" />
                    <div className="flex items-center gap-2">
                      <User className="w-6 h-6 bg-gray-700 text-white rounded-full p-1" />
                      <span className="text-sm font-medium text-gray-700">
                        {state.currentUser?.username || "user"}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-effect rounded-xl shadow-xl border border-gray-200 py-2 animate-slide-down">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {state.currentUser?.firstName}{" "}
                          {state.currentUser?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{state.currentUser?.username}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          navigate("dashboard");
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <UserCircle className="w-4 h-4" />
                        View Profile
                      </button>

                      <button
                        onClick={() => {
                          navigate("dashboard");
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>

                      <div className="border-t border-gray-200 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("login")}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("signup")}
                  className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Sign up
                </button>
              </>
            )}
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

            {state.currentUser ? (
              <>
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
                    navigate("dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                >
                  <User className="w-6 h-6 bg-gray-700 text-white rounded-full p-1" />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      @{state.currentUser?.username || "user"}
                    </span>
                    <span className="text-xs text-gray-500">View Profile</span>
                  </div>
                </button>

                <div className="pt-2 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("login");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    navigate("signup");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
