// src/components/Navigation.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon,
  CubeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function Navigation({ onNavigate }) {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { path: "/customers", label: "Customers", icon: UsersIcon },
    { path: "/vehicles", label: "Vehicles", icon: TruckIcon },
    { path: "/jobs", label: "Jobs", icon: WrenchScrewdriverIcon },
    { path: "/estimates", label: "Estimates", icon: DocumentTextIcon },
    { path: "/invoices", label: "Invoices", icon: CurrencyDollarIcon },
    { path: "/appointments", label: "Appointments", icon: CalendarIcon },
    { path: "/reports", label: "Reports", icon: ChartBarIcon },
    { path: "/inventory", label: "Inventory", icon: CubeIcon },
    { path: "/parts", label: "Parts & Labor", icon: Cog6ToothIcon },
  ];

  const handleClick = () => {
    // Call the onNavigate callback when a menu item is clicked
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={handleClick}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg
                  transition-colors duration-150
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
