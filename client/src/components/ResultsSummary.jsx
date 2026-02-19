import { useState } from "react";
import { useHeatLoad } from "../context/HeatLoadContext";
import { useSystemResults } from "../hooks/useSystemResults";
import ASHRAE from "../constants/ashrae";
import { COLOR } from "../constants/styles";

const ASHRAE_FORMULAS = [
  ["Envelope Sensible",       "Q = U × A × CLTD (BTU/hr)"],
  ["Infiltration Sensible",   "Qs = 1.1 × CFM × ΔDB"],
  ["Infiltration Latent",     "Ql = 0.68 × CFM × ΔW (gr/lb)"],
  ["Dehumidified Rise",       "ΔT = (1 − BF) × (DB_room − ADP)"],
  ["Dehumidified CFM",        "CFM = ERSH / (1.1 × ΔT)"],
  ["Tonnage",                 "TR = GTH / 12,000 BTU/hr"],
  ["Lighting (ASHRAE 90.1)", "Q = W × 3.412 BTU/W"],
  ["Ventilation (62.1)",      "Vbz = Rp × Pz + Ra × Az"],
];

/**
 * TuningInput
 * Single labelled number input used in the design parameters panel.
 */
function TuningInput({ label, value, step, onChange }) {
  return (
    <div>
      <label style={{ fontSize: 10, fontWeight: 700, color: COLOR.amber, display: "block", marginBottom: 4 }}>
        {label}
      </label>
      <input
        type="number" step={step} value={value} onChange={onChange}
        style={{ 
            width: "100%", 
            padding: "7px 10px", 
            fontSize: 13, 
            border: `1px solid ${COLOR.amberBorder}`, 
            borderRadius: 6, 
            background: "#fff", 
            outline: "none", 
            boxSizing: "border-box",
            // FIX: Explicitly set text color to black
            color: "#000000" 
        }}
        onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
        onBlur={(e)  => (e.target.style.borderColor = COLOR.amberBorder)}
      />
    </div>
  );
}

/**
 * ResultRow
 * Labelled result row used inside summary cards.
 */
function ResultRow({ label, value, color = COLOR.gray700, large = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLOR.gray100}`, fontSize: 13 }}>
      <span style={{ color: COLOR.gray500, fontSize: 12 }}>{label}</span>
      <span style={{ fontFamily: "monospace", fontWeight: 700, color, fontSize: large ? 18 : 13 }}>{value}</span>
    </div>
  );
}

/**
 * ResultsSummary
 * Final ASHRAE system sizing output.
 * Reads from context via the useSystemResults hook.
 * All tuning parameters are local state (no side-effects on shared data).
 */
export default function ResultsSummary() {
  const { state } = useHeatLoad();

  const [tuning, setTuning] = useState({
    safetyFactor: ASHRAE.DEFAULT_SAFETY_FACTOR_PCT,
    bypassFactor: ASHRAE.DEFAULT_BYPASS_FACTOR,
    adp:          ASHRAE.DEFAULT_ADP,
    fanHeat:      ASHRAE.DEFAULT_FAN_HEAT_PCT,
  });

  const set = (key) => (e) =>
    setTuning((prev) => ({ ...prev, [key]: parseFloat(e.target.value) }));

  const results = useSystemResults(state, tuning);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLOR.brand }}>
          4. Final System Selection &amp; Summary
        </h2>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, background: COLOR.brandLight, color: COLOR.brandMid, border: `1px solid ${COLOR.brandBorder}`, borderRadius: 4, padding: "3px 8px" }}>
          ASHRAE System Design
        </span>
      </div>

      {/* ── Tuning Parameters ───────────────────────────────────────────────── */}
      <div style={{ background: COLOR.amberLight, border: `1px solid ${COLOR.amberBorder}`, borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLOR.amber, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
          Design Parameters — ASHRAE Standard Defaults
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <TuningInput label={`Safety Factor (%) — ASHRAE: ${ASHRAE.DEFAULT_SAFETY_FACTOR_PCT}%`} value={tuning.safetyFactor} step="1"    onChange={set("safetyFactor")} />
          <TuningInput label="Coil Bypass Factor (0–1) — ASHRAE: 0.10"                             value={tuning.bypassFactor}  step="0.01" onChange={set("bypassFactor")} />
          <TuningInput label="Apparatus Dew Point (°F)"                                             value={tuning.adp}           step="0.5"  onChange={set("adp")} />
          <TuningInput label={`Fan Heat Gain (%) — ASHRAE: ${ASHRAE.DEFAULT_FAN_HEAT_PCT}%`}       value={tuning.fanHeat}       step="1"    onChange={set("fanHeat")} />
        </div>
      </div>

      {/* ── Summary Cards (2-column) ─────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Card 1: Heat Loads */}
        <div style={{ background: "#fff", borderRadius: 10, padding: 20, border: `1px solid ${COLOR.gray200}`, borderTop: `4px solid ${COLOR.brandMid}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: COLOR.brand }}>Heat Load Summary</h3>
          <ResultRow label="Effective Room Sensible Heat (ERSH)" value={`${results.ersh.toLocaleString()} BTU/hr`}  color={COLOR.brandMid} />
          <ResultRow label="Effective Room Latent Heat (ERLH)"   value={`${results.erlh.toLocaleString()} BTU/hr`}  color={COLOR.purple} />
          <ResultRow label="ESHF (Effective Sensible Heat Factor)" value={results.eshf} />
          <ResultRow label="Grand Total Heat (incl. fan)"         value={`${results.grandTotal.toLocaleString()} BTU/hr`} color={COLOR.red} />
        </div>

        {/* Card 2: Psychrometrics */}
        <div style={{ background: "#fff", borderRadius: 10, padding: 20, border: `1px solid ${COLOR.gray200}`, borderTop: `4px solid ${COLOR.green}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: COLOR.brand }}>Psychrometrics &amp; Air Flow</h3>
          <ResultRow label="Room Design DB (ASHRAE 55)"                value={`${state.climate.inside.db} °F`} />
          <ResultRow label="Apparatus Dew Point (ADP)"                  value={`${tuning.adp} °F`} />
          <ResultRow label="Dehumidified Rise ΔT = (1−BF)×(DB−ADP)"   value={`${results.rise} °F`} color={COLOR.gray500} />
          <div style={{ background: COLOR.greenLight, border: `1px solid ${COLOR.greenBorder}`, borderRadius: 8, padding: "10px 14px", marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: "#065f46", fontSize: 13 }}>Dehumidified Air CFM</span>
            <span style={{ fontFamily: "monospace", fontWeight: 800, color: COLOR.green, fontSize: 22 }}>{results.dehCFM.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Final System Banner ─────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #1565c0 100%)",
        borderRadius: 12, padding: "24px 28px", color: "#fff",
        boxShadow: "0 4px 20px rgba(21,101,192,0.3)",
      }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800 }}>Recommended System Capacity</h3>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.75 }}>
              Peak Summer Load + {tuning.safetyFactor}% Safety Factor | 1 TR = {ASHRAE.BTU_PER_TON.toLocaleString()} BTU/hr
            </p>
          </div>
          <div style={{ textAlign: "center", background: "rgba(255,255,255,0.1)", padding: "14px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>Total Tonnage (TR)</div>
            <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1 }}>{results.tonnage}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Tons of Refrigeration</div>
          </div>
        </div>

        {/* Bottom grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 20 }}>
          {[
            ["Supply Air",            `${results.supplyAir.toLocaleString()} CFM`, "ERSH / (1.1 × ΔT) × 1.05"],
            ["Fresh Air (ASHRAE 62.1)", `${results.freshAir.toLocaleString()} CFM`, "Rp×Pz + Ra×Az"],
            ["Total System Heat",      `${results.grandTotal.toLocaleString()} BTU/hr`, "Incl. fan heat gain"],
          ].map(([label, value, note], i) => (
            <div key={label} style={{ textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.2)" : "none", padding: "0 12px" }}>
              <div style={{ fontSize: 10, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{value}</div>
              <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>{note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ASHRAE Formula Reference ────────────────────────────────────────── */}
      <div style={{ background: "#f8faff", border: `1px solid ${COLOR.brandBorder}`, borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.brand, marginBottom: 8 }}>
          ASHRAE Formulas Applied in This Calculation
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 4 }}>
          {ASHRAE_FORMULAS.map(([name, formula]) => (
            <div key={name} style={{ fontSize: 11, padding: "3px 0" }}>
              <span style={{ fontWeight: 600, color: COLOR.brandMid }}>{name}: </span>
              <span style={{ fontFamily: "monospace", color: COLOR.gray700 }}>{formula}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}