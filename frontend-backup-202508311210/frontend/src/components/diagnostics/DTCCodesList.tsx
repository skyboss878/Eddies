import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Card from '@components/ui/Card';
import LoadingSpinner from '@components/ui/LoadingSpinner';

interface DTCCodesListProps {
  vehicleId: string;
  isScanning: boolean;
}

const DTCCodesList: React.FC<DTCCodesListProps> = ({ vehicleId, isScanning }) => {
  const mockCodes = [
    {
      code: 'P0301',
      description: 'Cylinder 1 Misfire Detected',
      severity: 'medium',
      status: 'active'
    },
    {
      code: 'P0171',
      description: 'System Too Lean (Bank 1)',
      severity: 'low',
      status: 'pending'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return AlertTriangle;
      case 'low': return Info;
      default: return CheckCircle;
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
          Diagnostic Trouble Codes
        </h3>
        
        {isScanning ? (
          <div className="text-center py-8">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-gray-600">Scanning for trouble codes...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mockCodes.map((code, index) => {
              const IconComponent = getSeverityIcon(code.severity);
              return (
                <motion.div
                  key={code.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(code.severity)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{code.code}</h4>
                        <p className="text-sm text-gray-600 mt-1">{code.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      code.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {code.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DTCCodesList;
