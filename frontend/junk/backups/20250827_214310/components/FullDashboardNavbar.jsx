// src/components/FullDashboardNavbar.jsx
import React, { useState } from 'react';
import CompleteNavigationMenu from './CompleteNavigationMenu';
import TimeClockNavbar from './TimeClockNavbar';
import { Menu, X } from 'lucide-react';

export default function FullDashboardNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Brand / Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="text-xl font-bold text-gray-800">Eddie's Askan</a>
          </div>

          {/* Middle: Desktop navigation */}
          <div className="hidden md:flex md:space-x-6 items-center flex-1 ml-4">
            <CompleteNavigationMenu horizontal />
          </div>

          {/* Right: Time clock + mobile toggle */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:block">
              <TimeClockNavbar />
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <CompleteNavigationMenu vertical />
            <TimeClockNavbar />
          </div>
        </div>
      )}
    </header>
  );
}
