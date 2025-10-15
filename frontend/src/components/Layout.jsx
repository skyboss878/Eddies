import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon, UserGroupIcon, TruckIcon, BriefcaseIcon, DocumentTextIcon,
  CurrencyDollarIcon, CalendarIcon, CpuChipIcon, ClipboardDocumentListIcon,
  WrenchScrewdriverIcon, ClockIcon, ChartBarIcon, CogIcon,
  Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Customers', href: '/customers', icon: UserGroupIcon },
    { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
    { name: 'Estimates', href: '/estimates', icon: DocumentTextIcon },
    { name: 'Invoices', href: '/invoices', icon: CurrencyDollarIcon },
    { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
    { name: 'AI Diagnostics', href: '/ai/diagnostics', icon: CpuChipIcon },
    { name: 'Inventory', href: '/inventory', icon: ClipboardDocumentListIcon },
    { name: 'Parts & Labor', href: '/parts-labor', icon: WrenchScrewdriverIcon },
    { name: 'Time Clock', href: '/timeclock', icon: ClockIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar, topbar, and content as in your code */}
      {/* [Full layout code copied from your snippet] */}
      {children}
    </div>
  );
};

export default Layout;
