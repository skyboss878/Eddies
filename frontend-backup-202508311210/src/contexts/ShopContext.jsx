import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [shopInfo, setShopInfo] = useState({
    name: "Eddie's Automotive",
    address: "",
    phone: "",
    email: ""
  });

  const value = {
    shopInfo,
    setShopInfo
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
};
