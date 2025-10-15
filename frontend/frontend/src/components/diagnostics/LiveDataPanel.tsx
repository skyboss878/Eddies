import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Gauge, Thermometer, Zap } from 'lucide-react';
import Card from '@components/ui/Card';

interface LiveDataPanelProps {
  data: any;
  vehicleId: string;
}

const LiveDataPanel: React.FC<LiveDataPanelProps> = ({ data }) => {
  const metrics = [
    { 
      label: 'RPM', 
      value: data.rpm || 0, 
      unit: 'rpm', 
      icon: Activity, 
      color: 'blue',
      min: 0, 
      max: 6000 
    },
    { 
      label: 'Speed', 
      value: data.speed || 0, 
      unit: 'mph', 
      icon: Gauge, 
      color: 'green',
      min: 0, 
      max: 120 
    },
    { 
      label: 'Coolant Temp', 
      value: data.coolant_temp || 0, 
      unit: '°C', 
      icon: Thermometer, 
      color: 'red',
      min: 60, 
      max: 120 
    },
    { 
      label: 'Engine Load', 
      value: data.engine_load || 0, 
      unit: '%', 
      icon: Zap, 
      color: 'purple',
      min: 0, 
      max: 100 
    },
  ];

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-green-500" />
          Live Engine Data
          <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                metric.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                metric.color === 'green' ? 'bg-green-100 text-green-600' :
                metric.color === 'red' ? 'bg-red-100 text-red-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                <metric.icon className="h-8 w-8" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {metric.label} ({metric.unit})
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-2 rounded-full ${
                    metric.color === 'blue' ? 'bg-blue-600' :
                    metric.color === 'green' ? 'bg-green-600' :
                    metric.color === 'red' ? 'bg-red-600' :
                    'bg-purple-600'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LiveDataPanel;
