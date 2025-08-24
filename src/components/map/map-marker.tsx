"use client";
import mapboxgl, { MarkerOptions } from "mapbox-gl";
import React, { useEffect, useRef } from "react";
import { useMap } from "@/contexts/map-context";

// Add a coordinate type that matches what you're actually using
type CoordinateWithIndex = {
  latitude: number;
  longitude: number;
  id: string;
  name?: string;
  index: number;
};

type Props = {
  longitude: number;
  latitude: number;
  data: CoordinateWithIndex;
  onHover?: ({
    isHovered,
    position,
    marker,
    data,
  }: {
    isHovered: boolean;
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: CoordinateWithIndex; // Updated callback type too
  }) => void;
  onClick?: ({
    position,
    marker,
    data,
  }: {
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: CoordinateWithIndex; // Updated callback type too
  }) => void;
  children?: React.ReactNode;
} & MarkerOptions;

export default function Marker({
  children,
  latitude,
  longitude,
  data,
  onHover,
  onClick,
  ...props
}: Props) {
  const { map } = useMap();
  const markerRef = useRef<HTMLDivElement | null>(null);
  const markerInstanceRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    const markerEl = markerRef.current;
    if (!map || !markerEl) return;

    const handleHover = (isHovered: boolean) => {
      if (onHover && markerInstanceRef.current) {
        onHover({
          isHovered,
          position: { longitude, latitude },
          marker: markerInstanceRef.current,
          data,
        });
      }
    };

    const handleClick = () => {
      if (onClick && markerInstanceRef.current) {
        onClick({
          position: { longitude, latitude },
          marker: markerInstanceRef.current,
          data,
        });
      }
    };

    // Check if map is loaded and has a canvas container
    if (!map.getCanvasContainer()) {
      // If map is not ready, wait for it to load
      const onMapLoad = () => {
        createMarker();
      };
      if (map.loaded()) {
        createMarker();
      } else {
        map.on('load', onMapLoad);
        return () => {
          map.off('load', onMapLoad);
        };
      }
    } else {
      createMarker();
    }

    function createMarker() {
      if (!map || !markerEl) return;

      const handleMouseEnter = () => handleHover(true);
      const handleMouseLeave = () => handleHover(false);

      // Add event listeners
      markerEl.addEventListener("mouseenter", handleMouseEnter);
      markerEl.addEventListener("mouseleave", handleMouseLeave);
      markerEl.addEventListener("click", handleClick);

      // Marker options
      const options = {
        element: markerEl,
        ...props,
      };

      try {
        markerInstanceRef.current = new mapboxgl.Marker(options)
          .setLngLat([longitude, latitude])
          .addTo(map);
      } catch (error) {
        console.error('Error adding marker to map:', error);
      }
    }

    return () => {
      // Cleanup on unmount
      if (markerInstanceRef.current) {
        try {
          markerInstanceRef.current.remove();
          markerInstanceRef.current = null;
        } catch (error) {
          console.error('Error removing marker:', error);
        }
      }
      if (markerEl) {
        markerEl.removeEventListener("mouseenter", () => handleHover(true));
        markerEl.removeEventListener("mouseleave", () => handleHover(false));
        markerEl.removeEventListener("click", handleClick);
      }
    };
  }, [map, longitude, latitude, data, onHover, onClick, props]);

  return (
    <div>
      <div ref={markerRef}>{children}</div>
    </div>
  );
}