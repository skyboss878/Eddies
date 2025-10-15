import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, QrCode, Camera, CheckSquare, MessageSquare, MapPin,
  Clock, Wrench, AlertCircle, Battery, Wifi, Navigation, Timer,
  PlayCircle, PauseCircle, Square, Upload, Phone, User
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Components
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import QRScanner from '@components/ui/QRScanner';
import PhotoCapture from '@components/ui/PhotoCapture';
import JobCard from './JobCard';
import TimeTracker from './TimeTracker';

// Services
import { mobileService } from '@services/mobileService';

const MobileTechApp: React.FC = () => {
  const [activeJob, setActiveJob] = useState<any>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get technician's assigned jobs
  const { data: assignedJobs, isLoading } = useQuery({
    queryKey: ['technician-jobs'],
    queryFn: mobileService.getAssignedJobs,
    refetchInterval: 30000,
  });

  const { data: technicianProfile } = useQuery({
    queryKey: ['technician-profile'],
    queryFn: mobileService.getTechnicianProfile,
  });

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => setCurrentLocation(position),
        (error) => console.log('Location access denied:', error),
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleQRScan = async (data: string) => {
    try {
      const job = await mobileService.getJobDetails(data);
      setActiveJob(job);
      setIsQRScannerOpen(false);
      toast.success('🎯 Job loaded successfully!');
    } catch (error) {
      toast.error('❌ Invalid QR code');
    }
  };

  const startJobMutation = useMutation({
    mutationFn: ({ jobId, location }: { jobId: string; location: GeolocationPosition | null }) =>
      mobileService.startJob(jobId, location),
    onSuccess: () => {
      toast.success('⏱️ Job started - timer running');
    },
  });

  const completeJobMutation = useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: any }) =>
      mobileService.completeJob(jobId, data),
    onSuccess: () => {
      toast.success('✅ Job completed successfully!');
      setActiveJob(null);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-b-2xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">📱 Mobile Tech</h1>
              <p className="text-blue-100 text-sm">Field Excellence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm">
              <Wifi className="h-4 w-4" />
              <Battery className="h-4 w-4" />
            </div>
            <div className="text-right text-xs">
              <div>{currentTime.toLocaleDateString()}</div>
              <div className="font-mono">{currentTime.toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Technician Info */}
        <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{technicianProfile?.name || 'Technician'}</p>
              <p className="text-blue-200 text-sm">ID: {technicianProfile?.id || 'T001'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">Jobs Today</p>
            <p className="text-2xl font-bold">{assignedJobs?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setIsQRScannerOpen(true)}
                  className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <QrCode className="h-8 w-8" />
                  <span className="text-sm font-medium">Scan Job QR</span>
                </Button>

                <Button
                  onClick={() => setIsPhotoMode(true)}
                  variant="secondary"
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                >
                  <Camera className="h-8 w-8" />
                  <span className="text-sm font-medium">Take Photos</span>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Active Job */}
        <AnimatePresence>
          {activeJob && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-800">🚀 Active Job</h3>
                <div className="flex items-center space-x-2">
                  <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse" />
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    In Progress
                  </span>
                </div>
              </div>
              
              <JobCard 
                job={activeJob} 
                isActive={true}
                onComplete={(photos, notes) => 
                  completeJobMutation.mutate({
                    jobId: activeJob.id,
                    data: { photos, notes, location: currentLocation }
                  })
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Time Tracker */}
        {activeJob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TimeTracker activeJobId={activeJob.id} />
          </motion.div>
        )}

        {/* Today's Jobs */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Today's Jobs</h2>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {assignedJobs?.length || 0} jobs
              </span>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading jobs...</p>
              </div>
            ) : assignedJobs?.length ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {assignedJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <JobCard 
                        job={job}
                        onStart={() => 
                          startJobMutation.mutate({
                            jobId: job.id,
                            location: currentLocation
                          })
                        }
                        onSelect={() => setActiveJob(job)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Wrench className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">No jobs assigned</p>
                <p className="text-sm">Check back later or contact dispatch</p>
              </div>
            )}
          </div>
        </Card>

        {/* Location & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Status */}
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Location Services</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentLocation 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentLocation ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {currentLocation ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Lat: {currentLocation.coords.latitude.toFixed(6)}</p>
                  <p>Lng: {currentLocation.coords.longitude.toFixed(6)}</p>
                  <p className="text-xs text-gray-500">
                    Accuracy: ±{currentLocation.coords.accuracy?.toFixed(0)}m
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Location not available</p>
              )}
            </div>
          </Card>

          {/* Performance Stats */}
          <Card>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Timer className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Today's Stats</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jobs Completed:</span>
                  <span className="font-medium">{technicianProfile?.jobsCompleted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hours Logged:</span>
                  <span className="font-medium">{technicianProfile?.hoursLogged || '0.0'}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efficiency:</span>
                  <span className="font-medium text-green-600">{technicianProfile?.efficiency || 85}%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isQRScannerOpen && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setIsQRScannerOpen(false)}
          />
        )}

        {isPhotoMode && (
          <PhotoCapture
            onCapture={(photos) => {
              setIsPhotoMode(false);
              toast.success(`📸 Captured ${photos.length} photos`);
            }}
            onClose={() => setIsPhotoMode(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileTechApp;
