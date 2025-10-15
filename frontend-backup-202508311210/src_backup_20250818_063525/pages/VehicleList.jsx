// src/pages/VehicleList.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDataOperations } from '../hooks/useDataOperations';
import { useSearchFilter } from '../hooks/useSearchFilter';
import ConfirmModal from '../components/modals/ConfirmModal';
import { ClipboardCopy } from 'lucide-react';

export default function VehicleList() {
  const navigate = useNavigate();
  // ✨ Get data and vehicle-specific actions from our hook
  const { vehicles, customersMap, loading: initialLoading, vehicleOps, utils } = useDataOperations();

  // ✨ State for the confirmation modal is now cleaner
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Your data enrichment logic is excellent and remains unchanged
  const vehiclesWithCustomerData = useMemo(() => {
    return vehicles.map(vehicle => ({
      ...vehicle,
      customerName: customersMap.get(vehicle.customerId)?.name || "Unknown Owner",
    }));
  }, [vehicles, customersMap]);

  // Your search filter integration is perfect
  const { filteredData: filteredVehicles, setSearchTerm } = useSearchFilter(
    vehiclesWithCustomerData,
    { searchableFields: ['make', 'model', 'year', 'vin', 'customerName', 'licensePlate'] }
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    utils.showMessage("Copied to clipboard!", "info");
  };

  // ✨ The delete handler is now much simpler
  const handleConfirmDelete = async () => {
    if (vehicleToDelete) {
      await vehicleOps.delete(vehicleToDelete.id);
      setVehicleToDelete(null); // Close modal automatically
    }
  };
  
  // Your loading state skeleton is great
  if (initialLoading) {
    return <div className="p-6 text-center text-gray-500">Loading vehicles...</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Vehicles ({filteredVehicles.length})
        </h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search vehicles..."
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => navigate("/app/add-vehicle")}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            Add Vehicle
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-md">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-600">Owner</th>
              <th className="p-3 text-left font-semibold text-gray-600">Vehicle</th>
              <th className="p-3 text-left font-semibold text-gray-600">VIN</th>
              <th className="p-3 text-left font-semibold text-gray-600">Mileage</th>
              <th className="p-3 text-left font-semibold text-gray-600">License</th>
              <th className="p-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-gray-200 hover:bg-blue-50">
                  <td className="p-3 font-medium text-gray-800">{vehicle.customerName}</td>
                  <td className="p-3 text-gray-600">{vehicle.year} {vehicle.make} {vehicle.model}</td>
                  <td className="p-3 font-mono text-xs text-gray-500">
                    {vehicle.vin || 'N/A'}
                    {vehicle.vin && (
                      <button onClick={() => copyToClipboard(vehicle.vin)} className="ml-2 text-gray-400 hover:text-blue-600" title="Copy VIN">
                        <ClipboardCopy className="w-4 h-4 inline" />
                      </button>
                    )}
                  </td>
                  <td className={`p-3 font-semibold ${vehicle.mileage > 150000 ? 'text-red-600' : 'text-gray-800'}`}>
                    {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : 'N/A'}
                  </td>
                  <td className="p-3 font-mono text-xs">{vehicle.licensePlate || 'N/A'}</td>
                  <td className="p-3 whitespace-nowrap">
                    <button onClick={() => navigate(`/add-vehicle?id=${vehicle.id}`)} className="px-3 py-1 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 text-xs font-bold">Edit</button>
                    <button
                      onClick={() => setVehicleToDelete(vehicle)}
                      className="ml-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs font-bold disabled:opacity-50"
                      disabled={utils.isLoading(`deleteVehicle_${vehicle.id}`)} // ✨ Loading state from hook
                    >
                      {utils.isLoading(`deleteVehicle_${vehicle.id}`) ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No vehicles found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {vehicleToDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete the ${vehicleToDelete.year} ${vehicleToDelete.make} ${vehicleToDelete.model}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setVehicleToDelete(null)}
        />
      )}
    </div>
  );
}

