// src/contexts/SettingsProvider.jsx - Fixed to work with your API
import React, { createContext, useContext, useState, useEffect } from 'react';
import { settings_get, settings_shop_get, settings_shop_put } from "../utils/api";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
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

  // Load settings on provider mount
  useEffect(() => {
    const loadSettings = async () => {
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
          // General settings endpoint might not exist, that's OK
          console.warn('General settings not available:', error.message);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

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

  const updateSettings = async (newSettings) => {
    // For backward compatibility, redirect to updateShopSettings if it's shop data
    if (newSettings.shop || newSettings.name || newSettings.address) {
      const shopData = newSettings.shop || newSettings;
      return updateShopSettings(shopData);
    }

    // Handle other settings updates here if needed
    setSettings(prev => ({ ...prev, ...newSettings }));
    return { success: true };
  };

  const resetSettings = () => {
    setSettings({
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
  };

  const value = {
    settings,
    loading,
    updateSettings,
    updateShopSettings,
    resetSettings
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
