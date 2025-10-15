import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, QrCode } from 'lucide-react';
import Button from './Button';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleManualInput = () => {
    const code = prompt('Enter QR code manually:');
    if (code) {
      onScan(code);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black text-white">
        <h2 className="text-lg font-semibold flex items-center">
          <QrCode className="mr-2 h-5 w-5" />
          Scan QR Code
        </h2>
        <Button onClick={onClose} variant="ghost" size="sm">
          <X className="h-5 w-5" />
        </Button>
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
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-64 h-64 border-2 border-white border-opacity-50 rounded-lg">
              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
              
              {/* Scanning line */}
              <motion.div
                animate={{ y: [0, 240, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 shadow-lg"
              />
            </div>
            
            <p className="text-white text-center mt-4">
              Position QR code within the frame
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-black">
        <Button
          onClick={handleManualInput}
          variant="secondary"
          className="w-full"
        >
          Enter Code Manually
        </Button>
      </div>
    </motion.div>
  );
};

export default QRScanner;
