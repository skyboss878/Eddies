import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiEndpoints } from "../utils";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    shop: {
      name: "Eddie's Automotive",
      address: "",
      phone: "",
      email: ""
    },
    user: {}
  });
  const [loading, setLoading] = useState(false);

  const updateSettings = async (newSettings) => {
    setLoading(true);
    try {
      await apiEndpoints.settings.update(newSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const value = {
    settings,
    loading,
    updateSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
