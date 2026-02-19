import { useState } from "react";
import { HeatLoadProvider } from "./context/HeatLoadContext";

import Header                  from "./components/Header";
import ProjectInfo              from "./components/ProjectInfo";
import TabNav                   from "./components/TabNav";
import RoomData                 from "./components/RoomData";
import ClimateConditions        from "./components/ClimateConditions";
import HeatGainLoss             from "./components/HeatGainLoss";
import InfiltrationExfiltration from "./components/InfiltrationExfiltration";
import ResultsSummary           from "./components/ResultsSummary";

/**
 * App
 * Root component.  Owns only:
 *   - HeatLoadProvider  (global state tree)
 *   - activeTab         (local UI state)
 * Everything else is delegated to child components.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState("room");

  return (
    <HeatLoadProvider>
      <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <Header />

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 16px" }}>
          <ProjectInfo />

          <TabNav activeTab={activeTab} onSelect={setActiveTab} />

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {activeTab === "room"         && <RoomData />}
            {activeTab === "climate"      && <ClimateConditions />}
            {activeTab === "heat"         && <HeatGainLoss />}
            {activeTab === "infiltration" && <InfiltrationExfiltration />}
            {activeTab === "results"      && <ResultsSummary />}
          </div>

          {/* Standards footer */}
          <div style={{
            marginTop: 24, padding: "10px 16px",
            background: "#f8faff", border: "1px solid #dbeafe",
            borderRadius: 8, fontSize: 11, color: "#6b7280", textAlign: "center",
          }}>
            ASHRAE Handbook — Fundamentals (2021) | ASHRAE 55-2020 | ASHRAE 62.1-2022 | ASHRAE 90.1-2022
            <span style={{ margin: "0 12px" }}>|</span>
            All calculations for preliminary design purposes only.
            Final design must be verified by a licensed mechanical engineer.
          </div>
        </div>
      </div>
    </HeatLoadProvider>
  );
}