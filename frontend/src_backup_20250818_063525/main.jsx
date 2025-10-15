// src/main.jsx - Updated with Combined Providers
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.jsx';
import './index.css';

// Import combined providers
import { CombinedProviders } from './contexts/CombinedProviders';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CombinedProviders>
          <App />
        </CombinedProviders>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
