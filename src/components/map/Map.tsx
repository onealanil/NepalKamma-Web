'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox token (store this in environment variables)
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

interface MapProps {
    className?: string;
}

const Map: React.FC<MapProps> = ({ className = '' }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState<number>(87.2718);
    const [lat, setLat] = useState<number>(26.6646);
    const [zoom, setZoom] = useState<number>(10);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on('move', () => {
            if (!map.current) return;

            setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
            setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
            setZoom(parseFloat(map.current.getZoom().toFixed(2)));
        });

        return () => {
            map.current?.remove();
        };
    }, [lat, lng, zoom]);

    return (
        <div className={`relative ${className}`}>
            <div
                className="absolute top-3 left-3 z-10 bg-[rgba(35,55,75,0.9)] text-white p-1.5 px-3 font-mono text-sm rounded"
                style={{ fontFamily: 'monospace' }}
            >
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div
                ref={mapContainer}
                className="w-full h-[400px]"
            />
        </div>
    );
};

export default Map;