import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

const CameraSwitchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662s.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.21.138-2.43.138-3.662z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      // Check for multiple cameras once when the modal opens
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoInputs = devices.filter(device => device.kind === 'videoinput');
          setHasMultipleCameras(videoInputs.length > 1);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      
      // Stop any existing stream before starting a new one
      stopStream();

      if (!window.isSecureContext) {
        setError("Camera access requires a secure connection (HTTPS).");
        return;
      }

      navigator.mediaDevices.getUserMedia({ video: { facingMode } })
        .then(mediaStream => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch(err => {
          console.error("Camera access error:", err);
          let message = "Could not access camera. Please check permissions and try again.";
          if (err instanceof DOMException && err.name === 'NotAllowedError') {
            message = "Camera access was denied. Please enable it in your browser settings.";
          }
          setError(message);
        });
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode, stopStream]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `snap-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
          }
        }, 'image/jpeg');
      }
    }
    onClose();
  };

  const handleSwitchCamera = () => {
    setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4 font-['Playfair_Display']">Snap a Picture</h2>
        <div className="relative bg-stone-900 rounded-lg overflow-hidden mb-4 aspect-video flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-auto" muted />
          <canvas ref={canvasRef} className="hidden" />
          {error && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
              <p className="text-white">{error}</p>
            </div>
          )}
           {hasMultipleCameras && !error && (
            <button
              onClick={handleSwitchCamera}
              className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
              aria-label="Switch camera"
            >
              <CameraSwitchIcon className="h-6 w-6" />
            </button>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-semibold text-stone-700 bg-stone-200 rounded-lg hover:bg-stone-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400"
          >
            Cancel
          </button>
          <button
            onClick={handleCapture}
            disabled={!!error || !stream}
            className="px-6 py-2 font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-stone-400"
          >
            Snap
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;