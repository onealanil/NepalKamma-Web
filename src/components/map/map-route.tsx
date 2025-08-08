"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import mapboxgl from "mapbox-gl";

import { useMap } from "@/contexts/map-context";
import Marker from "./map-marker";

type Coordinate = {
  latitude: number;
  longitude: number;
  id: string;
  name?: string;
};

type MapRouteProps = {
  coordinates: Coordinate[];
  showRoute?: boolean;
  routeColor?: string;
  routeWidth?: number;
};

export default function MapRoute({
  coordinates,
  showRoute = true,
  routeColor = "#ef4444",
  routeWidth = 4,
}: MapRouteProps) {
  const { map } = useMap();
  const [routeData, setRouteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch route data from Mapbox Directions API
  const fetchRoute = async (coords: Coordinate[]) => {
    if (coords.length < 2) return;

    setIsLoading(true);
    try {
      const coordinatesString = coords
        .map((coord) => `${coord.longitude},${coord.latitude}`)
        .join(";");

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch route");
      }

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        setRouteData(data.routes[0]);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add route to map
  useEffect(() => {
    if (!map || !routeData || !showRoute) return;

    const sourceId = "route-source";
    const layerId = "route-layer";

    // Remove existing route if it exists
    if (map?.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map?.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    // Add route source and layer
    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: routeData.geometry,
      },
    });

    map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": routeColor,
        "line-width": routeWidth,
        "line-opacity": 0.8,
      },
    });

    return () => {
      try {
        // Check if map exists and is not destroyed
        if (map && map.getCanvas && map.getCanvas() && map.getStyle && map.getStyle()) {
          if (map.getLayer && map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
          if (map.getSource && map.getSource(sourceId)) {
            map.removeSource(sourceId);
          }
        }
      } catch (error) {
        // Silently ignore cleanup errors when map is destroyed
        console.warn('Map cleanup error (expected during navigation):', error instanceof Error ? error.message : 'Unknown error');
      }
    };
  }, [map, routeData, showRoute, routeColor, routeWidth]);

  // Fetch route when coordinates change
  useEffect(() => {
    if (coordinates.length >= 2 && showRoute) {
      fetchRoute(coordinates);
    }
  }, [coordinates, showRoute]);

  // Fit map to show all markers
  useEffect(() => {
    if (!map || coordinates.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach((coord) => {
      bounds.extend([coord.longitude, coord.latitude]);
    });

    map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
    });
  }, [map, coordinates]);

  return (
    <>
      {coordinates.map((coord, index) => (
        <Marker
          key={coord.id}
          latitude={coord.latitude}
          longitude={coord.longitude}
          data={{ ...coord, index }}
          onClick={({ data }) => {
            console.log("Marker clicked:", data);
          }}
        >
          <div className="relative">
            <div
              className={`rounded-full flex items-center justify-center transform transition-all duration-200 shadow-lg size-10 cursor-pointer hover:scale-110 ${index === 0
                ? "bg-green-500 text-white"
                : index === coordinates.length - 1
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
                }`}
            >
              {index === 0 ? (
                <Navigation className="stroke-[2.5px] size-5" />
              ) : (
                <MapPin className="stroke-[2.5px] size-5" />
              )}
            </div>
            {coord.name && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {coord.name}
              </div>
            )}
          </div>
        </Marker>
      ))}

      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-3 py-2 rounded-lg text-sm">
          Loading route...
        </div>
      )}

      {routeData && (
        <div className="absolute top-26 left-4 right-4 lg:top-26 lg:right-4 lg:left-auto lg:w-80 z-10">
          <div className="bg-gradient-to-r from-primary to-green-600 text-white p-3 lg:p-4 rounded-lg lg:rounded-xl shadow-lg border border-white/20 backdrop-blur-sm">
            {/* Compact Header for Mobile */}
            <div className="flex items-center justify-between lg:justify-start gap-2 mb-2 lg:mb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-white" />
                <span className="font-medium text-sm lg:text-base">Route Info</span>
              </div>
              {/* Status indicator - mobile only */}
              <div className="lg:hidden flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs opacity-90">Optimal</span>
              </div>
            </div>

            {/* Compact Route Details */}
            <div className="flex items-center justify-between gap-3">
              {/* Distance */}
              <div className="flex items-center gap-2 bg-white/10 rounded-md lg:rounded-lg px-2 lg:px-3 py-1.5 lg:py-2 flex-1">
                <span className="text-xs">📍</span>
                <div className="text-left">
                  <div className="text-base lg:text-lg font-bold leading-tight">
                    {Math.round(routeData.distance / 1000)}
                  </div>
                  <div className="text-xs opacity-90 leading-tight">km</div>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 bg-white/10 rounded-md lg:rounded-lg px-2 lg:px-3 py-1.5 lg:py-2 flex-1">
                <span className="text-xs">⏱️</span>
                <div className="text-left">
                  <div className="text-base lg:text-lg font-bold leading-tight">
                    {Math.round(routeData.duration / 60)}
                  </div>
                  <div className="text-xs opacity-90 leading-tight">min</div>
                </div>
              </div>
            </div>

            {/* Desktop Additional Info */}
            <div className="hidden lg:block mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2 text-xs opacity-90">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Optimal route selected</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

