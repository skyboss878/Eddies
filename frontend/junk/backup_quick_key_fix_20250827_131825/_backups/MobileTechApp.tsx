import React, { useState, useEffect } from 'react'
import { Smartphone, QrCode, Camera, Wrench, Timer, User, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const MobileTechApp: React.FC = () => {
  const [activeJob, setActiveJob] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleQRScan = () => {
    alert('🎯 QR Scanner activated!')
  }

  const handlePhotoCapture = () => {
    alert('📸 Photo capture ready!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-b-xl relative">
        <Link 
          to="/dashboard" 
          className="absolute top-4 left-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        
        <div className="flex items-center justify-between mb-4 pt-8">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">📱 Mobile Tech</h1>
              <p className="text-blue-100 text-sm">Field Excellence</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <div>{currentTime.toLocaleDateString()}</div>
            <div className="font-mono">{currentTime.toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Technician</p>
              <p className="text-blue-200 text-sm">ID: T001</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">Jobs Today</p>
            <p className="text-2xl font-bold">5</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleQRScan}
              className="h-24 flex flex-col items-center justify-center space-y-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <QrCode className="h-8 w-8" />
              <span className="text-sm font-medium">Scan Job QR</span>
            </button>

            <button
              onClick={handlePhotoCapture}
              className="h-24 flex flex-col items-center justify-center space-y-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Camera className="h-8 w-8" />
              <span className="text-sm font-medium">Take Photos</span>
            </button>
          </div>
        </div>

        {/* Today's Jobs */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Today's Jobs</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Oil Change - Honda Civic</h3>
                <p className="text-sm text-gray-600">Customer: John Smith</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                In Progress
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Brake Inspection - Toyota Camry</h3>
                <p className="text-sm text-gray-600">Customer: Sarah Wilson</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Pending
              </span>
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2 mb-3">
            <Timer className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Today's Stats</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Jobs Completed:</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hours Logged:</span>
              <span className="font-medium">6.5h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Efficiency:</span>
              <span className="font-medium text-green-600">92%</span>
            </div>
          </div>
        </div>

        {/* Navigation back */}
        <div className="text-center pt-4">
          <Link 
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MobileTechApp
