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
  | { type: "SET_USER"; payload: User | null };

const initialState: AppState = {
  currentPage: "home",
  currentPropertyId: null,
  properties: mockProperties,
  filteredProperties: mockProperties,
  favorites: [],
  bookings: [],
  currentUser: {
    id: "user1",
    firstName: "Guest",
    lastName: "User",
    email: "guest@shortlet.com",
    verified: true,
    isHost: false,
  },
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
    default:
      return state;
  }
}

const AppContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<AppAction>;
    }
  | undefined
>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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
