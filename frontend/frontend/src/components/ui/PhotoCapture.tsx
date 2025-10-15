import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Check, RotateCw } from 'lucide-react';
import Button from './Button';

interface PhotoCaptureProps {
  onCapture: (photos: File[]) => void;
  onClose: () => void;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  React.useEffect(() => {
    startCamera();
    
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhotos(prev => [...prev, dataUrl]);
      }
    }
  };

  const handleSave = () => {
    const files = photos.map((dataUrl, index) => {
      const byteCharacters = atob(dataUrl.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new File([byteArray], `photo-${index + 1}.jpg`, { type: 'image/jpeg' });
    });
    
    onCapture(files);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black text-white">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Capture Photos
          </h2>
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
            {photos.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
            variant="ghost"
            size="sm"
          >
            <RotateCw className="h-5 w-5" />
          </Button>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Photo thumbnails */}
        {photos.length > 0 && (
          <div className="absolute top-4 right-4 space-y-2">
            {photos.slice(-3).map((photo, index) => (
              <motion.img
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                src={photo}
                className="w-16 h-16 object-cover rounded-lg border-2 border-white"
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-black flex items-center justify-center space-x-6">
        {photos.length > 0 && (
          <Button onClick={handleSave} variant="success" className="flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>Save {photos.length} Photos</span>
          </Button>
        )}
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={capturePhoto}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <div className="w-16 h-16 border-4 border-gray-300 rounded-full flex items-center justify-center">
            <Camera className="h-8 w-8 text-gray-600" />
          </div>
        </motion.button>
        
        <div className="w-16" /> {/* Spacer for centering */}
      </div>
    </motion.div>
  );
};

export default PhotoCapture;
