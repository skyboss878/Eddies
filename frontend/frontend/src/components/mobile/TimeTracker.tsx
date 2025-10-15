import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, PauseCircle, StopCircle, Clock } from 'lucide-react';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';

interface TimeTrackerProps {
  activeJobId: string;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ activeJobId }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Time Tracker</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        </div>
        
        <div className="text-center mb-6">
          <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
            {formatTime(elapsed)}
          </div>
          <div className="text-sm text-gray-600">
            {isRunning ? 'Timer running' : 'Timer paused'}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            variant={isRunning ? "warning" : "success"}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            {isRunning ? (
              <>
                <PauseCircle className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                <span>Resume</span>
              </>
            )}
          </Button>
          
          <Button
            onClick={() => {
              setIsRunning(false);
              setElapsed(0);
            }}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <StopCircle className="h-4 w-4" />
            <span>Stop</span>
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Started:</span>
            <span className="font-medium">{new Date(startTime).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TimeTracker;
