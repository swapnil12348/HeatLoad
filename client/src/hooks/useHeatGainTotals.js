import { useMemo } from "react";
import ASHRAE from "../constants/ashrae";

/**
 * useHeatGainTotals
 * Calculates Room Sensible Heat (RSH) subtotals.
 * 
 * FIXES APPLIED:
 * 1. Handles 'roof', 'ceiling', 'floor' as Arrays (consistent with new initialState).
 * 2. Uses optional chaining (?.) and fallbacks (|| 0) to prevent NaN.
 * 3. Standardized helper function for all envelope elements.
 */
export function useHeatGainTotals(elements, internalLoads, floorArea) {
  return useMemo(() => {
    let s = 0, m = 0, w = 0;

    // ── Helper: Calculate Envelope Load (Q = U × A × CLTD) ──────────────
    // Works for Glass, Walls, Roof, Floor, Partitions
    const calculateEnvelopeLoad = (items) => {
      if (!Array.isArray(items)) return; // Safety check

      items.forEach((item) => {
        const area = parseFloat(item.area) || 0;
        const u = parseFloat(item.uValue) || 0;
        
        // Accumulate loads per season
        s += area * u * (item.diff?.summer || 0);
        m += area * u * (item.diff?.monsoon || 0);
        w += area * u * (item.diff?.winter || 0);
      });
    };

    // ── 1. Calculate Envelope Loads ─────────────────────────────────────
    // Now we can loop through all keys cleanly
    ["glass", "walls", "roof", "ceiling", "floor", "partitions"].forEach((category) => {
      if (elements[category]) {
        calculateEnvelopeLoad(elements[category]);
      }
    });

    // ── 2. People (Sensible Only) ───────────────────────────────────────
    const pplCount = parseFloat(internalLoads.people?.count) || 0;
    const pplSensible = parseFloat(internalLoads.people?.sensiblePerPerson) || 0;
    const totalPpl = pplCount * pplSensible;
    
    s += totalPpl; 
    m += totalPpl; 
    w += totalPpl;

    // ── 3. Lighting ─────────────────────────────────────────────────────
    // Assumes floorArea is already in Sq Ft (based on typical US inputs).
    // If your input is M2, uncomment the conversion line below:
    // const areaFt = floorArea * ASHRAE.M2_TO_FT2; 
    const areaFt = parseFloat(floorArea) || 0;
    
    const wattsPerFt = parseFloat(internalLoads.lights?.wattsPerSqFt) || 0;
    const lightsBtu = areaFt * wattsPerFt * ASHRAE.BTU_PER_WATT;
    
    s += lightsBtu; 
    m += lightsBtu; 
    w += lightsBtu;

    // ── 4. Equipment ────────────────────────────────────────────────────
    const kw = parseFloat(internalLoads.equipment?.kw) || 0;
    const equipBtu = kw * ASHRAE.KW_TO_BTU;
    
    s += equipBtu; 
    m += equipBtu; 
    w += equipBtu;

    return {
      summer:  Math.round(s),
      monsoon: Math.round(m),
      winter:  Math.round(w),
    };
  }, [elements, internalLoads, floorArea]);
}