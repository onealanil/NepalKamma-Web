
"use client";

import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import MapProvider from "@/lib/mapbox/provider";
import MapStyles from "@/components/map/map-styles";
import MapCotrols from "@/components/map/map-controls";
import MapRoute from "@/components/map/map-route";
import { useAuthStore } from "@/store/authStore";
import LeftSideSeeker from "@/components/ui/LeftSideSeeker";
import { useRouter } from "next/navigation";

export default function Home() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuthStore();

    // Get coordinates from URL parameters or user profile
    const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number; zoom: number } | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<Array<{
        id: string;
        latitude: number;
        longitude: number;
        name: string;
    }>>([]);

    useEffect(() => {
        // Get user coordinates
        const userLat = user?.address?.coordinates?.[1];
        const userLng = user?.address?.coordinates?.[0];

        // Get job coordinates from URL parameters
        const urlLat = searchParams.get('lat');
        const urlLng = searchParams.get('lng');

        if (urlLat && urlLng && userLat && userLng) {
            // Both user and job coordinates available - create route
            const jobLat = parseFloat(urlLat);
            const jobLng = parseFloat(urlLng);

            if (!isNaN(jobLat) && !isNaN(jobLng)) {
                // Set map center to midpoint between user and job
                const centerLat = (userLat + jobLat) / 2;
                const centerLng = (userLng + jobLng) / 2;

                setMapCenter({ latitude: centerLat, longitude: centerLng, zoom: 12 });

                // Set route coordinates
                setRouteCoordinates([
                    {
                        id: "user-location",
                        latitude: userLat,
                        longitude: userLng,
                        name: "Your Location"
                    },
                    {
                        id: "job-location",
                        latitude: jobLat,
                        longitude: jobLng,
                        name: "Job Location"
                    }
                ]);
                return;
            }
        }

        // Fallback to user's location only
        if (userLat && userLng) {
            setMapCenter({ latitude: userLat, longitude: userLng, zoom: 10 });
            setRouteCoordinates([]);
        }
    }, [searchParams, user]);

    // Handle missing coordinates
    if (!mapCenter) {
        const hasJobCoords = searchParams.get('lat') && searchParams.get('lng');
        const hasUserCoords = user?.address?.coordinates?.[1] && user?.address?.coordinates?.[0];

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="hidden lg:block lg:col-span-3">
                            <LeftSideSeeker />
                        </div>
                        <div className="lg:col-span-9 py-6">
                            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                <div className="text-4xl mb-4">📍</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {!hasUserCoords ? 'Your Location Required' : 'Loading Map...'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {!hasUserCoords
                                        ? 'Please update your profile with your location to see routes and maps.'
                                        : hasJobCoords
                                            ? 'Loading route to job location...'
                                            : 'Loading your area map...'
                                    }
                                </p>
                                {!hasUserCoords && (
                                    <button
                                        onClick={() => router.push('/dashboard/job-seeker/profile/edit-profile')}
                                        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                    >
                                        Update Location
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen relative">
            <div
                id="map-container"
                ref={mapContainerRef}
                className="absolute inset-0 h-full w-full"
            />

            <MapProvider
                mapContainerRef={mapContainerRef}
                initialViewState={{
                    longitude: mapCenter.longitude,
                    latitude: mapCenter.latitude,
                    zoom: mapCenter.zoom,
                }}
            >
                <MapCotrols />
                <MapStyles />

                {/* Show route between user and job location */}
                {routeCoordinates.length === 2 && (
                    <MapRoute
                        coordinates={routeCoordinates}
                        showRoute={true}
                        routeColor="#ef4444"
                        routeWidth={4}
                    />
                )}

                {/* Back button when viewing route */}
                {routeCoordinates.length === 2 && (
                    <div className="absolute top-4 left-4 z-10">
                        <button
                            onClick={() => router.back()}
                            className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-gray-700 hover:bg-white transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Job
                        </button>
                    </div>
                )}
            </MapProvider>
        </div>
    );
}
