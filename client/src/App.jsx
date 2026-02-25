import { useState } from "react";
import { HeatLoadProvider } from "./context/HeatLoadContext";

import Header                  from "./components/Header";
import ProjectInfo             from "./components/ProjectInfo";
import TabNav                  from "./components/TabNav";
import RoomData                from "./components/RoomData";
import ClimateConditions       from "./components/ClimateConditions";
import HeatGainLoss            from "./components/HeatGainLoss";
import InfiltrationExfiltration from "./components/InfiltrationExfiltration";
import ResultsSummary          from "./components/ResultsSummary";

export default function App() {
  const [activeTab, setActiveTab] = useState("room");

  return (
    <HeatLoadProvider>
      {/* Replaced inline styles with Tailwind classes: min-h-screen, bg-slate-100 */}
      <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
        <Header />

        {/* Replaced max-width/margin with: max-w-[1400px] mx-auto py-5 px-4 */}
        <div className="max-w-[1400px] mx-auto py-5 px-4">
          <ProjectInfo />

          <TabNav activeTab={activeTab} onSelect={setActiveTab} />

          <div className="flex flex-col gap-5">
            {activeTab === "room"         && <RoomData />}
            {activeTab === "climate"      && <ClimateConditions />}
            {activeTab === "heat"         && <HeatGainLoss />}
            {activeTab === "infiltration" && <InfiltrationExfiltration />}
            {activeTab === "results"      && <ResultsSummary />}
          </div>

          {/* Footer */}
          <div className="mt-6 p-3 bg-slate-50 border border-blue-100 rounded-lg text-[11px] text-gray-500 text-center">
            ASHRAE Handbook — Fundamentals (2021) | ASHRAE 55-2020 | ASHRAE 62.1-2022 | ASHRAE 90.1-2022
            <span className="mx-3">|</span>
            All calculations for preliminary design purposes only.
            Final design must be verified by a licensed mechanical engineer.
          </div>
        </div>
      </div>
    </HeatLoadProvider>
  );
}