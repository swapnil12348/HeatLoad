// constants/cleanroomStandards.js
export const ISO_CLASSES = {
  "ISO 5": { label: "ISO 5 (Class 100)", achMin: 240, achMax: 480 },
  "ISO 6": { label: "ISO 6 (Class 1,000)", achMin: 150, achMax: 240 },
  "ISO 7": { label: "ISO 7 (Class 10,000)", achMin: 60, achMax: 90 },
  "ISO 8": { label: "ISO 8 (Class 100,000)", achMin: 5, achMax: 48 },
  "CNC":   { label: "CNC (Controlled Not Classified)", achMin: 2, achMax: 4 }
};

export const PRESSURE_OPTS = [
  { value: 0.05, label: "High Positive (+0.05 in.wg)" },
  { value: 0.03, label: "Standard Positive (+0.03 in.wg)" },
  { value: -0.03, label: "Negative (-0.03 in.wg)" },
  { value: 0, label: "Neutral (0.00 in.wg)" }
];