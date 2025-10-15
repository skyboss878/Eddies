import React from "react";
import { AuthProvider } from "./AuthContext";
import { DataProvider } from "./DataContext";
import { ShopProvider } from "./ShopContext";

export const CombinedProviders = ({ children }) => {   // 👈 named export
  return (
    <AuthProvider>
      <DataProvider>
        <ShopProvider>
          {children}
        </ShopProvider>
      </DataProvider>
    </AuthProvider>
  );
};
