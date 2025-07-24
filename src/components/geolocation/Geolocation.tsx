"use client";

import { useState, useEffect } from "react";

interface LocationState {
    latitude: number | null;
    longitude: number | null;
}

export default function Geolocation() {
    const [location, setLocation] = useState<LocationState>({ latitude: null, longitude: null });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [permissionDenied, setPermissionDenied] = useState(false);


    const getUserLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    setError(null);
                    setIsLoading(false);
                    setPermissionDenied(false);
                },
                (error) => {
                    if (error.code === 1) {
                        setError("You need to allow location access to use this app.");
                        setPermissionDenied(true);
                    } else {
                        setError("Unable to retrieve location. Please ensure location services are enabled.");
                        setPermissionDenied(false);
                    }
                    setLocation({ latitude: null, longitude: null });
                    setIsLoading(false);
                },
                {
                    enableHighAccuracy: true, // High accuracy for better precision
                    timeout: 10000, // Timeout after 10 seconds
                    maximumAge: 0, // No cached location
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
            setIsLoading(false);
        }
    };

    // Request location on mount
    useEffect(() => {
        getUserLocation();
    }, []);

    // Function to retry location request
    const retryLocation = () => {
        setIsLoading(true);
        setError(null);
        getUserLocation();
    };

    const handleManualPermission = () => {
        alert("Please manually enable location access:\n\n1. Click the location icon in your browser's address bar\n2. Select 'Allow' for location access\n3. Refresh the page");
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            {isLoading ? (
                <p>Retrieving your location...</p>
            ) : location.latitude && location.longitude ? (
                <div>
                    <h1>Welcome to the App!</h1>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            ) : (
                <div>
                    <h1>Location Required</h1>
                    <p>{error}</p>
                    <div style={{ marginTop: "20px" }}>
                        <button onClick={retryLocation} style={{ marginRight: "10px" }}>
                            Try Again
                        </button>
                        {permissionDenied && (
                            <button onClick={handleManualPermission}>
                                Enable Location Manually
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
