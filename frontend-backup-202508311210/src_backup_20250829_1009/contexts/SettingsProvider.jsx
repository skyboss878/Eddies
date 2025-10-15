// src/contexts/SettingsProvider.jsx - Fixed to work with your API
import React, { createContext, useContext, useState, useEffect } from 'react';
import { settings_get, settings_shop_get, settings_shop_put } from "../utils/api";
import { useAuth } from "./AuthContext";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState({
    shop: {
      name: "Eddie's Asian Automotive",
      address: "",
      phone: "",
      email: "",
      website: "",
      logo_url: "",
      tax_rate: 0,
      labor_rate: 0
    },
    user: {},
    app: {}
  });
  const [loading, setLoading] = useState(false);

  // Load settings only when authenticated
  useEffect(() => {
    const loadSettings = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        // Load shop settings
        const shopResponse = await settings_shop_get();
        if (shopResponse.data) {
          setSettings(prev => ({
            ...prev,
            shop: { ...prev.shop, ...shopResponse.data }
          }));
        }

        // Load general settings if available
        try {
          const generalResponse = await settings_get();
          if (generalResponse.data) {
            setSettings(prev => ({
              ...prev,
              ...generalResponse.data
            }));
          }
        } catch (error) {
          console.error('Failed to load general settings:', error);
        }
      } catch (error) {
        console.error('Failed to load shop settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [isAuthenticated]); // Only run when authentication status changes

  const updateShopSettings = async (newShopSettings) => {
    setLoading(true);
    try {
      const response = await settings_shop_put(newShopSettings);

      setSettings(prev => ({
        ...prev,
        shop: { ...prev.shop, ...newShopSettings }
      }));

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to update shop settings:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update settings'
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    settings,
    loading,
    updateShopSettings
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
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
