import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Zap, AlertTriangle, CheckCircle, Activity, Cpu, Gauge, 
  Wrench, Clock, DollarSign, TrendingUp, Wifi, Battery,
  PlayCircle, StopCircle, RotateCcw, Download, Share2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Components
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import DiagnosticChart from './DiagnosticChart';
import DTCCodesList from './DTCCodesList';
import LiveDataPanel from './LiveDataPanel';
import PredictiveMaintenancePanel from './PredictiveMaintenancePanel';

// Services
import { diagnosticsService } from '@services/diagnosticsService';
import { obdService } from '@services/obdService';

const VehicleDiagnostics: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [liveDataEnabled, setLiveDataEnabled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  const queryClient = useQueryClient();

  // Fetch available vehicles
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: diagnosticsService.getVehicles,
  });

  // Fetch diagnostic history
  const { data: diagnosticHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['diagnostic-history', selectedVehicle?.id],
    queryFn: () => diagnosticsService.getDiagnosticHistory(selectedVehicle!.id),
    enabled: !!selectedVehicle,
  });

  // Live data query
  const { data: liveData } = useQuery({
    queryKey: ['live-data', selectedVehicle?.id],
    queryFn: () => obdService.getLiveData(selectedVehicle!.id, [
      'rpm', 'speed', 'coolant_temp', 'engine_load', 'throttle_pos', 'fuel_pressure'
    ]),
    enabled: !!selectedVehicle && liveDataEnabled,
    refetchInterval: liveDataEnabled ? 1000 : false,
  });

  // OBD2 Connection Mutation
  const connectOBDMutation = useMutation({
    mutationFn: (vehicleId: string) => {
      setConnectionStatus('connecting');
      return obdService.connectVehicle(vehicleId);
    },
    onSuccess: () => {
      setConnectionStatus('connected');
      toast.success('🔌 OBD2 connected successfully!');
      setLiveDataEnabled(true);
    },
    onError: () => {
      setConnectionStatus('disconnected');
      toast.error('❌ Failed to connect OBD2');
    },
  });

  // Diagnostic Scan Mutation
  const scanMutation = useMutation({
    mutationFn: (vehicleId: string) => diagnosticsService.performFullScan(vehicleId),
    onSuccess: (data) => {
      toast.success(`✅ Scan complete! Found ${data.dtc_codes?.length || 0} codes`);
      queryClient.invalidateQueries({ queryKey: ['diagnostic-history'] });
      setIsScanning(false);
    },
    onError: () => {
      toast.error('❌ Diagnostic scan failed');
      setIsScanning(false);
    },
  });

  const handleVehicleSelect = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setLiveDataEnabled(false);
    setConnectionStatus('disconnected');
  };

  const handleConnectOBD = () => {
    if (selectedVehicle) {
      connectOBDMutation.mutate(selectedVehicle.id);
    }
  };

  const handleDiagnosticScan = () => {
    if (selectedVehicle) {
      setIsScanning(true);
      scanMutation.mutate(selectedVehicle.id);
    }
  };

  if (vehiclesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">🤖 AI Vehicle Diagnostics</h1>
              <p className="text-blue-100 text-lg">
                Advanced OBD2 diagnostics with AI-powered analysis and predictive maintenance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Cpu className="h-10 w-10 mb-2" />
                <p className="text-sm text-center">AI Engine</p>
              </div>
            </div>
          </div>
          
          {/* Connection Status */}
          {selectedVehicle && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-4 mt-6"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                  connectionStatus === 'connecting' ? 'bg-yellow-400 animate-spin' :
                  'bg-red-400'
                }`} />
                <span className="text-sm capitalize">{connectionStatus}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4" />
                <span className="text-sm">Real-time Data</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Vehicle Selection */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Car className="mr-3 h-6 w-6 text-blue-600" />
            Select Vehicle
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {vehicles?.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all shadow-sm ${
                    selectedVehicle?.id === vehicle.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-xs text-gray-500">VIN: {vehicle.vin}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Owner: {vehicle.owner_name}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Last Service: {vehicle.last_service || 'N/A'}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      vehicle.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {vehicle.status || 'active'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      {selectedVehicle && (
        <>
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Zap className="mr-3 h-6 w-6 text-yellow-600" />
                  Diagnostic Controls
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={handleConnectOBD}
                    disabled={connectOBDMutation.isPending || connectionStatus === 'connected'}
                    variant={connectionStatus === 'connected' ? "success" : "primary"}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    {connectionStatus === 'connecting' ? (
                      <LoadingSpinner size="small" />
                    ) : connectionStatus === 'connected' ? (
                      <CheckCircle className="h-8 w-8" />
                    ) : (
                      <Activity className="h-8 w-8" />
                    )}
                    <span className="text-sm font-medium">
                      {connectionStatus === 'connected' ? 'Connected' : 'Connect OBD2'}
                    </span>
                  </Button>

                  <Button
                    onClick={handleDiagnosticScan}
                    disabled={connectionStatus !== 'connected' || isScanning}
                    variant="secondary"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    {isScanning ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <Gauge className="h-8 w-8" />
                    )}
                    <span className="text-sm font-medium">Full Scan</span>
                  </Button>

                  <Button
                    onClick={() => setLiveDataEnabled(!liveDataEnabled)}
                    disabled={connectionStatus !== 'connected'}
                    variant={liveDataEnabled ? "warning" : "outline"}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    {liveDataEnabled ? (
                      <StopCircle className="h-8 w-8" />
                    ) : (
                      <PlayCircle className="h-8 w-8" />
                    )}
                    <span className="text-sm font-medium">
                      {liveDataEnabled ? 'Stop Live' : 'Start Live'}
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Download className="h-8 w-8" />
                    <span className="text-sm font-medium">Export Report</span>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Live Data Panel */}
          <AnimatePresence>
            {liveDataEnabled && liveData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <LiveDataPanel data={liveData} vehicleId={selectedVehicle.id} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DTCCodesList 
                vehicleId={selectedVehicle.id} 
                isScanning={isScanning}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PredictiveMaintenancePanel 
                vehicleId={selectedVehicle.id}
              />
            </motion.div>
          </div>

          {/* Diagnostic History Chart */}
          {!historyLoading && diagnosticHistory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <DiagnosticChart 
                data={diagnosticHistory}
                vehicleId={selectedVehicle.id}
              />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default VehicleDiagnostics;
