// src/components/Navigation.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Calendar,
  FileText,
  Receipt,
  Package,
  BarChart3,
  Brain,
  Settings,
  Search,
  Bell,
  User,
  Database,
  ShoppingCart,
  History,
  TrendingUp,
  UserCog,
  SystemConfig,
  Download,
  Archive
} from 'lucide-react';

// Navigation configuration with organized sections
export const navigationConfig = [
  {
    section: 'Main',
    items: [
      {
        name: 'Dashboard',
        href: '/app/dashboard',
        icon: LayoutDashboard,
        description: 'Overview and quick stats'
      }
    ]
  },
  {
    section: 'Customer Management',
    items: [
      {
        name: 'Customers',
        href: '/app/customers',
        icon: Users,
        description: 'Manage customer information'
      },
      {
        name: 'Vehicles',
        href: '/app/vehicles',
        icon: Car,
        description: 'Vehicle database and history'
      }
    ]
  },
  {
    section: 'Operations',
    items: [
      {
        name: 'Jobs',
        href: '/app/jobs',
        icon: Wrench,
        description: 'Work orders and repairs'
      },
      {
        name: 'Appointments',
        href: '/app/appointments',
        icon: Calendar,
        description: 'Schedule and calendar'
      }
    ]
  },
  {
    section: 'Financial',
    items: [
      {
        name: 'Estimates',
        href: '/app/estimates',
        icon: FileText,
        description: 'Price quotes and estimates'
      },
      {
        name: 'Invoices',
        href: '/app/invoices',
        icon: Receipt,
        description: 'Billing and payments'
      }
    ]
  },
  {
    section: 'Inventory',
    items: [
      {
        name: 'Parts & Labor',
        href: '/app/parts-labor',
        icon: Package,
        description: 'Parts inventory and labor rates'
      },
      {
        name: 'Inventory Management',
        href: '/app/inventory',
        icon: Database,
        description: 'Stock levels and ordering'
      },
      {
        name: 'Purchase Orders',
        href: '/app/purchase-orders',
        icon: ShoppingCart,
        description: 'Supplier orders and receiving'
      }
    ]
  },
  {
    section: 'AI & Diagnostics',
    items: [
      {
        name: 'AI Diagnostics',
        href: '/app/ai-diagnostics',
        icon: Brain,
        description: 'AI-powered vehicle diagnostics'
      },
      {
        name: 'Diagnostic History',
        href: '/app/diagnostic-history',
        icon: History,
        description: 'Past diagnostic reports'
      }
    ]
  },
  {
    section: 'Analytics',
    items: [
      {
        name: 'Reports',
        href: '/app/reports',
        icon: BarChart3,
        description: 'Business reports and insights'
      },
      {
        name: 'Analytics',
        href: '/app/analytics',
        icon: TrendingUp,
        description: 'Advanced business analytics'
      }
    ]
  },
  {
    section: 'Administration',
    items: [
      {
        name: 'Settings',
        href: '/app/settings',
        icon: Settings,
        description: 'System preferences'
      },
      {
        name: 'User Management',
        href: '/app/user-management',
        icon: UserCog,
        description: 'Manage users and permissions'
      },
      {
        name: 'System Config',
        href: '/app/system-config',
        icon: SystemConfig,
        description: 'System configuration'
      }
    ]
  },
  {
    section: 'Data Management',
    items: [
      {
        name: 'Import/Export',
        href: '/app/data-import-export',
        icon: Download,
        description: 'Data import and export tools'
      },
      {
        name: 'Backup & Restore',
        href: '/app/backup-restore',
        icon: Archive,
        description: 'System backup and restore'
      }
    ]
  }
];

// Quick access items (for header or quick navigation)
export const quickAccessItems = [
  {
    name: 'Search',
    href: '/app/search',
    icon: Search,
    description: 'Global search'
  },
  {
    name: 'Notifications',
    href: '/app/notifications',
    icon: Bell,
    description: 'System notifications'
  },
  {
    name: 'Profile',
    href: '/app/profile',
    icon: User,
    description: 'User profile'
  }
];

// Navigation component
const Navigation = ({ isCollapsed = false }) => {
  return (
    <nav className="flex-1 overflow-y-auto">
      <div className="px-3 py-4 space-y-6">
        {navigationConfig.map((section) => (
          <div key={section.section}>
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                        isActive
                          ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                    title={isCollapsed ? item.description : ''}
                  >
                    <Icon size={20} className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
