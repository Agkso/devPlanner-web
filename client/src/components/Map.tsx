import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

interface MapViewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  onMapReady?: (map: any) => void;
}

export function MapView({
  center = { lat: 37.7749, lng: -122.4194 },
  zoom = 12,
  className = "w-full h-[500px]",
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (!window.google) {
      const scriptUrl = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&libraries=places,drawing,geometry,visualization,marker`;
      
      fetch(scriptUrl, {
        method: 'GET',
        headers: { 'Origin': window.location.origin },
      })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.text();
        })
        .then(scriptContent => {
          const script = document.createElement('script');
          script.textContent = scriptContent;
          document.head.appendChild(script);
          
          const checkGoogle = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(checkGoogle);
              initMap();
            }
          }, 100);
          
          setTimeout(() => clearInterval(checkGoogle), 10000);
        })
        .catch(error => console.error('Failed to fetch Google Maps script:', error));
    } else {
      initMap();
    }

    function initMap() {
      if (!mapContainer.current || !window.google || map.current) return;

      map.current = new window.google.maps.Map(mapContainer.current, {
        zoom,
        center,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: true,
        mapId: 'DEMO_MAP_ID',
      });
      
      if (onMapReady) {
        onMapReady(map.current);
      }
    }
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.setCenter(center);
      map.current.setZoom(zoom);
    }
  }, [center, zoom]);

  return <div ref={mapContainer} className={className} />;
}

