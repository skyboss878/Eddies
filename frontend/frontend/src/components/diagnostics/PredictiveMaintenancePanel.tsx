import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Calendar, Wrench } from 'lucide-react';
import Card from '@components/ui/Card';

interface PredictiveMaintenancePanelProps {
  vehicleId: string;
}

const PredictiveMaintenancePanel: React.FC<PredictiveMaintenancePanelProps> = () => {
  const predictions = [
    {
      component: 'Brake Pads',
      prediction: 'Replace in 2-3 months',
      confidence: 87,
      urgency: 'medium',
      mileage: '~5,000 miles'
    },
    {
      component: 'Air Filter',
      prediction: 'Replace in 1 month',
      confidence: 94,
      urgency: 'high',
      mileage: '~2,000 miles'
    },
    {
      component: 'Transmission Fluid',
      prediction: 'Service in 6 months',
      confidence: 76,
      urgency: 'low',
      mileage: '~12,000 miles'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Brain className="mr-2 h-5 w-5 text-purple-500" />
          AI Predictive Maintenance
        </h3>
        
        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <motion.div
              key={prediction.component}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${getUrgencyColor(prediction.urgency)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{prediction.component}</h4>
                  <p className="text-sm opacity-75">{prediction.prediction}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{prediction.confidence}%</div>
                  <div className="text-xs opacity-75">confidence</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{prediction.mileage}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>AI Analysis</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 text-blue-800">
            <Wrench className="h-4 w-4" />
            <span className="font-medium">Maintenance Recommendations</span>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Based on driving patterns, vehicle age, and diagnostic data, our AI recommends scheduling the high-priority items within the next month.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PredictiveMaintenancePanel;
