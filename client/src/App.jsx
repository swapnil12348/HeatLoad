import { useState } from "react";
import { HeatLoadProvider } from "./context/HeatLoadContext"; // Ensure path is correct

// Components
import Header                  from "./components/Header";
import ProjectInfo             from "./components/ProjectInfo";
import TabNav                  from "./components/TabNav";
import RoomData                from "./components/RoomData";
import ClimateConditions       from "./components/ClimateConditions";
import HeatGainLoss            from "./components/HeatGainLoss";
import InfiltrationExfiltration from "./components/InfiltrationExfiltration";
import ResultsSummary          from "./components/ResultsSummary";
import AHUSelection            from "./components/AHUSelection"; // <--- 1. Import it

export default function App() {
  // You can change "room" to "ahu" if you want that to be the homepage
  const [activeTab, setActiveTab] = useState("room"); 

  return (
    <HeatLoadProvider>
      <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-20">
        <Header />

        <div className="max-w-[1400px] mx-auto py-5 px-4">
          
          {/* Note: ProjectInfo is currently shown on ALL tabs. 
              If you want it to be its own tab, move it inside the conditional logic below. */}
          <ProjectInfo />

          {/* Pass the setter to TabNav so buttons can change the view */}
          <TabNav activeTab={activeTab} onSelect={setActiveTab} />

          <div className="mt-6 flex flex-col gap-5">
            
            {/* ─── 2. Add the Logic Here ─── */}
            {activeTab === "ahu"          && <AHUSelection />} 
            
            {activeTab === "room"         && <RoomData />}
            {activeTab === "climate"      && <ClimateConditions />}
            {activeTab === "heat"         && <HeatGainLoss />}
            {activeTab === "infiltration" && <InfiltrationExfiltration />}
            {activeTab === "results"      && <ResultsSummary />}
          </div>

          {/* Footer */}
          <div className="mt-12 p-4 bg-white border border-slate-200 rounded-lg shadow-sm text-xs text-slate-500 text-center">
            <p className="font-semibold text-slate-700 mb-1">
              ASHRAE Handbook — Fundamentals (2021) | ASHRAE 55-2020 | ASHRAE 62.1-2022 | ASHRAE 90.1-2022
            </p>
            All calculations for preliminary design purposes only.
            Final design must be verified by a licensed mechanical engineer.
          </div>
        </div>
      </div>
    </HeatLoadProvider>
  );
}