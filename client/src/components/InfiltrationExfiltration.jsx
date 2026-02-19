import { useEffect } from "react";
import { useHeatLoad } from "../context/HeatLoadContext";
import { tableHeaderCell, tableBodyCell, cellInput, COLOR } from "../constants/styles";

// Fallback styles if file missing
const th = (extra = {}) => ({ ...tableHeaderCell, ...extra });
const td = (extra = {}) => ({ ...tableBodyCell, ...extra });

/**
 * InfiltrationExfiltration
 * Manages leakage paths (doors/windows).
 * 
 * FIXES:
 * 1. Updates Global State with total CFM (required for Results tab).
 * 2. standardized on Imperial Units (ft/ft²).
 */
export default function InfiltrationExfiltration() {
  const { state, dispatch } = useHeatLoad();
  // Ensure doors array exists, default to empty
  const doors = state.infiltration?.doors || [];

  // ── Helper: Calculate Total & Update State ────────────────────────────────
  // We need to sync the calculated Total CFM to the state so useSystemResults can read it.
  const syncTotalCFM = (currentDoors) => {
    const totalInfil = currentDoors.reduce((s, d) => s + (parseFloat(d.infilCFM) || 0), 0);
    
    dispatch({
      type: "UPDATE_INFILTRATION",
      payload: { 
        doors: currentDoors,
        cfm: totalInfil // ★ CRITICAL: This allows the Results tab to see the total
      },
    });
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const addDoor = () => {
    const newDoors = [
      ...doors,
      {
        id: Date.now(), 
        thru: "Door", 
        nos: 1, 
        type: "Standard",
        area: 20, // sq ft
        width: 3, // ft
        height: 7, // ft
        pressure: 0.1, 
        infilCFM: 0, 
        exfilCFM: 0,
      },
    ];
    syncTotalCFM(newDoors);
  };

  const updateDoor = (id, field, value) => {
    const newDoors = doors.map((d) => (d.id === id ? { ...d, [field]: value } : d));
    syncTotalCFM(newDoors);
  };

  const removeDoor = (id) => {
    const newDoors = doors.filter((d) => d.id !== id);
    syncTotalCFM(newDoors);
  };

  // Calculate totals for Display
  const totalInfil = doors.reduce((s, d) => s + (parseFloat(d.infilCFM) || 0), 0);
  const totalExfil = doors.reduce((s, d) => s + (parseFloat(d.exfilCFM) || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1e3a8a" }}>
            3. Infiltration (Air Leakage)
          </h2>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
            Enter known CFM leakage per opening (Crack Method or ACH)
          </div>
        </div>
        <button
          onClick={addDoor}
          style={{ padding: "8px 14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
        >
          + Add Opening
        </button>
      </div>

      {/* Warning / Note */}
      <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 8, padding: "10px 14px", fontSize: 11, color: "#92400e" }}>
        <strong>ASHRAE Note:</strong> Calculated CFM is used to determine Sensible (Qs = 1.08 × CFM × ΔT) and Latent (Ql = 0.68 × CFM × ΔGr) loads in the Results tab.
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...th({ textAlign: "left" }) }} rowSpan={2}>Source</th>
                <th style={th()} rowSpan={2}>Qty</th>
                <th style={th({ background: "#eff6ff" })} colSpan={3}>Dimensions (ft)</th>
                <th style={th({ background: "#f0fdf4" })} colSpan={2}>Air Flow (CFM)</th>
                <th style={th()} rowSpan={2}></th>
              </tr>
              <tr>
                {["Area (ft²)", "Width (ft)", "Height (ft)"].map((h) => (
                  <th key={h} style={th({ background: "#eff6ff", fontSize: 9 })}>{h}</th>
                ))}
                {["Infiltration", "Exfiltration"].map((h) => (
                  <th key={h} style={th({ background: "#f0fdf4", fontSize: 9 })}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doors.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                    No infiltration sources added. Use the button above to add doors, windows, or cracks.
                  </td>
                </tr>
              ) : (
                doors.map((door) => (
                  <tr key={door.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    {/* Type */}
                    <td style={td()}>
                      <select value={door.thru} onChange={(e) => updateDoor(door.id, "thru", e.target.value)}
                        style={{ ...cellInput, cursor: "pointer" }}>
                        <option>Door</option>
                        <option>Window</option>
                        <option>Crack / Gap</option>
                        <option>Vent</option>
                      </select>
                    </td>
                    <td style={td()}><input type="number" style={cellInput} value={door.nos} onChange={(e) => updateDoor(door.id, "nos", e.target.value)} /></td>

                    {/* Dimensions */}
                    {["area", "width", "height"].map((f) => (
                      <td key={f} style={td({ background: "#eff6ff" })}>
                        <input type="number" step="0.1" style={{ ...cellInput, color: "#1d4ed8" }} value={door[f]} onChange={(e) => updateDoor(door.id, f, e.target.value)} />
                      </td>
                    ))}

                    {/* Infiltration CFM */}
                    <td style={td({ background: "#f0fdf4" })}>
                      <input type="number" step="0.1" style={{ ...cellInput, fontWeight: 700, color: "#15803d" }} value={door.infilCFM} onChange={(e) => updateDoor(door.id, "infilCFM", e.target.value)} />
                    </td>
                    {/* Exfiltration CFM */}
                    <td style={td({ background: "#fff1f2" })}>
                      <input type="number" step="0.1" style={{ ...cellInput, fontWeight: 700, color: "#be123c" }} value={door.exfilCFM} onChange={(e) => updateDoor(door.id, "exfilCFM", e.target.value)} />
                    </td>

                    {/* Delete */}
                    <td style={td({ textAlign: "center" })}>
                      <button onClick={() => removeDoor(door.id)}
                        style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 24, padding: 16, background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
        {[
          ["Total Infiltration", totalInfil.toFixed(1), "#16a34a"],
          ["Total Exfiltration", totalExfil.toFixed(1), "#dc2626"],
        ].map(([label, value, color]) => (
          <div key={label} style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.07em" }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>
              {value} <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>cfm</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}