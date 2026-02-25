import React from 'react';
import { NavLink } from 'react-router-dom';

export default function TabNav() {
  
  // Define your tabs and their paths here
  const tabs = [
    { name: 'Project Info', path: '/project-info' },
    { name: 'AHU Selection', path: '/ahu-selection' },
    { name: 'Climate Conditions', path: '/climate' },
    { name: 'Room & Ventilation', path: '/room-data' },
    { name: 'Infiltration', path: '/infiltration' },
    { name: 'Heat Gain Calc', path: '/heat-gain' },
    { name: 'Results', path: '/results' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-1 md:space-x-4 overflow-x-auto no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  isActive
                    ? 'border-blue-600 text-blue-600' // Active Styles
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Inactive Styles
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}