"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { MapContext } from "@/contexts/map-context";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

type MapComponentProps = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  children?: React.ReactNode;
};

export default function MapProvider({
  mapContainerRef,
  initialViewState,
  children,
}: MapComponentProps) {
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || map.current) return;

    // Check if Mapbox token is available
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      setError('Mapbox access token is not configured');
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/standard",
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        attributionControl: false,
        logoPosition: "bottom-right",
      });

      map.current.on("load", () => {
        setLoaded(true);
        setError(null);
      });

      map.current.on("error", (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map');
        setLoaded(false);
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setLoaded(false);
      }
    };
  }, [initialViewState, mapContainerRef]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-[1000]">
        <div className="text-center p-6">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <div className="text-lg font-medium text-red-600 mb-2">Map Error</div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="z-[1000]">
      <MapContext.Provider value={{ map: map.current! }}>
        {/* Only render children when map is loaded */}
        {loaded && children}
      </MapContext.Provider>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-[1000]">
          <div className="text-lg font-medium">Loading map...</div>
        </div>
      )}
    </div>
  );
}
