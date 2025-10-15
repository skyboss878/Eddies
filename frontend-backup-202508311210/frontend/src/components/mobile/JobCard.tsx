import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, MapPin, User, Car, PlayCircle, CheckCircle,
  Camera, MessageSquare, Phone
} from 'lucide-react';
import Button from '@components/ui/Button';

interface JobCardProps {
  job: any;
  isActive?: boolean;
  onStart?: () => void;
  onComplete?: (photos: File[], notes: string) => void;
  onSelect?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  isActive = false, 
  onStart, 
  onComplete, 
  onSelect 
}) => {
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'normal': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'assigned': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      layout
      className={`p-4 rounded-xl border-2 transition-all ${
        isActive 
          ? 'border-green-300 bg-green-50 shadow-lg' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900">{job.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
              {job.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600">{job.description}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`} />
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{job.customer}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Car className="h-4 w-4" />
          <span>{job.vehicle}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{job.scheduled_time} • {job.estimated_duration}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        {job.status === 'assigned' && onStart && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            size="sm"
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Start Job</span>
          </Button>
        )}
        
        {isActive && onComplete && (
          <>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                // Handle photo capture
              }}
              variant="secondary"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Camera className="h-4 w-4" />
              <span>Photo</span>
            </Button>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onComplete(photos, notes);
              }}
              variant="success"
              size="sm"
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Complete</span>
            </Button>
          </>
        )}
        
        <Button
          onClick={(e) => {
            e.stopPropagation();
            // Handle phone call
            window.open(`tel:${job.customer_phone || ''}`);
          }}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Phone className="h-4 w-4" />
        </Button>
      </div>

      {/* Notes section for active job */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <textarea
            placeholder="Add notes about the service..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            rows={3}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default JobCard;
