// src/components/ai/index.js - Updated with correct service path
export { default as AIChat } from './AIChat.jsx';
export { default as AIDashboard } from './AIDashboard.jsx';
export { default as AIDiagnosticHelper } from './AIDiagnosticHelper.jsx';
export { default as AIEstimateModal } from './AIEstimateModal.jsx';
export { default as OBD2Lookup } from './OBD2Lookup.jsx';

// AI Services and Utilities
export { generateAIResponse } from './AIProvider.js';

// Re-export AI-related services for convenience
export { aiService } from '../../utils/services/aiService';
export { obd2Service } from '../../utils/services/aiService';

// ---

// src/components/ai/AIChat.jsx - Update import at top
import { aiService } from '../../utils/services/aiService';

// ---

// src/components/ai/AIDiagnosticHelper.jsx - Update import at top  
import { aiService } from '../../utils/services/aiService';

// ---

// src/components/ai/OBD2Lookup.jsx - Update import at top
import { obd2Service } from '../../utils/services/aiService';

// ---

// src/pages/AIDiagnostics.jsx - Update import at top
import { aiService, obd2Service } from '../utils/services/aiService';

// ---

// src/components/AIEstimateCard.jsx - Update import at top (if you use the aiService there)
import { aiService } from '../utils/services/aiService';
