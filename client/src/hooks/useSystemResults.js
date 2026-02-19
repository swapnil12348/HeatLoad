import { useMemo } from "react";
import ASHRAE from "../constants/ashrae";

/**
 * useSystemResults
 * Calculates final System Sizing (Tonnage, CFM, ESHF).
 * 
 * FIXES:
 * 1. Iterates correctly over ALL envelope arrays (glass, walls, roof, etc).
 * 2. Uses Imperial units directly (no double conversion).
 * 3. Uses pre-calculated Infiltration CFM from state.
 */
export function useSystemResults(state, tuning) {
  const { elements, internalLoads, infiltration, room, climate } = state;

  return useMemo(() => {
    // ── 1. Room Sensible Heat (RSH) ──────────────────────────────────────
    let sensible = 0;

    // Helper to sum up any envelope category
    const sumEnvelope = (items) => {
      if (!items || !Array.isArray(items)) return;
      items.forEach((item) => {
        // Q = Area * U * CLTD (Summer)
        sensible += (item.area || 0) * (item.uValue || 0) * (item.diff?.summer || 0);
      });
    };

    // Calculate all envelope loads
    ["glass", "walls", "roof", "ceiling", "floor"].forEach(key => {
      sumEnvelope(elements[key]);
    });

    // Internal Loads: People
    sensible += (internalLoads.people?.count || 0) * 
                (internalLoads.people?.sensiblePerPerson || ASHRAE.PEOPLE_SENSIBLE_SEATED);

    // Internal Loads: Equipment
    sensible += (internalLoads.equipment?.kw || 0) * ASHRAE.KW_TO_BTU;

    // Internal Loads: Lighting
    // Formula: Watts/SqFt * Area(ft) * 3.412
    const floorArea = parseFloat(room.floorArea) || 0;
    sensible += (internalLoads.lights?.wattsPerSqFt || 0) * floorArea * ASHRAE.BTU_PER_WATT;

    // ── 2. Infiltration ──────────────────────────────────────────────────
    // We use the CFM calculated in the Infiltration tab (stored in state.infiltration.cfm)
    const infilCFM = parseFloat(infiltration?.cfm) || 0;
    
    const dbOut = climate.outside.summer?.db || 95;
    const dbIn  = climate.inside?.db || 75;
    const dT    = dbOut - dbIn;

    // Infiltration Sensible: Qs = 1.08 * CFM * dT
    const infilSens = ASHRAE.SENSIBLE_FACTOR * infilCFM * dT;
    sensible += infilSens;

    // ── 3. Apply Safety Factor → ERSH ────────────────────────────────────
    const safetyMult = 1 + (tuning.safetyFactor || 0) / 100;
    const ersh = sensible * safetyMult;

    // ── 4. Room Latent Heat (RLH) → ERLH ─────────────────────────────────
    let latent = 0;
    
    // People Latent
    latent += (internalLoads.people?.count || 0) * 
              (internalLoads.people?.latentPerPerson || ASHRAE.PEOPLE_LATENT_SEATED);

    // Infiltration Latent
    // We need Grains (Humidity Ratio) difference
    // Note: Assuming specific humidity inputs exist, otherwise default to 0 diff
    // Usually climate.outside.summer.gr (grains)
    // Simplified here if gr is missing:
    const grOut = climate.outside.summer?.gr || 100; // default ballpark
    const grIn  = climate.inside?.gr || 65; 
    const dGr   = grOut - grIn;

    // Ql = 0.68 * CFM * dGr
    const infilLat = ASHRAE.LATENT_FACTOR * infilCFM * dGr;
    latent += infilLat;

    const erlh = latent * safetyMult;

    // ── 5. ESHF (Effective Sensible Heat Factor) ──────────────────────────
    const totalRoomHeat = ersh + erlh;
    const eshf = totalRoomHeat > 0 ? ersh / totalRoomHeat : 1;

    // ── 6. Dehumidified CFM ───────────────────────────────────────────────
    // Formula: CFM = ERSH / (1.08 * (1-BF) * (RoomDB - ADP))
    const bf = tuning.bypassFactor || 0.1;
    const adp = tuning.adp || 55;
    const rise = (1 - bf) * (dbIn - adp);
    
    // Protect against divide by zero
    const dehCFM = rise > 0 ? Math.ceil(ersh / (ASHRAE.SENSIBLE_FACTOR * rise)) : 0;

    // ── 7. Grand Total Heat & Tonnage ─────────────────────────────────────
    // Grand Total includes Fan Heat
    const grandTotal = totalRoomHeat * (1 + (tuning.fanHeat || 0) / 100);
    const tonnage    = grandTotal / ASHRAE.BTU_PER_TON;

    // ── 8. Fresh Air (ASHRAE 62.1) ────────────────────────────────────────
    // Re-calculate or use stored value. Re-calculating ensures consistency with Results tab.
    const Rp = ASHRAE.VENT_PEOPLE_CFM;
    const Ra = ASHRAE.VENT_AREA_CFM;
    const peopleCount = parseFloat(internalLoads.people?.count) || 0;
    
    const freshAir = Math.ceil((Rp * peopleCount) + (Ra * floorArea));

    return {
      ersh:       Math.round(ersh),
      erlh:       Math.round(erlh),
      eshf:       eshf.toFixed(3),
      rise:       rise.toFixed(2),
      dehCFM,
      tonnage:    tonnage.toFixed(2),
      grandTotal: Math.round(grandTotal),
      // Supply Air usually allows for some duct leakage (e.g. 5%)
      supplyAir:  Math.ceil(dehCFM * 1.05), 
      freshAir,
    };
  }, [elements, internalLoads, infiltration, room, climate, tuning]);
}