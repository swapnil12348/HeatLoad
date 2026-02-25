import React, { createContext, useContext, useReducer } from "react";
import initialState from "../constants/initialState";

// ── Context ───────────────────────────────────────────────────────────────
export const HeatLoadContext = createContext(null);

// ── Reducer ───────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    // --- Project Info ---
    case "UPDATE_PROJECT":
      // Updates top-level project fields (Name, Client, Industry, etc.)
      return {
        ...state,
        project: { ...state.project, ...action.payload },
      };

    // --- Ambient Conditions ---
    case "UPDATE_AMBIENT":
      // Updates nested ambient fields (Elevation, Temp, etc.) safely
      return {
        ...state,
        project: {
          ...state.project,
          ambient: { ...state.project.ambient, ...action.payload },
        },
      };

    // --- Room Data ---
    case "UPDATE_ROOM":
      return {
        ...state,
        room: { ...state.room, ...action.payload },
      };

    // --- Climate Data (Design Conditions) ---
    case "UPDATE_CLIMATE": {
      const { type, season, field, value, data } = action.payload;
      
      // Handle Inside Conditions
      if (type === "inside") {
        return {
          ...state,
          climate: {
            ...state.climate,
            inside: { ...state.climate.inside, ...data },
          },
        };
      }
      
      // Handle Outside Conditions
      if (type === "outside" && season && state.climate.outside[season]) {
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
      return state;
    }

    // --- Structural Elements (Arrays: Walls, Windows, etc.) ---
    case "ADD_ELEMENT_ROW": {
      const { category, newItem } = action.payload;
      return {
        ...state,
        elements: {
          ...state.elements,
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

  // Helper: Update top-level project text fields
  const updateProjectField = (field, value) => {
    dispatch({ type: "UPDATE_PROJECT", payload: { [field]: value } });
  };

  // Helper: Update nested ambient number fields
  const updateAmbientField = (field, value) => {
    // Ensure value is stored as a number for calculations
    dispatch({ 
      type: "UPDATE_AMBIENT", 
      payload: { [field]: parseFloat(value) || 0 } 
    });
  };

  return (
    <HeatLoadContext.Provider 
      value={{ 
        state, 
        dispatch, 
        updateProjectField, 
        updateAmbientField 
      }}
    >
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