// src/contexts/SettingsContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";

const defaultSettings = {
  shopName: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  licenseNumber: "",
  taxRate: 0.0875,
  laborRate: 140,
  partsMarkup: 0.35,
  shopSuppliesRate: 0.05,
  diagnosticFee: 150,
  businessHours: {
    monday: { open: "08:00", close: "18:00", closed: false },
    tuesday: { open: "08:00", close: "18:00", closed: false },
    wednesday: { open: "08:00", close: "18:00", closed: false },
    thursday: { open: "08:00", close: "18:00", closed: false },
    friday: { open: "08:00", close: "18:00", closed: false },
    saturday: { open: "08:00", close: "16:00", closed: false },
    sunday: { open: "00:00", close: "00:00", closed: true }
  },
  invoiceTemplate: {
    headerColor: "#dc2626",
    logoUrl: "",
    showLogo: true,
    showBusinessHours: true,
    paymentTerms: "Payment due upon completion of work",
    warrantyInfo: "12 months / 12,000 miles parts & labor warranty",
    disclaimers: "Estimate valid for 30 days. Additional diagnosis may reveal additional needed repairs.",
    footerNotes: "Thank you for choosing our automotive service!",
    showTaxID: false,
    taxID: ""
  },
  aiSettings: {
    includePartsPricing: true,
    includeLaborEstimates: true,
    includeWarrantyInfo: true,
    includeSafetyNotes: true,
    defaultConfidenceThreshold: 0.7,
    maxPartsPerEstimate: 20,
    maxLaborHoursPerJob: 40
  }
};

const SettingsContext = createContext({
  settings: defaultSettings,
  loading: false,
  error: null,
  refresh: async () => {},
  save: async () => {}
});

export const SettingsProvider = ({ children, token }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({ ...prev, ...data }));
      } else if (res.status !== 404) {
        throw new Error(`Failed to load settings. Status: ${res.status}`);
      }
    } catch (e) {
      console.error("Settings refresh error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const save = useCallback(
    async (next) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(next)
        });
        if (!res.ok) throw new Error(`Failed to save settings. Status: ${res.status}`);
        const updated = await res.json();
        setSettings(updated);
        return updated;
      } catch (e) {
        console.error("Settings save error:", e);
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ settings, loading, error, refresh, save, setSettings }), [
    settings,
    loading,
    error,
    refresh,
    save
  ]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

SettingsProvider.propTypes = {
  children: PropTypes.node,
  token: PropTypes.string
};

export const useSettings = () => useContext(SettingsContext);  
