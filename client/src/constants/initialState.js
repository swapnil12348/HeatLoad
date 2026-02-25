import ASHRAE from "./ashrae";

const initialState = {
  // ── Project Metadata ─────────────────────────────────────────────────────
  project: {
    projectName: "", 
    projectLocation: "",
    customerName: "",
    consultantName: "",
    industry: "Semiconductor", 
    keyAccountManager: "",
    
    // Ambient Conditions for Calculations
    ambient: {
      elevation: 0,      // ft or m
      dryBulbTemp: 35,   // °C
      wetBulbTemp: 24,   // °C
      latitude: 0,       // Degrees
      relativeHumidity: 50 // %
    },
    
    // ❌ REMOVED 'ahus' from here. 
    // It must be at the root level to work with your Reducer.
  },

  // ✅ MOVED 'ahus' TO ROOT LEVEL
  ahus: [
    {
      id: 1, // Start with one default AHU
      roomName: "",
      isoClass: "ISO 8",
      designScheme: "Conventional Pharma Ducting",
      configuration: "Draw-through"
    }
  ],

  // ── Room / Zone Data ─────────────────────────────────────────────────────
  room: {
    name: "Zone 1",
    floorArea: 150, // sq ft defaults
    height: 10,     // ft
    volume: 1500,   // floorArea * height
    minFA: 0,       // Calculated later
  },

  systemDesign: {
    safetyFactor: ASHRAE?.DEFAULT_SAFETY_FACTOR_PCT || 10,
    bypassFactor: ASHRAE?.DEFAULT_BYPASS_FACTOR || 0.10,
    adp:          ASHRAE?.DEFAULT_ADP || 50, // Apparatus Dew Point
    fanHeat:      ASHRAE?.DEFAULT_FAN_HEAT_PCT || 5,
  },

  // ── Climate Design Conditions ────────────────────────────────────────────
  climate: {
    outside: {
      summer:  { db: 105, wb: 78, rh: 40, month: "May" },
      monsoon: { db: 95,  wb: 82, rh: 65, month: "Aug" },
      winter:  { db: 55,  wb: 48, rh: 60, month: "Dec" },
    },
    // Standard Indoor Comfort (75°F / 50% RH)
    inside: { db: 75, rh: 50 },
  },

  // ── Building Envelope Elements ───────────────────────────────────────────
  elements: {
    glass: [
      {
        id: 1,
        label: "North Window",
        area: 40,
        uValue: 0.85, 
        diff: { summer: 35, monsoon: 30, winter: 10 }, 
      },
    ],
    walls: [
      {
        id: 2,
        label: "North Wall",
        area: 120,
        uValue: 0.35, 
        diff: { summer: 25, monsoon: 20, winter: 40 },
      },
    ],
    roof: [
      {
        id: 3,
        label: "Exposed Roof",
        area: 150,
        uValue: 0.22,
        diff: { summer: 45, monsoon: 35, winter: 20 },
      }
    ],
    ceiling: [], 
    floor: [],   
    partitions: [], 
  },

  // ── Internal Heat Gains ──────────────────────────────────────────────────
  internalLoads: {
    people: {
      count: 4,
      sensiblePerPerson: ASHRAE?.PEOPLE_SENSIBLE_SEATED || 245, 
      latentPerPerson:   ASHRAE?.PEOPLE_LATENT_SEATED || 205,
    },
    equipment: { 
      kw: 0.5, // 500 Watts
    },
    lights: {
      wattsPerSqFt: ASHRAE?.LPD_OFFICE || 1.1,
    },
  },

  // ── Infiltration ─────────────────────────────────────────────────────────
  infiltration: {
    method: "air_change", // or "crack_length"
    airChangesPerHour: 0.5,
    cfm: 0, // Calculated result
  },
};

export default initialState;