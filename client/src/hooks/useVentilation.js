import { useMemo } from "react";
import ASHRAE from "../constants/ashrae";

/**
 * useVentilation
 * Calculates Ventilation Requirements based on ASHRAE 62.1 VRP.
 * 
 * Vbz = (Rp * Pz) + (Ra * Az)
 * where:
 * Rp = CFM per person
 * Pz = Number of people
 * Ra = CFM per sq ft
 * Az = Floor area (ft²)
 */
export function useVentilation(floorArea, peopleCount) {
  return useMemo(() => {
    const area = parseFloat(floorArea) || 0;
    const people = parseFloat(peopleCount) || 0;

    // Default ASHRAE 62.1 values for Office Space
    const Rp = ASHRAE.VENT_PEOPLE_CFM || 5; 
    const Ra = ASHRAE.VENT_AREA_CFM || 0.06;

    // Breathing Zone Outdoor Airflow (Vbz)
    const cfmPeople = Rp * people;
    const cfmArea = Ra * area;
    const totalCFM = Math.ceil(cfmPeople + cfmArea);

    return {
      cfmPeople,
      cfmArea,
      totalCFM,
      formula: `(${Rp} × ${people}p) + (${Ra} × ${area}ft²) = ${totalCFM} CFM`
    };
  }, [floorArea, peopleCount]);
}