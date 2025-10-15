import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Zap, Activity, Gauge, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiEndpoints } from '../../utils/api';
import toast from 'react-hot-toast';

const VehicleDiagnostics: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await apiEndpoints.vehicles.getAll();
      return response.data.vehicles || response.data;
    },
  });

  const handleConnectOBD = () => {
    // OBD connection logic here
    setConnectionStatus('connected');
    toast.success('Connected to vehicle diagnostics');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Car className="mr-2" />
          Vehicle Diagnostics
        </h2>
        {isLoading ? (
          <div>Loading vehicles...</div>
        ) : (
          <div className="space-y-4">
            {vehicles?.map((vehicle: any) => (
              <div key={vehicle.id} className="border p-4 rounded">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDiagnostics;
