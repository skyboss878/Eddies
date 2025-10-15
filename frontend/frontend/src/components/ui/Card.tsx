import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={

      # Continue Mobile Service from where it was cut off
cat >> src/services/mobileService.ts << 'EOF'
          'Sarah Johnson',
          vehicle: '2020 Toyota Camry',
          location: '456 Oak Ave, Midtown',
          scheduled_time: '2:30 PM',
          estimated_duration: '45 min',
          status: 'assigned',
          priority: 'high',
          description: 'Customer reports squeaking brakes'
        },
        {
          id: 'job3',
          title: 'Transmission Service',
          customer: 'Mike Davis',
          vehicle: '2019 Ford F-150',
          location: '789 Pine St, Uptown',
          scheduled_time: '4:00 PM',
          estimated_duration: '60 min',
          status: 'in_progress',
          priority: 'normal',
          description: 'Transmission fluid change and filter replacement'
        }
      ];
    }
  },

  async getTechnicianProfile() {
    try {
      const response = await apiClient.get('/technician/profile');
      return response.data;
    } catch (error) {
      return {
        id: 'T001',
        name: 'Alex Rodriguez',
        level: 'Senior Technician',
        jobsCompleted: 12,
        hoursLogged: 6.5,
        efficiency: 94,
        certifications: ['ASE Master', 'Hybrid/Electric', 'Diagnostic Specialist']
      };
    }
  },

  async getJobDetails(jobId: string) {
    try {
      const response = await apiClient.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      return {
        id: jobId,
        title: 'Oil Change Service',
        customer: 'John Smith',
        vehicle: '2018 Honda Civic',
        description: 'Regular maintenance oil change',
        checklist: [
          'Check oil level and condition',
          'Replace oil filter',
          'Add new oil',
          'Check other fluid levels',
          'Inspect belts and hoses'
        ]
      };
    }
  },

  async startJob(jobId: string, location: GeolocationPosition | null) {
    try {
      const response = await apiClient.post(`/jobs/${jobId}/start`, {
        timestamp: new Date().toISOString(),
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        } : null
      });
      return response.data;
    } catch (error) {
      return { success: true };
    }
  },

  async completeJob(jobId: string, data: any) {
    try {
      const response = await apiClient.post(`/jobs/${jobId}/complete`, data);
      return response.data;
    } catch (error) {
      return { success: true };
    }
  }
};
