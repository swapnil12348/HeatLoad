

export const TABS = [
  { id: "project",      label: "Project Info" }, // Added this so you can go back to the first screen
  { id: "ahu",          label: "AHU Selection" }, // <--- FIXED THIS LINE
  { id: "room",         label: "Room & Ventilation" },
  { id: "climate",      label: "1. Climate Conditions" },
  { id: "heat",         label: "2. Heat Gain / Loss" },
  { id: "infiltration", label: "3. Infiltration" },
  { id: "results",      label: "4. Results & Selection" },
];

/**
 * TabNav
 * Pill-style tab bar for navigating between calculator sections.
 */
export default function TabNav({ activeTab, onSelect }) {
  return (
    <div style={{
      display: "flex", gap: 6, marginBottom: 20,
      background: "#f1f5f9", borderRadius: 12, padding: 6,
      overflowX: "auto", border: "1px solid #e2e8f0"
    }}>
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            style={{
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: active ? "#ffffff" : "transparent",
              color: active ? "#1d4ed8" : "#64748b", // Blue text when active
              boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}