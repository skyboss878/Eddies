import React from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Wrench, DollarSign, TrendingUp, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/dashboard/stats');
      return response.data;
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">💎 Billion-Dollar Dashboard</h1>
        <p className="text-blue-100">World-class auto repair management</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Active Jobs', value: stats?.activeJobs || 0, icon: Wrench, color: 'blue' },
          { title: "Today's Revenue", value: `$${stats?.todayRevenue || 0}`, icon: DollarSign, color: 'green' },
          { title: 'Customer Satisfaction', value: `${stats?.customerSatisfaction || 0}%`, icon: Users, color: 'purple' },
          { title: 'Vehicles Serviced', value: stats?.vehiclesServiced || 0, icon: Car, color: 'orange' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {stats?.todayAppointments?.map((appointment: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{appointment.customer}</p>
                  <p className="text-sm text-gray-600">{appointment.service}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{appointment.time}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Daily Goal Progress</span>
                <span>{stats?.goalProgress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats?.goalProgress || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Technician Efficiency</span>
                <span>{stats?.techEfficiency || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats?.techEfficiency || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
