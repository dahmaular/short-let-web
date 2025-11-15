import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import type { Property, Booking, User, SearchFilters, Page } from "../types";
import { mockProperties } from "../data/mockData";

interface AppState {
  currentPage: Page;
  currentPropertyId: string | null;
  properties: Property[];
  filteredProperties: Property[];
  favorites: string[];
  bookings: Booking[];
  currentUser: User | null;
  searchFilters: Partial<SearchFilters>;
  currentBooking: Partial<Booking> | null;
}

type AppAction =
  | { type: "SET_PAGE"; payload: Page }
  | { type: "SET_PROPERTY"; payload: string }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "SET_SEARCH_FILTERS"; payload: Partial<SearchFilters> }
  | { type: "FILTER_PROPERTIES"; payload: Property[] }
  | { type: "ADD_BOOKING"; payload: Booking }
  | { type: "SET_CURRENT_BOOKING"; payload: Partial<Booking> | null }
  | { type: "CANCEL_BOOKING"; payload: string }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" };

// Check for stored user and token on initial load
const getInitialUser = (): User | null => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");
  if (storedUser && storedToken) {
    return JSON.parse(storedUser);
  }
  return null;
};

const initialState: AppState = {
  currentPage: "home",
  currentPropertyId: null,
  properties: mockProperties,
  filteredProperties: mockProperties,
  favorites: [],
  bookings: [],
  currentUser: getInitialUser(),
  searchFilters: {},
  currentBooking: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_PROPERTY":
      return { ...state, currentPropertyId: action.payload };
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    case "SET_SEARCH_FILTERS":
      return {
        ...state,
        searchFilters: { ...state.searchFilters, ...action.payload },
      };
    case "FILTER_PROPERTIES":
      return { ...state, filteredProperties: action.payload };
    case "ADD_BOOKING":
      return { ...state, bookings: [...state.bookings, action.payload] };
    case "SET_CURRENT_BOOKING":
      return { ...state, currentBooking: action.payload };
    case "CANCEL_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload
            ? { ...booking, status: "cancelled" as const }
            : booking
        ),
      };
    case "SET_USER":
      return { ...state, currentUser: action.payload };
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return { ...state, currentUser: action.payload.user };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { ...state, currentUser: null, favorites: [], bookings: [] };
    default:
      return state;
  }
}

const AppContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<AppAction>;
      login: (user: User, token: string) => void;
      logout: () => void;
    }
  | undefined
>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = (user: User, token: string) => {
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
