
"use client";

import mapboxgl, { MarkerOptions } from "mapbox-gl";
import React, { useEffect, useRef } from "react";

import { useMap } from "@/contexts/map-context";
import { LocationFeature } from "@/lib/mapbox/utils";

type Props = {
  longitude: number;
  latitude: number;
  data: any;
  onHover?: ({
    isHovered,
    position,
    marker,
    data,
  }: {
    isHovered: boolean;
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  onClick?: ({
    position,
    marker,
    data,
  }: {
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
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
  let marker: mapboxgl.Marker | null = null;

  const handleHover = (isHovered: boolean) => {
    if (onHover && marker) {
      onHover({
        isHovered,
        position: { longitude, latitude },
        marker,
        data,
      });
    }
  };

  const handleClick = () => {
    if (onClick && marker) {
      onClick({
        position: { longitude, latitude },
        marker,
        data,
      });
    }
  };

  useEffect(() => {
    const markerEl = markerRef.current;
    if (!map || !markerEl) return;

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
        marker = new mapboxgl.Marker(options)
          .setLngLat([longitude, latitude])
          .addTo(map);
      } catch (error) {
        console.error('Error adding marker to map:', error);
      }
    }

    return () => {
      // Cleanup on unmount
      if (marker) {
        try {
          marker.remove();
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
  }, [map, longitude, latitude, props]);

  return (
    <div>
      <div ref={markerRef}>{children}</div>
    </div>
  );
}
