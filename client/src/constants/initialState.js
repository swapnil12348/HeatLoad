import ASHRAE from "./ashrae";

const initialState = {
  // ── Project Metadata ─────────────────────────────────────────────────────
  project: {
    client: "Client Name",
    jobRefNo: "JOB-001",
    date: new Date().toISOString().split("T")[0],
  },

  // ── Room / Zone Data ─────────────────────────────────────────────────────
  room: {
    name: "Zone 1",
    floorArea: 150, // sq ft defaults
    height: 10,     // ft
    volume: 1500,   // floorArea * height
    minFA: 0,       // Calculated later
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
  // CORRECTION: All elements are now Arrays []. 
  // This allows the Math Hook to loop through them consistently.
  elements: {
    glass: [
      {
        id: 1,
        label: "North Window",
        area: 40,
        uValue: 0.85, // Single pane
        // Solar Cooling Load (SCL) or CLTD
        diff: { summer: 35, monsoon: 30, winter: 10 }, 
      },
    ],
    walls: [
      {
        id: 2,
        label: "North Wall",
        area: 120,
        uValue: 0.35, // Brick 9"
        // Cooling Load Temperature Difference (CLTD)
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
    ceiling: [], // Empty by default
    floor: [],   // Empty by default
    partitions: [], // For walls next to non-AC rooms
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