import React from 'react';
import { useHeatLoad } from "../context/HeatLoadContext";

// ── Sub-Component: Number Control (Styled for Engineering) ──────────────────
const NumberControl = ({ label, value, onChange, unit = "" }) => {
  // Safe parsing to prevent NaN errors
  const safeVal = (v) => parseFloat(v) || 0;

  const handleIncrement = () => onChange(safeVal(value) + 1);
  const handleDecrement = () => onChange(safeVal(value) - 1);
  const handleChange = (e) => onChange(e.target.value);

  return (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {/* Input Group Container */}
      <div className="flex items-center w-full border border-gray-300 rounded-md shadow-sm bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        {/* Decrement */}
        <button
          type="button"
          onClick={handleDecrement}
          className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-200 active:bg-gray-300 border-r border-gray-300 transition-colors"
        >
          -
        </button>
        
        {/* Input Field */}
        <input
          type="number"
          value={value}
          onChange={handleChange}
          className="w-full text-center py-2 text-gray-800 font-medium focus:outline-none appearance-none"
        />
        
        {/* Unit Label */}
        <span className="bg-gray-50 text-gray-500 text-sm py-2 px-3 border-l border-r border-gray-300 min-w-[3.5rem] text-center font-medium">
          {unit}
        </span>

        {/* Increment */}
        <button
          type="button"
          onClick={handleIncrement}
          className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-200 active:bg-gray-300 border-l border-gray-300 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

// ── Reusable Text Input Component ───────────────────────────────────────────
const TextInput = ({ label, name, value, onChange, placeholder, fullWidth = false }) => (
  <div className={fullWidth ? "col-span-2" : "col-span-1"}>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
    />
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
export default function ProjectInfo() {
  const { state, dispatch } = useHeatLoad();
  const { project } = state;
  const { ambient } = project;

  // 1. Handle Text Inputs
  const handleTextChange = (e) => {
    dispatch({ 
      type: "UPDATE_PROJECT", 
      payload: { [e.target.name]: e.target.value } 
    });
  };

  // 2. Handle Numeric Inputs
  const handleAmbientChange = (field, value) => {
    dispatch({ 
      type: "UPDATE_AMBIENT", 
      payload: { [field]: parseFloat(value) || 0 } 
    });
  };

  // 3. Handle Reset Logic
  const handleReset = () => {
    if (window.confirm("⚠️ Are you sure you want to clear ALL project data? This cannot be undone.")) {
      // Clear Local Storage
      localStorage.removeItem("heatLoadProjectData");
      // Reset State
      dispatch({ type: "RESET_PROJECT" });
      // Optional: Force reload to ensure a clean slate
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      
      {/* ── Page Header & Reset Button ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-gray-200 pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Project Definition</h2>
          <p className="text-gray-500 mt-2 text-base">
            Manage project details, client information, and environmental design criteria.
          </p>
        </div>
        
        {/* RESET BUTTON */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all text-sm font-semibold shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Reset Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT COLUMN: General Info (Spans 8 cols) ── */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 flex items-center mb-6 border-b pb-2">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm">1</span>
              General Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <TextInput 
                label="Project Name" 
                name="projectName" 
                value={project.projectName} 
                onChange={handleTextChange} 
                placeholder="e.g. Gigafactory Expansion"
                fullWidth 
              />
              
              <TextInput 
                label="Location" 
                name="projectLocation" 
                value={project.projectLocation} 
                onChange={handleTextChange} 
                placeholder="City, Country"
                fullWidth 
              />

              <TextInput 
                label="Customer Name" 
                name="customerName" 
                value={project.customerName} 
                onChange={handleTextChange} 
              />

              <TextInput 
                label="Consultant Name" 
                name="consultantName" 
                value={project.consultantName} 
                onChange={handleTextChange} 
              />

              <TextInput 
                label="Key Account Manager" 
                name="keyAccountManager" 
                value={project.keyAccountManager} 
                onChange={handleTextChange} 
              />

              {/* Industry Dropdown */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Industry</label>
                <div className="relative">
                  <select
                    name="industry"
                    value={project.industry}
                    onChange={handleTextChange}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="Semiconductor">Semiconductor</option>
                    <option value="Solar">Solar</option>
                    <option value="Pharma">Pharma</option>
                    <option value="Battery">Battery</option>
                  </select>
                  {/* Custom Arrow Icon */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Ambient Conditions (Spans 4 cols) ── */}
        <div className="lg:col-span-4">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center border-b border-slate-200 pb-2">
            <span className="bg-slate-200 text-slate-700 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm">2</span>
              Ambient Conditions
            </h3>
            
            <div className="space-y-5">
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

              <hr className="border-slate-200 my-2" />

              <div className="grid grid-cols-2 gap-3">
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
                  unit="°"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
              <div className="text-blue-500 text-xl">ℹ️</div>
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>Engineering Note:</strong> Adjusting these values will recalculate <strong>CLTD</strong> (Cooling Load Temperature Difference) and Ventilation air properties across all rooms immediately.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}