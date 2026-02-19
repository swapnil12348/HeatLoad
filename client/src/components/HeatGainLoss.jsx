import { useHeatLoad } from "../context/HeatLoadContext";
import { useHeatGainTotals } from "../hooks/useHeatGainTotals";
import ASHRAE from "../constants/ashrae";
import { tableHeaderCell, tableBodyCell, COLOR } from "../constants/styles"; 

// ── FIX START ─────────────────────────────────────────────────────────────
const numInput = {
  width: "100%", 
  padding: "4px 6px", 
  fontSize: 12,
  // FIXED: Darker border (gray400) instead of faint gray
  border: `1px solid ${COLOR.gray400 || "#9ca3af"}`, 
  borderRadius: 4,
  textAlign: "center", 
  outline: "none", 
  background: "#fff",
  // FIXED: Force text to be black
  color: "#000000",
};
// ── FIX END ───────────────────────────────────────────────────────────────

/** 
 * EnvelopeRow
 * Handles a single row of input for Glass, Walls, Roof, etc.
 * Now handles ALL categories consistently.
 */
function EnvelopeRow({ item, category, dispatch }) {
  // Safe helper to update a specific field in the row
  const updateField = (field, value) =>
    dispatch({ type: "UPDATE_ELEMENT_ROW", payload: { category, id: item.id, field, value } });

  // Safe helper to update seasonal temperature differences
  const updateDiff = (season, value) =>
    updateField("diff", { ...item.diff, [season]: parseFloat(value) || 0 });

  // Delete handler
  const deleteRow = () => 
    dispatch({ type: "DELETE_ELEMENT_ROW", payload: { category, id: item.id } });

  const q = (season) =>
    Math.round((item.area || 0) * (item.diff?.[season] || 0) * (item.uValue || 0)).toLocaleString();

  return (
    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
      <td style={{ ...tableBodyCell, fontWeight: 600, display: 'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span>
            {item.label}{" "}
            {item.direction && <span style={{ color: "#9ca3af", fontWeight: 400 }}>({item.direction})</span>}
        </span>
        {/* Only show delete button for non-primary rows or if you want full flexibility */}
        <button onClick={deleteRow} style={{border:'none', background:'transparent', color:'#ef4444', cursor:'pointer', fontSize:14}}>×</button>
      </td>
      <td style={tableBodyCell}>
        <input type="number" style={numInput} value={item.area}
          onChange={(e) => updateField("area", parseFloat(e.target.value) || 0)} />
      </td>
      {["summer", "monsoon", "winter"].map((s) => (
        <td key={s} style={{ ...tableBodyCell, background: "#fffbeb" }}>
          <input type="number" 
            // We ensure the text color remains black even with the yellow background
            style={{ ...numInput, background: "#fffbeb", color: "#000" }}
            value={item.diff?.[s] || 0} onChange={(e) => updateDiff(s, e.target.value)} />
        </td>
      ))}
      <td style={tableBodyCell}>
        <input type="number" step="0.01" style={numInput} value={item.uValue}
          onChange={(e) => updateField("uValue", parseFloat(e.target.value) || 0)} />
      </td>
      {["summer", "monsoon", "winter"].map((s) => (
        <td key={s + "_r"} style={{ ...tableBodyCell, textAlign: "right", fontFamily: "monospace", color: "#0369a1", background: "#f0f9ff" }}>
          {q(s)}
        </td>
      ))}
    </tr>
  );
}

const th = (extra = {}) => ({ ...tableHeaderCell, ...extra });

/**
 * HeatGainLoss
 * Envelope heat gain table & Internal loads.
 */
export default function HeatGainLoss() {
  const { state, dispatch } = useHeatLoad();
  const { elements, internalLoads } = state;
  const totals = useHeatGainTotals(elements, internalLoads, state.room.floorArea);

  // Generic function to add a new row to any category
  const addRow = (category, label) => {
    const uDefaults = { glass: 0.8, walls: 0.3, roof: 0.2, ceiling: 0.1, floor: 0.1 };
    dispatch({
      type: "ADD_ELEMENT_ROW",
      payload: {
        category,
        newItem: { 
            id: Date.now(), 
            label: label || `New ${category}`, 
            direction: "", 
            area: 0, 
            uValue: uDefaults[category] || 0.5, 
            diff: { summer: 0, monsoon: 0, winter: 0 } 
        },
      },
    });
  };

  // ── Calculation Display Logic (Mirroring the Hook) ──
  const lightsBtu = Math.round(
    (internalLoads.lights?.wattsPerSqFt || 0) * 
    (state.room.floorArea || 0) * 
    // Assuming floorArea is in ft2, if m2, multiply by ASHRAE.M2_TO_FT2
    (ASHRAE.BTU_PER_WATT || 3.412)
  );

  const equipBtu = Math.round((internalLoads.equipment?.kw || 0) * (ASHRAE.KW_TO_BTU || 3412));
  
  const pplSens = Math.round(
    (internalLoads.people?.count || 0) * 
    (internalLoads.people?.sensiblePerPerson || ASHRAE.PEOPLE_SENSIBLE_SEATED)
  );
  
  const pplLat = Math.round(
    (internalLoads.people?.count || 0) * 
    (internalLoads.people?.latentPerPerson || ASHRAE.PEOPLE_LATENT_SEATED)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1e3a8a" }}>
          2. Heat Gain / Loss Calculations
        </h2>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, background: "#dbeafe", color: "#1e40af", border: "1px solid #93c5fd", borderRadius: 4, padding: "3px 8px" }}>
          ASHRAE Fundamentals Ch. 18
        </span>
      </div>

      {/* ── Envelope Table ─────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "12px 16px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#1e3a8a" }}>A. Sensible Heat — Envelope</span>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>Q = U × A × CLTD</div>
          </div>
          {/* Quick Add Buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
                { key: 'glass', label: '+ Glass', color: '#eff6ff', txt: '#1d4ed8' },
                { key: 'walls', label: '+ Wall', color: '#f0fdf4', txt: '#15803d' },
                { key: 'roof', label: '+ Roof', color: '#fff7ed', txt: '#c2410c' }
            ].map(btn => (
                <button key={btn.key} onClick={() => addRow(btn.key, `New ${btn.key}`)}
                    style={{ padding: "5px 10px", fontSize: 11, background: btn.color, color: btn.txt, border: "none", borderRadius: 5, cursor: "pointer", fontWeight: 600 }}>
                    {btn.label}
                </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...th({ textAlign: "left" }), width: 160 }}>Description</th>
                <th style={th()}>Area (ft²)</th>
                <th style={{ ...th({ background: "#fef9c3" }) }} colSpan={3}>CLTD / ETD (°F)</th>
                <th style={th()}>U-Value</th>
                <th style={{ ...th({ background: "#eff6ff" }) }} colSpan={3}>Heat Gain Q (BTU/hr)</th>
              </tr>
              <tr>
                <th colSpan={2}></th>
                {["Smr", "Mon", "Wtr"].map((s) => (
                  <th key={s} style={{ ...th({ background: "#fef3c7", fontWeight: 600, fontSize: 10 }) }}>{s}</th>
                ))}
                <th></th>
                {["Smr", "Mon", "Wtr"].map((s) => (
                  <th key={s} style={{ ...th({ background: "#eff6ff", fontWeight: 600, fontSize: 10 }) }}>{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Render dynamic rows for ALL categories */}
              {elements.glass?.map((item) => <EnvelopeRow key={item.id} item={item} category="glass" dispatch={dispatch} />)}
              {elements.walls?.map((item) => <EnvelopeRow key={item.id} item={item} category="walls" dispatch={dispatch} />)}
              {elements.roof?.map((item) => <EnvelopeRow key={item.id} item={item} category="roof" dispatch={dispatch} />)}
              {elements.ceiling?.map((item) => <EnvelopeRow key={item.id} item={item} category="ceiling" dispatch={dispatch} />)}
              {elements.floor?.map((item) => <EnvelopeRow key={item.id} item={item} category="floor" dispatch={dispatch} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Internal Loads Table ───────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "12px 16px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#1e3a8a" }}>B. Internal Loads</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Source", "Qty / Cap", "Unit Sensible", "Unit Latent", "Total Sens (BTU)", "Total Lat (BTU)"].map((h, i) => (
                <th key={h} style={{ ...tableHeaderCell, textAlign: i === 0 ? "left" : "center" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* People */}
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ ...tableBodyCell, fontWeight: 600 }}>People</td>
              <td style={tableBodyCell}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="number" style={{ ...numInput, width: 60 }} value={internalLoads.people?.count || 0}
                    onChange={(e) => dispatch({ type: "UPDATE_INTERNAL_LOADS", payload: { type: "people", data: { count: parseFloat(e.target.value) || 0 } } })} />
                  <span style={{ fontSize: 11, color: "#6b7280" }}>p</span>
                </div>
              </td>
              <td style={tableBodyCell}>
                  <input type="number" style={{ ...numInput, width: 70 }} value={internalLoads.people?.sensiblePerPerson || 245}
                    onChange={(e) => dispatch({ type: "UPDATE_INTERNAL_LOADS", payload: { type: "people", data: { sensiblePerPerson: parseFloat(e.target.value) || 0 } } })} />
              </td>
              <td style={tableBodyCell}>
                  <input type="number" style={{ ...numInput, width: 70 }} value={internalLoads.people?.latentPerPerson || 205}
                    onChange={(e) => dispatch({ type: "UPDATE_INTERNAL_LOADS", payload: { type: "people", data: { latentPerPerson: parseFloat(e.target.value) || 0 } } })} />
              </td>
              <td style={{ ...tableBodyCell, textAlign: "right", fontFamily: "monospace", color: "#0369a1", background: "#f0f9ff" }}>{pplSens.toLocaleString()}</td>
              <td style={{ ...tableBodyCell, textAlign: "right", fontFamily: "monospace", color: "#7c3aed", background: "#f5f3ff" }}>{pplLat.toLocaleString()}</td>
            </tr>

            {/* Lighting */}
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ ...tableBodyCell, fontWeight: 600 }}>Lighting</td>
              <td style={tableBodyCell}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="number" step="0.1" style={{ ...numInput, width: 60 }} value={internalLoads.lights?.wattsPerSqFt || 0}
                    onChange={(e) => dispatch({ type: "UPDATE_INTERNAL_LOADS", payload: { type: "lights", data: { wattsPerSqFt: parseFloat(e.target.value) || 0 } } })} />
                  <span style={{ fontSize: 11, color: "#6b7280" }}>W/ft²</span>
                </div>
              </td>
              <td style={{ ...tableBodyCell, fontSize: 11, color: "#6b7280" }}>x 3.412</td>
              <td style={{ ...tableBodyCell, textAlign: "center", color: "#9ca3af" }}>—</td>
              <td style={{ ...tableBodyCell, textAlign: "right", fontFamily: "monospace", color: "#0369a1", background: "#f0f9ff" }}>{lightsBtu.toLocaleString()}</td>
              <td style={{ ...tableBodyCell, background: "#f9fafb", textAlign: "center", color: "#9ca3af" }}>—</td>
            </tr>

            {/* Equipment */}
            <tr>
              <td style={{ ...tableBodyCell, fontWeight: 600 }}>Equipment</td>
              <td style={tableBodyCell}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input type="number" step="0.1" style={{ ...numInput, width: 60 }} value={internalLoads.equipment?.kw || 0}
                    onChange={(e) => dispatch({ type: "UPDATE_INTERNAL_LOADS", payload: { type: "equipment", data: { kw: parseFloat(e.target.value) || 0 } } })} />
                  <span style={{ fontSize: 11, color: "#6b7280" }}>kW</span>
                </div>
              </td>
              <td style={{ ...tableBodyCell, fontSize: 11, color: "#6b7280" }}>x 3412</td>
              <td style={{ ...tableBodyCell, textAlign: "center", color: "#9ca3af" }}>—</td>
              <td style={{ ...tableBodyCell, textAlign: "right", fontFamily: "monospace", color: "#0369a1", background: "#f0f9ff" }}>{equipBtu.toLocaleString()}</td>
              <td style={{ ...tableBodyCell, background: "#f9fafb", textAlign: "center", color: "#9ca3af" }}>—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Totals ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: 16, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3a8a" }}>Room Sensible Heat Sub-Total (RSH)</div>
          <div style={{ fontSize: 10, color: "#6b7280" }}>Envelope + Internal</div>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["Summer", totals.summer, "#ea580c"], ["Monsoon", totals.monsoon, "#0369a1"], ["Winter", totals.winter, "#0891b2"]].map(([lbl, val, clr]) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: clr }}>{val.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>BTU/hr</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}