// src/contexts/SettingsProvider.jsx - UNIFIED VERSION
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [settings, setSettings] = useState({
    shop: {
      name: "Eddie's Asian Automotive",
      address: "",
      phone: "",
      email: "",
      website: "",
      logo_url: "",
      tax_rate: 0.0875,
      labor_rate: 140
    },
    pricing: {
      taxRate: 0.0875,
      laborRate: 140,
      partsMarkup: 0.35,
      shopSuppliesRate: 0.05,
      diagnosticFee: 150
    },
    businessHours: {},
    invoiceTemplate: {},
    aiSettings: {},
    user: {},
    app: {}
  });
  const [loading, setLoading] = useState(false);

  // Load settings when authenticated
  useEffect(() => {
    const loadSettings = async () => {
      if (!isAuthenticated || !token) return;
      
      setLoading(true);
      try {
        // Use consistent base URL
        const response = await fetch('http://localhost:5000/api/settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({
            ...prev,
            shop: {
              name: data.shopName || "Eddie's Asian Automotive",
              address: data.address || "",
              phone: data.phone || "",
              email: data.email || "",
              website: data.website || "",
              logo_url: data.logoUrl || "",
              tax_rate: data.taxRate || 0.0875,
              labor_rate: data.laborRate || 140
            },
            pricing: {
              taxRate: data.taxRate || 0.0875,
              laborRate: data.laborRate || 140,
              partsMarkup: data.partsMarkup || 0.35,
              shopSuppliesRate: data.shopSuppliesRate || 0.05,
              diagnosticFee: data.diagnosticFee || 150
            },
            businessHours: data.businessHours || {},
            invoiceTemplate: data.invoiceTemplate || {},
            aiSettings: data.aiSettings || {}
          }));
        } else if (response.status !== 404) {
          console.warn(`Settings API returned ${response.status}, using defaults`);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [isAuthenticated, token]);

  const updateShopSettings = async (newShopSettings) => {
    if (!token) return { success: false, error: 'Not authenticated' };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shopName: newShopSettings.name,
          address: newShopSettings.address,
          phone: newShopSettings.phone,
          email: newShopSettings.email,
          website: newShopSettings.website,
          taxRate: newShopSettings.tax_rate,
          laborRate: newShopSettings.labor_rate,
          ...newShopSettings
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setSettings(prev => ({
          ...prev,
          shop: { ...prev.shop, ...newShopSettings }
        }));
        return { success: true, data: updated };
      } else {
        throw new Error(`Failed to update settings. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update shop settings:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to update settings' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get shop info for dashboard
  const getShop = () => {
    return settings.shop;
  };

  const value = {
    settings,
    loading,
    updateShopSettings,
    getShop // This was the missing function causing the error
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
