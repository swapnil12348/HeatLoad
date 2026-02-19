import { createContext, useContext, useReducer } from "react";
import initialState from "../constants/initialState";

// ── Context ───────────────────────────────────────────────────────────────
export const HeatLoadContext = createContext(null);

// ── Reducer ───────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    // --- Project & Room Info ---
    case "UPDATE_PROJECT":
      return {
        ...state,
        project: { ...state.project, ...action.payload },
      };

    case "UPDATE_ROOM":
      return {
        ...state,
        room: { ...state.room, ...action.payload },
      };

    // --- Climate Data ---
    case "UPDATE_CLIMATE": {
      const { type, season, field, data, value } = action.payload;
      
      // Handle Inside Conditions (Simple Object Update)
      if (type === "inside") {
        return {
          ...state,
          climate: {
            ...state.climate,
            inside: { ...state.climate.inside, ...data }, // Expects data object { field: value }
          },
        };
      }
      
      // Handle Outside Conditions (Nested by Season)
      // Guard clause: Ensure season exists before trying to update it
      if (season && state.climate.outside[season]) {
        return {
          ...state,
          climate: {
            ...state.climate,
            outside: {
              ...state.climate.outside,
              [season]: { ...state.climate.outside[season], [field]: value },
            },
          },
        };
      }
      
      console.warn("Invalid Climate Update Payload:", action.payload);
      return state;
    }

    // --- Structural Elements (Arrays: Walls, Windows, etc.) ---
    case "ADD_ELEMENT_ROW": {
      const { category, newItem } = action.payload;
      return {
        ...state,
        elements: {
          ...state.elements,
          // Ensure we are spreading an array, fallback to empty array if undefined
          [category]: [...(state.elements[category] || []), newItem],
        },
      };
    }

    case "UPDATE_ELEMENT_ROW": {
      const { category, id, field, value } = action.payload;
      return {
        ...state,
        elements: {
          ...state.elements,
          [category]: state.elements[category].map((item) =>
            item.id === id ? { ...item, [field]: value } : item
          ),
        },
      };
    }

    // ★ NEW: Missing Delete Functionality
    case "DELETE_ELEMENT_ROW": {
      const { category, id } = action.payload;
      return {
        ...state,
        elements: {
          ...state.elements,
          [category]: state.elements[category].filter((item) => item.id !== id),
        },
      };
    }

    // ★ WARNING: Only use this for categories that are OBJECTS, not ARRAYS.
    // If you use this on 'walls' (which is an array), the app will crash.
    case "UPDATE_SINGLE_ELEMENT": {
      const { category, field, value } = action.payload;
      return {
        ...state,
        elements: {
          ...state.elements,
          [category]: { ...state.elements[category], [field]: value },
        },
      };
    }

    // --- Loads & Infiltration ---
    case "UPDATE_INTERNAL_LOADS": {
      const { type, data } = action.payload;
      return {
        ...state,
        internalLoads: {
          ...state.internalLoads,
          [type]: { ...state.internalLoads[type], ...data },
        },
      };
    }

    case "UPDATE_INFILTRATION":
      return {
        ...state,
        infiltration: { ...state.infiltration, ...action.payload },
      };

    default:
      return state;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────
export function HeatLoadProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Debugging: Log state changes to console (optional, helpful for dev)
  // console.log("Current State:", state);

  return (
    <HeatLoadContext.Provider value={{ state, dispatch }}>
      {children}
    </HeatLoadContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useHeatLoad() {
  const context = useContext(HeatLoadContext);
  if (!context) {
    throw new Error("useHeatLoad must be used inside <HeatLoadProvider>");
  }
  return context;
}