import React, { useContext } from 'react';
import { HeatLoadContext } from "../context/HeatLoadContext";

// ── Constants ───────────────────────────────────────────────────────────────
const ISO_CLASSES = [
  { value: "ISO 1", label: "ISO 1 (10 particles/m³ @ 0.1µm)" },
  { value: "ISO 5", label: "ISO 5 (Class 100)" },
  { value: "ISO 7", label: "ISO 7 (Class 10,000)" },
  { value: "ISO 8", label: "ISO 8 (Class 100k)" }, // Most common
  { value: "ISO 9", label: "ISO 9 (Room Air)" },
];

const DESIGN_SCHEMES = [
  "Conventional Pharma Ducting",
  "Once Through System",
  "Dehumidifier Integration",
  "Plenum / Fan Filter Unit Design"
];

const CONFIGURATIONS = [
  "Draw-through (Fan after Coil)",
  "Blow-through (Fan before Coil)"
];

// ── Main Component ──────────────────────────────────────────────────────────
export default function AHUSelection() {
  // 1. Use standard context hook
  const { state, dispatch } = useContext(HeatLoadContext);
  
  // 2. SAFETY CHECK: Access ahus, fallback to empty array if undefined
  // This supports both 'state.ahus' and 'state.project.ahus' just in case
  const ahus = state.ahus || state.project?.ahus || [];

  const addAHU = () => {
    dispatch({ type: 'ADD_AHU' });
  };

  const updateAHU = (id, field, value) => {
    dispatch({
      type: 'UPDATE_AHU',
      payload: { id, field, value }
    });
  };

  const deleteAHU = (id) => {
    if (ahus.length > 1) {
      dispatch({ type: 'DELETE_AHU', payload: { id } });
    } else {
      alert("You must have at least one AHU.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24">
      
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">AHU Selection</h2>
          <p className="text-gray-500 mt-2">
            Configure Air Handling Units, Cleanroom Standards, and System Topologies.
          </p>
        </div>
        <button
          onClick={addAHU}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-colors"
        >
          <span>+</span> Add New AHU
        </button>
      </div>

      {/* AHU List Grid */}
      <div className="space-y-6">
        {ahus.map((ahu, index) => (
          <div 
            key={ahu.id || index} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* AHU Card Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 flex items-center gap-3">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                {ahu.roomName ? ahu.roomName : `AHU-${index + 1}`} Configuration
              </h3>
              
              {ahus.length > 1 && (
                <button 
                  onClick={() => deleteAHU(ahu.id)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                >
                  Delete
                </button>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* 1. Room Name Serving */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Serving Room / Zone</label>
                <input
                  type="text"
                  value={ahu.roomName || ''}
                  onChange={(e) => updateAHU(ahu.id, 'roomName', e.target.value)}
                  placeholder="e.g. Production Hall A"
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* 2. ISO Class Dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ISO Cleanroom Class</label>
                <select
                  value={ahu.isoClass || 'ISO 8'}
                  onChange={(e) => updateAHU(ahu.id, 'isoClass', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {ISO_CLASSES.map((iso) => (
                    <option key={iso.value} value={iso.value}>{iso.label}</option>
                  ))}
                </select>
              </div>

              {/* 3. Design Scheme */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">System Design Scheme</label>
                <select
                  value={ahu.designScheme || ''}
                  onChange={(e) => updateAHU(ahu.id, 'designScheme', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {DESIGN_SCHEMES.map((scheme) => (
                    <option key={scheme} value={scheme}>{scheme}</option>
                  ))}
                </select>
              </div>

              {/* 4. Configuration */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fan Configuration</label>
                <select
                  value={ahu.configuration || ''}
                  onChange={(e) => updateAHU(ahu.id, 'configuration', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {CONFIGURATIONS.map((config) => (
                    <option key={config} value={config}>{config}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}