// src/components/SmartBreadcrumb.jsx
import React from 'react';
import {
  ArrowLeftIcon,
  HomeIcon,
  UserGroupIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  PrinterIcon,
  EnvelopeIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  Cog6ToothIcon,
  SparklesIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useEnhancedNavigation } from '../hooks/useEnhancedNavigation';

const SmartBreadcrumb = ({ path, customTitle, actions = [] }) => {
  const { goBack, canGoBack } = useEnhancedNavigation();

  const breadcrumbMap = {
    '/dashboard': { title: 'Dashboard', icon: HomeIcon },
    '/customers': { title: 'Customers', icon: UserGroupIcon },
    '/customers/add': { title: 'Add Customer', icon: PlusIcon },
    '/vehicles': { title: 'Vehicles', icon: TruckIcon },
    '/vehicles/add': { title: 'Add Vehicle', icon: PlusIcon },
    '/jobs': { title: 'Jobs', icon: WrenchScrewdriverIcon },
    '/jobs/create': { title: 'Create Job', icon: PlusIcon },
    '/estimates': { title: 'Estimates', icon: ClipboardDocumentListIcon },
    '/estimates/new': { title: 'New Estimate', icon: PlusIcon },
    '/estimates/ai': { title: 'AI Estimate', icon: SparklesIcon },
    '/invoices': { title: 'Invoices', icon: CurrencyDollarIcon },
    '/parts': { title: 'Parts & Labor', icon: WrenchScrewdriverIcon },
    '/inventory': { title: 'Inventory', icon: ClipboardDocumentListIcon },
    '/reports': { title: 'Reports', icon: DocumentArrowDownIcon },
    '/settings': { title: 'Settings', icon: Cog6ToothIcon },
    '/ai-diagnostics': { title: 'AI Diagnostics', icon: SparklesIcon },
  };

  // Handle dynamic routes (like /customers/123)
  const currentItem = breadcrumbMap[path] || { 
    title: customTitle || 'Page', 
    icon: EyeIcon 
  };
  const Icon = currentItem.icon;

  return (
    <div className="flex items-center space-x-4 mb-6 bg-white rounded-lg shadow-sm p-4 border">
      {canGoBack && (
        <button
          onClick={goBack}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 hover:text-gray-900"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back</span>
        </button>
      )}

      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5 text-blue-600" />
        <h1 className="text-xl font-semibold text-gray-900">{currentItem.title}</h1>
      </div>

      <div className="flex-1" />

      {/* Custom Actions */}
      <div className="flex items-center space-x-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-2 rounded-lg transition-colors ${action.className || 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
            title={action.title}
          >
            <action.icon className="w-4 h-4" />
          </button>
        ))}
        
        {/* Default contextual actions for customer pages */}
        {path.includes('/customers/') && !actions.length && (
          <>
            <button 
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Print"
            >
              <PrinterIcon className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
              title="Email"
            >
              <EnvelopeIcon className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
              title="Export"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SmartBreadcrumb;
