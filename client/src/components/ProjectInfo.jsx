import React from 'react';
import { useHeatLoad } from "../context/HeatLoadContext";

// ── Sub-Component: Number Control with +/- Buttons ──────────────────────────
const NumberControl = ({ label, value, onChange, unit = "" }) => {
  const handleIncrement = () => onChange(parseFloat(value) + 1);
  const handleDecrement = () => onChange(parseFloat(value) - 1);
  const handleChange = (e) => onChange(e.target.value);

  return (
    <div className="flex flex-col">
      <label className="text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
      <div className="flex items-center shadow-sm">
        <button
          type="button"
          onClick={handleDecrement}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-3 rounded-l border border-gray-300 transition"
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          className="w-full text-center border-t border-b border-gray-300 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        />
        <span className="bg-gray-50 border-t border-b border-gray-300 py-2 px-2 text-gray-500 text-sm min-w-[3rem] text-center">
          {unit}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-3 rounded-r border border-gray-300 transition"
        >
          +
        </button>
      </div>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────
export default function ProjectInfo() {
  const { state, dispatch } = useHeatLoad();
  const { project } = state;
  const { ambient } = project;

  // Handler for text inputs (Name, Location, etc.)
  const handleTextChange = (e) => {
    dispatch({ 
      type: "UPDATE_PROJECT", 
      payload: { [e.target.name]: e.target.value } 
    });
  };

  // Handler for Ambient Numeric inputs
  const handleAmbientChange = (field, value) => {
    dispatch({ 
      type: "UPDATE_AMBIENT", 
      payload: { [field]: parseFloat(value) || 0 } 
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100 mt-6">
      
      {/* ── Header ── */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Project Definition</h2>
        <p className="text-gray-500 text-sm">
          Enter project details and external design conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── LEFT COLUMN: Project Details ── */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-100 pb-2">
            General Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Project Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                name="projectName"
                value={project.projectName}
                onChange={handleTextChange}
                placeholder="e.g. Gigafactory Expansion"
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Location */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="projectLocation"
                value={project.projectLocation}
                onChange={handleTextChange}
                placeholder="City, Country"
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Client Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={project.customerName}
                onChange={handleTextChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultant Name</label>
              <input
                type="text"
                name="consultantName"
                value={project.consultantName}
                onChange={handleTextChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Account Manager</label>
              <input
                type="text"
                name="keyAccountManager"
                value={project.keyAccountManager}
                onChange={handleTextChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Industry Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select
                name="industry"
                value={project.industry}
                onChange={handleTextChange}
                className="w-full border border-gray-300 rounded-md p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Semiconductor">Semiconductor</option>
                <option value="Solar">Solar</option>
                <option value="Pharma">Pharma</option>
                <option value="Battery">Battery</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Ambient Conditions ── */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 h-fit">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            Ambient Conditions
          </h3>
          
          <div className="space-y-4">
            
            <NumberControl 
              label="Dry Bulb Temperature" 
              value={ambient.dryBulbTemp} 
              onChange={(val) => handleAmbientChange('dryBulbTemp', val)}
              unit="°C"
            />

            <NumberControl 
              label="Wet Bulb Temperature" 
              value={ambient.wetBulbTemp} 
              onChange={(val) => handleAmbientChange('wetBulbTemp', val)}
              unit="°C"
            />

            <NumberControl 
              label="Relative Humidity" 
              value={ambient.relativeHumidity} 
              onChange={(val) => handleAmbientChange('relativeHumidity', val)}
              unit="%"
            />

            <div className="border-t border-slate-200 my-4"></div>

            <NumberControl 
              label="Elevation" 
              value={ambient.elevation} 
              onChange={(val) => handleAmbientChange('elevation', val)}
              unit="ft"
            />

            <NumberControl 
              label="Latitude" 
              value={ambient.latitude} 
              onChange={(val) => handleAmbientChange('latitude', val)}
              unit="deg"
            />
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded border border-blue-100 text-xs text-blue-800">
            <strong>Note:</strong> Adjusting these values will affect the <strong>CLTD</strong> and Ventilation calculations across all rooms.
          </div>
        </div>

      </div>
    </div>
  );
}