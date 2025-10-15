import React from 'react';
import { AuthProvider } from './AuthContext';
import { DataProvider } from './DataContext';
import { SettingsProvider } from './SettingsProvider';
import { ShopProvider } from './ShopContext';

export const CombinedProviders = ({ children }) => (
  <AuthProvider>
    <DataProvider>
      <SettingsProvider>
        <ShopProvider>
          {children}
        </ShopProvider>
      </SettingsProvider>
    </DataProvider>
  </AuthProvider>
);
