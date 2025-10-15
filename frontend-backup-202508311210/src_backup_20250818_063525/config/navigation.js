// src/config/navigation.js - Fixed to Match App.jsx Routes
// Professional-grade navigation system aligned with actual routing

// 🎯 Core Workflow Navigation (primary daily operations)
export const mainNavLinks = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    description: 'Overview and key metrics'
  },
  {
    to: '/customers',
    label: 'Customers',
    icon: '👥',
    description: 'Customer management and history'
  },
  {
    to: '/vehicles',
    label: 'Vehicles',
    icon: '🚗',
    description: 'Vehicle records and service history'
  },
  {
    to: '/jobs',  // FIXED: matches App.jsx
    label: 'Jobs',
    icon: '🔧',
    description: 'Active and completed jobs'
  },
  {
    to: '/estimates',
    label: 'Estimates',
    icon: '💰',
    description: 'Quotes and pricing'
  },
  {
    to: '/inventory',
    label: 'Inventory',
    icon: '📦',
    description: 'Parts and supplies management'
  }
];

// 🏢 Business Management Navigation (admin and reporting)
export const managementNavLinks = [
  {
    to: '/invoices',  // FIXED: matches App.jsx
    label: 'Invoicing',
    icon: '🧾',
    description: 'Billing and payment tracking'
  },
  {
    to: '/reports',
    label: 'Reports',
    icon: '📈',
    description: 'Business analytics and insights'
  },
  {
    to: '/parts-labor',  // FIXED: matches App.jsx
    label: 'Parts & Labor',
    icon: '⚙️',
    description: 'Labor rates and pricing management'
  },
  {
    to: '/settings',  // FIXED: matches App.jsx
    label: 'Settings',
    icon: '🏪',
    description: 'Business configuration and preferences'
  }
];

// 🤖 AI-Powered Features (your competitive advantage!)
export const aiNavLinks = [
  {
    to: '/ai-diagnostics',  // FIXED: matches App.jsx
    label: 'AI Diagnostics',
    icon: '🧠',
    description: 'AI-powered vehicle diagnostics',
    badge: 'NEW'
  },
  {
    to: '/estimates/ai',  // FIXED: matches App.jsx
    label: 'AI Estimates',
    icon: '✨',
    description: 'Smart estimate generation',
    badge: 'BETA'
  },
  {
    to: '/diagnosis',  // FIXED: matches App.jsx
    label: 'Diagnosis Tools',
    icon: '🔍',
    description: 'Advanced diagnostic tools'
  }
];

// 🔧 Advanced Features (for power users)
export const advancedNavLinks = [
  {
    to: '/migration',  // FIXED: matches App.jsx
    label: 'Data Migration',
    icon: '📊',
    description: 'Import/export and data management'
  },
  {
    to: '/appointments',  // matches App.jsx
    label: 'Appointments',
    icon: '📅',
    description: 'Appointment scheduling'
  },
  {
    to: '/profile',  // matches App.jsx
    label: 'Profile',
    icon: '👤',
    description: 'User profile management'
  }
];

// 🚀 Quick Actions (prominent CTAs)
export const quickActions = [
  {
    to: '/customers/add',
    label: 'Add Customer',
    icon: '👤',
    type: 'primary',
    shortcut: 'C',
    description: 'Add a new customer'
  },
  {
    to: '/jobs/create',  // FIXED: matches App.jsx
    label: 'New Job',
    icon: '🔧',
    type: 'secondary',
    shortcut: 'J',
    description: 'Start a new repair job'
  },
  {
    to: '/estimates/create',  // FIXED: matches App.jsx
    label: 'Create Estimate',
    icon: '💰',
    type: 'secondary',
    shortcut: 'E',
    description: 'Create a new estimate'
  },
  {
    to: '/vehicles/add',  // FIXED: matches App.jsx
    label: 'Add Vehicle',
    icon: '🚗',
    type: 'secondary',
    shortcut: 'V',
    description: 'Add a new vehicle'
  }
];

// 📱 Mobile-Optimized Quick Links
export const mobileQuickLinks = [
  { to: '/dashboard', label: 'Home', icon: '🏠' },
  { to: '/jobs', label: 'Jobs', icon: '🔧' },  // FIXED
  { to: '/customers', label: 'Customers', icon: '👥' },
  { to: '/ai-diagnostics', label: 'AI', icon: '🧠' }  // NEW: Showcase AI
];

// Primary CTA for main navbar
export const ctaButton = quickActions[1]; // New Job (most common action)

// 🏆 Professional Features Status
export const featureStatus = {
  implemented: [
    'Customer Management (/customers)',
    'Vehicle Tracking (/vehicles)',
    'Job Management (/jobs)',
    'Estimate Generation (/estimates)',
    'Invoice Creation (/invoices)',
    'AI Diagnostics (/ai-diagnostics)',
    'Parts & Labor Management (/parts-labor)',
    'Reporting Dashboard (/reports)',
    'User Authentication',
    'Data Migration Tools (/migration)'
  ],
  inProgress: [
    'Inventory Management (/inventory)',
    'Advanced AI Features',
    'Appointment Scheduling (/appointments)'
  ],
  planned: [
    'Real-time inventory tracking',
    'Customer portal',
    'Mobile technician app',
    'Parts ordering integration',
    'Warranty tracking',
    'Multi-location support'
  ]
};

// Navigation groups for different user roles
export const navigationByRole = {
  admin: [...mainNavLinks, ...managementNavLinks, ...aiNavLinks, ...advancedNavLinks],
  manager: [...mainNavLinks, ...managementNavLinks, ...aiNavLinks],
  technician: [
    mainNavLinks[0], // Dashboard
    mainNavLinks[2], // Vehicles
    mainNavLinks[3], // Jobs
    aiNavLinks[0],   // AI Diagnostics
    aiNavLinks[2]    // Diagnosis Tools
  ],
  customer: [
    mainNavLinks[0], // Dashboard
    advancedNavLinks[2] // Profile
  ]
};

// Breadcrumb configuration - FIXED to match actual routes
export const breadcrumbConfig = {
  '/dashboard': ['Dashboard'],
  '/customers': ['Dashboard', 'Customers'],
  '/customers/add': ['Dashboard', 'Customers', 'Add Customer'],
  '/customers/edit': ['Dashboard', 'Customers', 'Edit Customer'],
  '/vehicles': ['Dashboard', 'Vehicles'],
  '/vehicles/add': ['Dashboard', 'Vehicles', 'Add Vehicle'],
  '/jobs': ['Dashboard', 'Jobs'],
  '/jobs/create': ['Dashboard', 'Jobs', 'Create Job'],
  '/jobs/edit': ['Dashboard', 'Jobs', 'Edit Job'],
  '/estimates': ['Dashboard', 'Estimates'],
  '/estimates/create': ['Dashboard', 'Estimates', 'Create Estimate'],
  '/estimates/ai': ['Dashboard', 'Estimates', 'AI Estimates'],
  '/inventory': ['Dashboard', 'Inventory'],
  '/invoices': ['Dashboard', 'Invoices'],
  '/reports': ['Dashboard', 'Reports'],
  '/parts-labor': ['Dashboard', 'Parts & Labor'],
  '/settings': ['Dashboard', 'Settings'],
  '/ai-diagnostics': ['Dashboard', 'AI Diagnostics'],
  '/diagnosis': ['Dashboard', 'Diagnosis'],
  '/migration': ['Dashboard', 'Data Migration'],
  '/appointments': ['Dashboard', 'Appointments'],
  '/profile': ['Dashboard', 'Profile']
};

// Eddie's Automotive specific configuration
export const shopInfo = {
  name: "Eddie's Automotive",
  address: "3123 Chester Ave, Bakersfield CA 93301",
  phone: "(661) 327-4242",
  email: "info@eddiesautomotive.com",
  hours: {
    monday: "7:00 AM - 6:00 PM",
    tuesday: "7:00 AM - 6:00 PM",
    wednesday: "7:00 AM - 6:00 PM",
    thursday: "7:00 AM - 6:00 PM",
    friday: "7:00 AM - 6:00 PM",
    saturday: "8:00 AM - 4:00 PM",
    sunday: "Closed"
  },
  specialties: [
    "General Auto Repair",
    "Engine Diagnostics",
    "Brake Service",
    "Oil Changes",
    "AC Repair",
    "Transmission Service"
  ]
};

// Export for easy import
export default {
  mainNavLinks,
  managementNavLinks,
  aiNavLinks,
  advancedNavLinks,
  quickActions,
  mobileQuickLinks,
  ctaButton,
  featureStatus,
  navigationByRole,
  breadcrumbConfig,
  shopInfo
};
