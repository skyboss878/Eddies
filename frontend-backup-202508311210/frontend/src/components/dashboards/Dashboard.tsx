import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, Users, Wrench, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle, Clock, BarChart3, Calendar, Zap, Target,
  Activity, Gauge, Trophy, ArrowUp, ArrowDown
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Components
import Card from '@components/ui/Card';
import StatsCard from '@components/ui/StatsCard';
import Button from '@components/ui/Button';
import RevenueChart from '@components/charts/RevenueChart';
import ActivityFeed from '@components/ui/ActivityFeed';
import QuickActions from '@components/ui/QuickActions';

// Services
import { dashboardService } from '@services/dashboardService';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: dashboardService.getRecentActivity,
    refetchInterval: 10000,
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: dashboardService.getRevenueData,
  });

  return (
    <div className="space-y-6 p-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold mb-3"
            >
              💎 Billion-Dollar Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-blue-100 text-lg"
            >
              World-class auto repair management with AI diagnostics
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center mt-4 space-x-6"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">System Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span className="text-sm">Real-time Active</span>
              </div>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center space-x-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Trophy className="h-12 w-12 mb-2 text-yellow-300" />
              <p className="text-sm text-blue-100">Today's Goal</p>
              <p className="text-3xl font-bold">${stats?.dailyGoal || '5,000'}</p>
            </div>
          </motion.div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl" />
      </motion.div>

      {/* Stats Overview with enhanced animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsCard
            title="Active Jobs"
            value={stats?.activeJobs || 0}
            change={stats?.activeJobsChange || 0}
            icon={Wrench}
            color="blue"
            isLoading={statsLoading}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard
            title="Today's Revenue"
            value={`$${(stats?.todayRevenue || 0).toLocaleString()}`}
            change={stats?.revenueChange || 0}
            icon={DollarSign}
            color="green"
            isLoading={statsLoading}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatsCard
            title="Customer Satisfaction"
            value={`${stats?.customerSatisfaction || 0}%`}
            change={stats?.satisfactionChange || 0}
            icon={Users}
            color="purple"
            isLoading={statsLoading}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatsCard
            title="Vehicles Serviced"
            value={stats?.vehiclesServiced || 0}
            change={stats?.vehiclesChange || 0}
            icon={Car}
            color="orange"
            isLoading={statsLoading}
          />
        </motion.div>
      </div>

      {/* Quick Actions with enhanced UI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <QuickActions />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <BarChart3 className="mr-3 h-6 w-6 text-blue-600" />
                  Revenue Analytics
                </h2>
                <div className="flex space-x-2">
                  {['7D', '30D', '90D'].map((period, index) => (
                    <Button
                      key={period}
                      variant={index === 0 ? 'primary' : 'outline'}
                      size="sm"
                      className="px-4 py-2"
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
              <RevenueChart data={revenueData} />
            </div>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="h-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Activity className="mr-3 h-6 w-6 text-green-600" />
                Live Activity
              </h2>
              <ActivityFeed activities={recentActivity} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Grid - Enhanced Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                AI Insights
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Revenue up 15%</p>
                    <p className="text-xs text-green-600">Compared to last month</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">3 follow-ups needed</p>
                    <p className="text-xs text-blue-600">Maintenance reminders</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-800">Low inventory alert</p>
                    <p className="text-xs text-orange-600">5 parts need reordering</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Today's Schedule
              </h3>
              <div className="space-y-3">
                {(stats?.todayAppointments || []).slice(0, 4).map((appointment, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{appointment.customer}</p>
                      <p className="text-xs text-gray-600">{appointment.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{appointment.time}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
                
                {(!stats?.todayAppointments || stats.todayAppointments.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No appointments scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="mr-2 h-5 w-5 text-purple-500" />
                Performance
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Customer Satisfaction', value: stats?.customerSatisfaction || 0, color: 'purple' },
                  { label: 'Daily Goal Progress', value: stats?.goalProgress || 0, color: 'green' },
                  { label: 'Technician Efficiency', value: stats?.techEfficiency || 0, color: 'blue' }
                ].map((metric, index) => (
                  <motion.div 
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{metric.label}</span>
                      <span className="font-semibold">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 1, ease: "easeOut" }}
                        className={`h-3 rounded-full ${
                          metric.color === 'purple' ? 'bg-purple-600' :
                          metric.color === 'green' ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
