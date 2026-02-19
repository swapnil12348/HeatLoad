/**
 * Global Styles & Constants
 * Shared colors and input styles for consistency across the app.
 */

export const COLOR = {
  // Brand / Primary Blues
  brand:      "#1e3a8a",
  brandMid:   "#3b82f6",
  brandLight: "#eff6ff",
  brandBorder:"#bfdbfe",

  // Status Colors
  green:       "#16a34a",
  greenLight:  "#f0fdf4",
  greenBorder: "#bbf7d0",
  
  red:         "#dc2626",
  redLight:    "#fef2f2",

  amber:       "#d97706",
  amberLight:  "#fffbeb",
  amberBorder: "#fcd34d",

  purple:      "#7c3aed",
  
  // Grays / Neutrals
  white:   "#ffffff",
  gray50:  "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray700: "#374151",
  black:   "#000000",
};

// ── Shared Input Styles ───────────────────────────────────────────────────

export const fieldLabel = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: COLOR.gray700,
  marginBottom: 4,
};

export const fieldInput = {
  width: "100%",
  padding: "8px 10px",
  fontSize: 13,
  // FIXED: Forces text to be black (overrides global white text)
  color: COLOR.black, 
  // FIXED: Darker border so the box is visible
  border: `1px solid ${COLOR.gray400}`, 
  borderRadius: 6,
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export const readOnlyInput = {
  ...fieldInput,
  background: COLOR.gray50,
  color: COLOR.gray500,
  cursor: "not-allowed",
  border: `1px solid ${COLOR.gray300}`,
};

// ── Shared Table Styles ───────────────────────────────────────────────────

export const tableHeaderCell = {
  padding: "8px 10px",
  fontSize: 11,
  fontWeight: 700,
  color: COLOR.gray500,
  border: `1px solid ${COLOR.gray300}`, // Darker border for visibility
  background: COLOR.gray50,
  textAlign: "center",
};

export const tableBodyCell = {
  padding: "0", 
  fontSize: 13,
  border: `1px solid ${COLOR.gray300}`, // Darker border
  color: COLOR.black, // FIXED: Ensures cell text is black
  position: "relative",
};

export const cellInput = {
  width: "100%",
  height: "100%",
  border: "none",
  background: "transparent",
  fontSize: 13,
  textAlign: "center",
  outline: "none",
  padding: "6px 8px",
  // FIXED: This was missing! It forces table input text to be black.
  color: COLOR.black, 
  boxSizing: "border-box",
};