import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Provider
import { HeatLoadProvider } from './context/HeatLoadContext';

// Layout Components
import Header from './components/Header';
import TabNav from './components/TabNav';

// Page Components
import ProjectInfo from './components/ProjectInfo';
import AHUSelection from './components/AHUSelection';
import ClimateConditions from './components/ClimateConditions';
import RoomData from './components/RoomData';
import InfiltrationExfiltration from './components/InfiltrationExfiltration';
import HeatGainLoss from './components/HeatGainLoss';
import ResultsSummary from './components/ResultsSummary';

function App() {
  return (
    <HeatLoadProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          
          {/* Top Header */}
          <Header />

          {/* Navigation Tabs */}
          <TabNav />

          {/* Main Content Area */}
          <main className="container mx-auto px-4 py-6">
            <Routes>
              {/* Redirect root "/" to the first step */}
              <Route path="/" element={<Navigate to="/project-info" replace />} />

              {/* Define Routes for each step */}
              <Route path="/project-info" element={<ProjectInfo />} />
              <Route path="/ahu-selection" element={<AHUSelection />} />
              <Route path="/climate" element={<ClimateConditions />} />
              <Route path="/room-data" element={<RoomData />} />
              <Route path="/infiltration" element={<InfiltrationExfiltration />} />
              <Route path="/heat-gain" element={<HeatGainLoss />} />
              <Route path="/results" element={<ResultsSummary />} />

              {/* Catch-all for 404s */}
              <Route path="*" element={<div className="p-10 text-center">Page Not Found</div>} />
            </Routes>
          </main>
          
        </div>
      </BrowserRouter>
    </HeatLoadProvider>
  );
}

export default App;