import { useHeatLoad } from "../context/HeatLoadContext";
import ASHRAE from "../constants/ashrae";
import { tableHeaderCell, tableBodyCell, COLOR } from "../constants/styles";

const SEASONS = ["summer", "monsoon", "winter"];

/**
 * InputCell
 * Reusable table cell containing a number input.
 */
function InputCell({ value, onChange, step = "1", readOnly = false }) {
  return (
    <td style={{ ...tableBodyCell, background: readOnly ? COLOR.gray50 : "transparent" }}>
      <input
        type="number"
        step={step}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        style={{
          width: "100%", 
          padding: "4px 6px", 
          fontSize: 12,
          border: "none", 
          outline: "none", 
          textAlign: "center",
          background: "transparent",
          // FIX: Changed COLOR.gray900 (undefined) to COLOR.black
          color: readOnly ? COLOR.gray500 : (COLOR.black || "#000"),
          fontWeight: readOnly ? 400 : 600
        }}
        onFocus={(e)  => { if (!readOnly) e.target.parentElement.style.background = COLOR.brandLight; }}
        onBlur={(e)   => { e.target.parentElement.style.background = readOnly ? COLOR.gray50 : "transparent"; }}
      />
    </td>
  );
}

/**
 * ClimateConditions
 * Outside design conditions (Summer / Monsoon / Winter) and inside ASHRAE 55 conditions.
 * Automatically calculates season differences used in heat-gain formulas.
 */
export default function ClimateConditions() {
  const { state, dispatch } = useHeatLoad();
  const { climate } = state;

  const handleOutsideChange = (season, field, value) =>
    dispatch({ type: "UPDATE_CLIMATE", payload: { type: "outside", season, field, value: value === "" ? 0 : parseFloat(value) } });

  const handleInsideChange = (field, value) =>
    dispatch({ type: "UPDATE_CLIMATE", payload: { type: "inside", data: { [field]: value === "" ? 0 : parseFloat(value) } } });

  const diff = (season) => ({
    db: (climate.outside[season].db - climate.inside.db).toFixed(1),
    gr: (climate.outside[season].gr - climate.inside.gr).toFixed(1),
  });

  // ASHRAE 55 comfort check
  const comfortOk =
    climate.inside.db >= ASHRAE.COMFORT_DB_MIN &&
    climate.inside.db <= ASHRAE.COMFORT_DB_MAX &&
    climate.inside.rh <= ASHRAE.COMFORT_RH_MAX;

  const th = (extra = {}) => ({ ...tableHeaderCell, ...extra });

  return (
    <div style={{ background: "#fff", borderRadius: 10, border: `1px solid ${COLOR.gray200}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {/* Title bar */}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLOR.gray200}`, background: COLOR.gray50, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLOR.brand }}>
          1. Outside &amp; Inside Design Conditions
        </h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 1, borderRadius: 4, padding: "3px 8px",
            background: comfortOk ? "#d1fae5" : "#fee2e2",
            color:      comfortOk ? "#065f46" : "#991b1b",
            border: `1px solid ${comfortOk ? "#6ee7b7" : "#fca5a5"}`,
          }}>
            ASHRAE 55: {comfortOk ? "✓ COMFORT OK" : "⚠ CHECK CONDITIONS"}
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...th({ textAlign: "left" }), width: 90 }}>Condition</th>
              <th style={th()}>DB (°F)</th>
              <th style={th()}>WB (°F)</th>
              <th style={th()}>RH (%)</th>
              <th style={th()}>DP (°F)</th>
              <th style={th()}>Gr/lb</th>
              <th style={th()}>Time</th>
              <th style={th()}>Month</th>
            </tr>
          </thead>
          <tbody>
            {/* Outside seasons */}
            {SEASONS.map((season) => (
              <tr key={season}>
                <td style={{ ...tableBodyCell, fontWeight: 600, fontSize: 12, textAlign: "left", paddingLeft: 12, textTransform: "capitalize", color: "#000" }}>
                  {season}
                </td>
                {["db", "wb", "rh", "dp", "gr"].map((f) => (
                  <InputCell key={f} step="0.1" value={climate.outside[season][f]}
                    onChange={(e) => handleOutsideChange(season, f, e.target.value)} />
                ))}
                <InputCell value={climate.outside[season].time}
                  onChange={(e) => handleOutsideChange(season, "time", e.target.value)} />
                <td style={tableBodyCell}>
                  <input type="text" value={climate.outside[season].month}
                    onChange={(e) => handleOutsideChange(season, "month", e.target.value)}
                    style={{ 
                        width: "100%", 
                        fontSize: 12, 
                        border: "none", 
                        outline: "none", 
                        textAlign: "center", 
                        background: "transparent",
                        // FIX: Explicitly set color to black
                        color: COLOR.black || "#000"
                    }} 
                   />
                </td>
              </tr>
            ))}

            {/* Inside — ASHRAE 55 */}
            <tr style={{ background: COLOR.greenLight }}>
              <td style={{ ...tableBodyCell, fontWeight: 700, color: "#065f46", textAlign: "left", paddingLeft: 12, borderTop: "2px solid #6ee7b7" }}>
                Inside <span style={{ fontSize: 10, color: COLOR.green }}>ASHRAE 55</span>
              </td>
              <InputCell step="0.1" value={climate.inside.db} onChange={(e) => handleInsideChange("db", e.target.value)} />
              <td style={{ ...tableBodyCell, background: COLOR.gray50 }}></td>
              <InputCell value={climate.inside.rh}             onChange={(e) => handleInsideChange("rh", e.target.value)} />
              <InputCell step="0.1" value={climate.inside.dp}  onChange={(e) => handleInsideChange("dp", e.target.value)} />
              <InputCell step="0.1" value={climate.inside.gr}  onChange={(e) => handleInsideChange("gr", e.target.value)} />
              <td style={{ ...tableBodyCell, fontSize: 11, color: COLOR.green, fontWeight: 700, textAlign: "center" }}>24 Hrs</td>
              <td style={{ ...tableBodyCell, background: COLOR.gray50 }}></td>
            </tr>

            {/* Differences section header */}
            <tr style={{ background: COLOR.amberLight }}>
              <td colSpan={8} style={{ padding: "6px 12px", fontSize: 10, fontWeight: 700, color: COLOR.amber, borderTop: `1px solid ${COLOR.amberBorder}`, letterSpacing: "0.05em" }}>
                CALCULATED DIFFERENCES (Outside − Inside) — Used in ASHRAE sensible: CFM × 1.1 × ΔDB &amp; latent: CFM × 0.68 × ΔW formulas
              </td>
            </tr>

            {/* Calculated diffs */}
            {SEASONS.map((season) => {
              const d = diff(season);
              return (
                <tr key={season + "_diff"} style={{ background: COLOR.amberLight }}>
                  <td style={{ ...tableBodyCell, fontSize: 11, color: COLOR.amber, textAlign: "left", paddingLeft: 12, textTransform: "capitalize" }}>{season} Diff</td>
                  <td style={{ ...tableBodyCell, fontWeight: 700, color: COLOR.brandMid, fontFamily: "monospace", textAlign: "center" }}>{d.db}</td>
                  <td style={{ ...tableBodyCell, background: COLOR.gray50 }}></td>
                  <td style={{ ...tableBodyCell, background: COLOR.gray50 }}></td>
                  <td style={{ ...tableBodyCell, background: COLOR.gray50 }}></td>
                  <td style={{ ...tableBodyCell, fontWeight: 700, color: COLOR.brandMid, fontFamily: "monospace", textAlign: "center" }}>{d.gr}</td>
                  <td style={{ ...tableBodyCell, background: COLOR.gray50 }}></td>
                  <td style={{ ...tableBodyCell, background: COLOR.gray50 }}></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ASHRAE 55 info footer */}
      <div style={{ padding: "10px 16px", background: "#f0f9ff", borderTop: "1px solid #e0f2fe", fontSize: 11, color: "#0369a1" }}>
        <strong>ASHRAE 55-2020 Comfort Zone:</strong> DB {ASHRAE.COMFORT_DB_MIN}–{ASHRAE.COMFORT_DB_MAX}°F | RH ≤ {ASHRAE.COMFORT_RH_MAX}% | Operative Temp 73–79°F (summer)
      </div>
    </div>
  );
}