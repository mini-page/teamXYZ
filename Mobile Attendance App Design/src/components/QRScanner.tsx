import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Camera, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Zap,
  AlertCircle 
} from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (qrData: string) => void;
  onBack: () => void;
}

type ScanState = 'scanning' | 'success' | 'error' | 'expired';

export function QRScanner({ onScanSuccess, onBack }: QRScannerProps) {
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [scanMessage, setScanMessage] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate QR scanning for demo purposes
  const simulateScan = () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setScanState('scanning');
    
    // Simulate scanning delay
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.3) {
        // Success case (70% chance)
        setScanState('success');
        setScanMessage('Attendance marked at ' + new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }));
        
        // Trigger confetti effect and navigate back
        setTimeout(() => {
          onScanSuccess('mock-qr-data');
        }, 2000);
      } else if (random > 0.15) {
        // Error case (15% chance)
        setScanState('error');
        setScanMessage('Failed to scan QR code. Please try again.');
        setTimeout(() => {
          setScanState('scanning');
          setIsSimulating(false);
        }, 2000);
      } else {
        // Expired case (15% chance)
        setScanState('expired');
        setScanMessage('QR code has expired. Ask your teacher to generate a new one.');
        setTimeout(() => {
          setScanState('scanning');
          setIsSimulating(false);
        }, 3000);
      }
    }, 1500);
  };

  const renderScanContent = () => {
    switch (scanState) {
      case 'success':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-green-800 mb-2">Success!</h2>
            <p className="text-green-600">{scanMessage}</p>
            <div className="mt-6">
              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-shake">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-semibold text-red-800 mb-2">Scan Failed</h2>
            <p className="text-red-600">{scanMessage}</p>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-amber-600" />
            </div>
            <h2 className="text-2xl font-semibold text-amber-800 mb-2">QR Expired</h2>
            <p className="text-amber-600">{scanMessage}</p>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="relative">
              {/* Camera viewfinder */}
              <div className="w-64 h-64 bg-gray-900 rounded-2xl mx-auto mb-6 relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-white/50 rounded-xl">
                  {/* Scanning frame corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-lg"></div>
                  
                  {/* Scanning line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent shadow-lg shadow-accent/50 animate-pulse"></div>
                </div>
                
                {/* Camera icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-white/30" />
                </div>
                
                {/* Scanning animation */}
                {isSimulating && (
                  <div className="absolute inset-0 bg-accent/20 animate-pulse"></div>
                )}
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isSimulating ? 'Scanning...' : 'Position QR Code in Frame'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isSimulating ? 'Processing QR code' : 'Align the QR code within the scanning area'}
            </p>
            
            <Button
              onClick={simulateScan}
              disabled={isSimulating}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-8"
            >
              <Zap className="w-5 h-5 mr-2" />
              {isSimulating ? 'Scanning...' : 'Tap to Scan'}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-white font-semibold">Scan QR Code</h1>
            <div></div>
          </div>
        </div>
      </div>

      {/* Scanner Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-sm bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8">
            {renderScanContent()}
            
            {scanState === 'scanning' && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                  <span>Make sure the QR code is clearly visible</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Flash effect for successful scan */}
      {scanState === 'success' && (
        <div className="absolute inset-0 bg-green-400/20 animate-pulse"></div>
      )}
    </div>
  );
}