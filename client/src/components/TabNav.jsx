import { COLOR } from "../constants/styles";

export const TABS = [
  { id: "room",         label: "Room & Ventilation" },
  { id: "climate",      label: "1. Climate Conditions" },
  { id: "heat",         label: "2. Heat Gain / Loss" },
  { id: "infiltration", label: "3. Infiltration" },
  { id: "results",      label: "4. Results & Selection" },
];

/**
 * TabNav
 * Pill-style tab bar for navigating between calculator sections.
 *
 * @param {string}   activeTab  - Currently active tab id
 * @param {function} onSelect   - Callback receiving the selected tab id
 */
export default function TabNav({ activeTab, onSelect }) {
  return (
    <div style={{
      display: "flex", gap: 2, marginBottom: 20,
      background: "#e2e8f0", borderRadius: 10, padding: 4,
      overflowX: "auto",
    }}>
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            style={{
              padding: "9px 16px",
              fontSize: 12,
              fontWeight: active ? 700 : 500,
              border: "none",
              borderRadius: 7,
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: active ? "#fff" : "transparent",
              color: active ? COLOR.brandMid : "#64748b",
              boxShadow: active ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}