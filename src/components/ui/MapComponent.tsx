import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  address: string;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  address, 
  className = "w-full h-64 rounded-lg" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Company coordinates for The Avenue Blok Z.6, Citra Raya, Tangerang
  const coordinates = {
    lat: -6.2441,
    lng: 106.6062
  };

  useEffect(() => {
    // Simple fallback map using OpenStreetMap
    if (mapRef.current) {
      // For now, we'll show a static map placeholder
      // In production, you would integrate with Google Maps or Leaflet
      const mapContainer = mapRef.current;
      mapContainer.innerHTML = `
        <div class="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800"></div>
          <div class="relative z-10 text-center p-6">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">PT. Emran Ghanim Asahi</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 max-w-xs mx-auto">${address}</p>
            <button 
              onclick="window.open('https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}', '_blank')"
              class="mt-4 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
              </svg>
              Buka di Google Maps
            </button>
          </div>
        </div>
      `;
    }
  }, [address, coordinates]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapComponent;
