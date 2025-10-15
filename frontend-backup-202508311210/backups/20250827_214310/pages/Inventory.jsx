// src/components/InventoryStats.jsx
import React, { useMemo } from "react";

export default function InventoryStats({ parts }) {
  // Calculate stats using useMemo to avoid unnecessary recalculations
  const stats = useMemo(() => {
    const totalParts = parts?.length || 0;
    const lowStockParts = parts?.filter(
      (part) => (part.quantity || 0) > 0 && (part.quantity || 0) <= 5
    ).length || 0;
    const outOfStockParts = parts?.filter(
      (part) => (part.quantity || 0) === 0
    ).length || 0;
    const totalValue =
      parts?.reduce(
        (sum, part) => sum + ((part.quantity || 0) * (part.price || 0)),
        0
      ) || 0;

    return {
      totalParts,
      lowStockParts,
      outOfStockParts,
      totalValue,
    };
  }, [parts]);

  // Function to return stock status for individual part
  const getStockStatus = (part) => {
    const quantity = part.quantity || 0;
    if (quantity === 0) return "Out of Stock";
    if (quantity <= 5) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="inventory-stats bg-white shadow rounded p-4">
      <h2 className="text-xl font-bold mb-4">Inventory Statistics</h2>
      <ul>
        <li>Total Parts: {stats.totalParts}</li>
        <li>Low Stock Parts: {stats.lowStockParts}</li>
        <li>Out of Stock Parts: {stats.outOfStockParts}</li>
        <li>Total Inventory Value: ${stats.totalValue.toFixed(2)}</li>
      </ul>

      {/* Optional: Display stock status for each part */}
      {parts?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Stock Status</h3>
          <ul>
            {parts.map((part, index) => (
              <li key={index}>
                {part.name}: {getStockStatus(part)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
