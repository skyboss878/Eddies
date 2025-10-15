
  // AI Services - NEW ROUTES
  ai: {
    diagnostics: '/api/ai/diagnostics',
    estimate: '/api/ai/estimate', 
    chat: '/api/ai/chat',
    status: '/api/ai/status'
  },

  // OBD2 Services - NEW ROUTES  
  obd2: {
    lookup: (code) => `/api/obd2/lookup/${code}`
  }
