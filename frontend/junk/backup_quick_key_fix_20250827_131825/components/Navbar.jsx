// src/components/CompleteNavigationMenu.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Calendar, FileText, Bell, Settings, Cpu } from 'lucide-react';
import TimeClockDashboard from './TimeClockNavbar';
import UserDropdown from './UserDropdown';
import RealTimeNotifications from './RealTimeNotifications';
import QuickActionButton from './QuickActionButton';

export default function CompleteNavigationMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Branding */}
          <Link to="/app/dashboard" className="text-2xl font-bold text-blue-600">
            Eddie's Askan
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Core App Links */}
            <Link to="/app/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/app/vehicles" className="nav-link">Vehicles</Link>
            <Link to="/app/jobs" className="nav-link">Jobs</Link>
            <Link to="/app/customers" className="nav-link">Customers</Link>
            <Link to="/app/estimates" className="nav-link">Estimates</Link>
            <Link to="/app/invoices" className="nav-link">Invoices</Link>
            <Link to="/app/appointments" className="nav-link">Appointments</Link>
            <Link to="/app/reports" className="nav-link">Reports</Link>
            <Link to="/app/settings" className="nav-link">Settings</Link>

            {/* AI Features */}
            <Link to="/app/ai-diagnostics" className="nav-link flex items-center">
              <Cpu className="w-4 h-4 mr-1" /> AI Diagnostics
            </Link>
            <Link to="/app/estimates/ai" className="nav-link flex items-center">
              <Cpu className="w-4 h-4 mr-1" /> AI Estimates
            </Link>
          </div>

          {/* Right Side Widgets */}
          <div className="flex items-center space-x-4">
            {/* Time Clock */}
            <div className="hidden xl:flex">
              <TimeClockDashboard />
            </div>

            {/* Quick Actions */}
            <QuickActionButton />

            {/* Notifications */}
            <RealTimeNotifications />

            {/* User Dropdown */}
            <UserDropdown />

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 space-y-2">
            <Link to="/app/dashboard" className="block nav-link">Dashboard</Link>
            <Link to="/app/vehicles" className="block nav-link">Vehicles</Link>
            <Link to="/app/jobs" className="block nav-link">Jobs</Link>
            <Link to="/app/customers" className="block nav-link">Customers</Link>
            <Link to="/app/estimates" className="block nav-link">Estimates</Link>
            <Link to="/app/invoices" className="block nav-link">Invoices</Link>
            <Link to="/app/appointments" className="block nav-link">Appointments</Link>
            <Link to="/app/reports" className="block nav-link">Reports</Link>
            <Link to="/app/settings" className="block nav-link">Settings</Link>
            <Link to="/app/ai-diagnostics" className="block nav-link">AI Diagnostics</Link>
            <Link to="/app/estimates/ai" className="block nav-link">AI Estimates</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
