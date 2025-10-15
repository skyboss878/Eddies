// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-xl font-bold">
              Eddie's Automotive
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/customers" className="nav-link">Customers</Link>
            <Link to="/vehicles" className="nav-link">Vehicles</Link>
            <Link to="/jobs" className="nav-link">Jobs</Link>
            <Link to="/estimates" className="nav-link">Estimates</Link>
            <Link to="/invoices" className="nav-link">Invoices</Link>
            <Link to="/appointments" className="nav-link">Appointments</Link>
            <Link to="/reports" className="nav-link">Reports</Link>
            <Link to="/inventory" className="nav-link">Inventory</Link>
            <Link to="/parts" className="nav-link">Parts & Labor</Link>
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/dashboard" className="nav-link block">Dashboard</Link>
          <Link to="/customers" className="nav-link block">Customers</Link>
          <Link to="/vehicles" className="nav-link block">Vehicles</Link>
          <Link to="/jobs" className="nav-link block">Jobs</Link>
          <Link to="/estimates" className="nav-link block">Estimates</Link>
          <Link to="/invoices" className="nav-link block">Invoices</Link>
          <Link to="/appointments" className="nav-link block">Appointments</Link>
          <Link to="/reports" className="nav-link block">Reports</Link>
          <Link to="/inventory" className="nav-link block">Inventory</Link>
          <Link to="/parts" className="nav-link block">Parts & Labor</Link>
        </div>
      )}
    </nav>
  );
}
