import React, { createContext, useContext, useReducer, useEffect } from "react";
import initialState from "../constants/initialState";

// ── Context ───────────────────────────────────────────────────────────────
export const HeatLoadContext = createContext(null);

// ── Reducer ───────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    // --- Project Info ---
    case "UPDATE_PROJECT":
      return {
        ...state,
        project: { ...state.project, ...action.payload },
      };

    case "UPDATE_AMBIENT":
      return {
        ...state,
        project: {
          ...state.project,
          ambient: { ...state.project.ambient, ...action.payload },
        },
      };

    // ─── NEW: AHU SELECTION LOGIC ─────────────────────────────────────────
    case "ADD_AHU": {
      const newAHU = {
        id: Date.now(),
        roomName: "",
        isoClass: "ISO 8",
        designScheme: "Conventional Pharma Ducting",
        configuration: "Draw-through"
      };
      return {
        ...state,
        // Fallback to [] if undefined
        ahus: [...(state.ahus || []), newAHU], 
      };
    }

    case "UPDATE_AHU": {
      const { id, field, value } = action.payload;
      // Safety check
      const currentAhus = state.ahus || []; 
      
      return {
        ...state,
        ahus: currentAhus.map((ahu) =>
          ahu.id === id ? { ...ahu, [field]: value } : ahu
        ),
      };
    }

    case "DELETE_AHU": {
      const { id } = action.payload;
      // Safety check
      const currentAhus = state.ahus || [];

      return {
        ...state,
        ahus: currentAhus.filter((ahu) => ahu.id !== id),
      };
    }
    // ──────────────────────────────────────────────────────────────────────

    // --- Room Data ---
    case "UPDATE_ROOM":
      return {
        ...state,
        room: { ...state.room, ...action.payload },
      };

    // --- Climate Data (Design Conditions) ---
    case "UPDATE_CLIMATE": {
      const { type, season, field, value, data } = action.payload;
      
      if (type === "inside") {
        return {
          ...state,
          climate: {
            ...state.climate,
            inside: { ...state.climate.inside, ...data },
          },
        };
      }
      
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

    // ─── RESET DATA (Use this to clear LocalStorage) ──────────────────────
    case "RESET_PROJECT":
      return initialState;

    default:
      return state;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────
export function HeatLoadProvider({ children }) {
  
  // 1. Initialize State from LocalStorage (if available)
  const init = (defaultState) => {
    try {
      const savedData = localStorage.getItem("heatLoadProjectData");
      return savedData ? JSON.parse(savedData) : defaultState;
    } catch (error) {
      console.error("Failed to load state from local storage:", error);
      return defaultState;
    }
  };

  // 2. Use Reducer with the init function
  const [state, dispatch] = useReducer(reducer, initialState, init);

  // 3. Save State to LocalStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("heatLoadProjectData", JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to local storage:", error);
    }
  }, [state]);

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