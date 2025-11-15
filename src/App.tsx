import { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import DashboardPage from "./pages/DashboardPage";
import HostPage from "./pages/HostPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import type { Page } from "./types";

function AppContent() {
  const { state, dispatch } = useApp();

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      const path = hash.split("?")[0]; // Get path before query params

      // Map hash paths to pages
      const pageMap: Record<string, Page> = {
        "/": "home",
        "/home": "home",
        "/listings": "listings",
        "/property": "property",
        "/booking": "booking",
        "/confirmation": "confirmation",
        "/dashboard": "dashboard",
        "/host": "host",
        "/login": "login",
        "/signup": "signup",
      };

      const page = pageMap[path] || "home";

      // Only dispatch if the page is different
      if (page !== state.currentPage) {
        dispatch({ type: "SET_PAGE", payload: page });
      }
    };

    // Handle initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [dispatch, state.currentPage]);

  const renderPage = () => {
    switch (state.currentPage) {
      case "home":
        return <HomePage />;
      case "listings":
        return <ListingsPage />;
      case "property":
        return <PropertyDetailPage />;
      case "booking":
        return <BookingPage />;
      case "confirmation":
        return <ConfirmationPage />;
      case "dashboard":
        return <DashboardPage />;
      case "host":
        return <HostPage />;
      case "login":
        return <LoginPage />;
      case "signup":
        return <SignupPage />;
      default:
        return <HomePage />;
    }
  };

  // Hide Navbar and Footer on login/signup pages
  const hideLayout =
    state.currentPage === "login" || state.currentPage === "signup";

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}
      <main className="flex-1">{renderPage()}</main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
