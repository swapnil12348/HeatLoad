import { useHeatLoad } from "../context/HeatLoadContext";
import ASHRAE from "../constants/ashrae";
// Fallback styles in case file is missing
import { fieldLabel, fieldInput, readOnlyInput, COLOR } from "../constants/styles";

/**
 * RoomData
 * Handles basic room dimensions and ventilation parameters.
 * 
 * FIXES:
 * 1. Standardized to Imperial Units (Feet/SqFt) to match ASHRAE formulas.
 * 2. simplified volume calculation.
 */
export default function RoomData() {
  const { state, dispatch } = useHeatLoad();
  const { room } = state;

  // Generic field update
  const handleChange = (field, value) =>
    dispatch({ type: "UPDATE_ROOM", payload: { [field]: value } });

  // Handle Dimension Changes (Area or Height)
  // Automatically recalculates Volume
  const handleDimensionChange = (field, value) => {
    const newVal = parseFloat(value) || 0;
    
    // Create temporary object to calculate volume
    const currentDims = {
      floorArea: field === "floorArea" ? newVal : (room.floorArea || 0),
      height:    field === "height"    ? newVal : (room.height || 0),
    };

    const volume = Math.round(currentDims.floorArea * currentDims.height);
    
    // Dispatch updates
    dispatch({ 
        type: "UPDATE_ROOM", 
        payload: { 
            [field]: newVal, 
            volume: volume 
        } 
    });
  };

  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: 20, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, borderBottom: "1px solid #f3f4f6", paddingBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e3a8a" }}>
          Room Specification
        </h2>
      </div>

      {/* Identification */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div>
            <label style={fieldLabel}>Room Name / No.</label>
            <input type="text" value={room.name || ""} placeholder="e.g. Zone 1"
              onChange={(e) => handleChange("name", e.target.value)}
              style={fieldInput} />
        </div>
        <div>
            <label style={fieldLabel}>Location</label>
            <input type="text" value={room.location || ""} placeholder="Building A"
              onChange={(e) => handleChange("location", e.target.value)}
              style={fieldInput} />
        </div>
      </div>

      {/* Dimensions */}
      <div style={{ marginBottom: 16, background: "#f8fafc", padding: 16, borderRadius: 8, border: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#1e40af", marginBottom: 8 }}>
          Dimensional Data (Imperial)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          
          {/* Floor Area */}
          <div>
            <label style={fieldLabel}>Floor Area (ft²)</label>
            <input type="number" value={room.floorArea || ""}
              onChange={(e) => handleDimensionChange("floorArea", e.target.value)}
              style={fieldInput} placeholder="0" />
          </div>

          {/* Ceiling Height */}
          <div>
            <label style={fieldLabel}>Ceiling Height (ft)</label>
            <input type="number" value={room.height || ""}
              onChange={(e) => handleDimensionChange("height", e.target.value)}
              style={fieldInput} placeholder="0" />
          </div>

          {/* Volume (Read Only) */}
          <div>
            <label style={fieldLabel}>Volume (ft³)</label>
            <input type="number" value={room.volume || 0} readOnly 
                style={{...fieldInput, background: "#f1f5f9", color: "#64748b"}} />
          </div>

        </div>
      </div>

      {/* Ventilation Inputs (Simple) */}
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#15803d", marginBottom: 8 }}>
          Ventilation Requirements
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            <div>
                <label style={fieldLabel}>Min Air Changes (ACH)</label>
                <input type="number" step="0.1" value={room.minFAChanges || 0.5}
                  onChange={(e) => handleChange("minFAChanges", parseFloat(e.target.value) || 0)}
                  style={fieldInput} />
            </div>
            <div>
                <label style={fieldLabel}>Room Pressure</label>
                <select value={room.pressureLevel || "Positive"} 
                    onChange={(e) => handleChange("pressureLevel", e.target.value)}
                    style={fieldInput}>
                    <option value="Positive">Positive (+)</option>
                    <option value="Negative">Negative (-)</option>
                    <option value="Neutral">Neutral (0)</option>
                </select>
            </div>
        </div>
      </div>

    </div>
  );
}