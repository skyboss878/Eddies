import React from "react";
import { AuthProvider } from "./AuthContext";
import { DataProvider } from "./DataContext";
import { ShopProvider } from "./ShopContext";
import { SettingsProvider } from "./SettingsProvider";

export const CombinedProviders = ({ children }) => {
  return (
    <AuthProvider>
      <DataProvider>
        <ShopProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </ShopProvider>
      </DataProvider>
    </AuthProvider>
  );
};
