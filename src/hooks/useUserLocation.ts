import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

interface UserLocation {
    latitude: number | null;
    longitude: number | null;
    isLoading: boolean;
    error: string | null;
    hasPermission: boolean;
}

/**
 * @function useUserLocation
 * @description Hook to get user location from profile or browser geolocation
 * @returns UserLocation object with coordinates and status
 */
export const useUserLocation = (): UserLocation => {
    const { user } = useAuthStore();
    const [location, setLocation] = useState<UserLocation>({
        latitude: null,
        longitude: null,
        isLoading: true,
        error: null,
        hasPermission: false
    });

    useEffect(() => {
        const getUserLocation = async () => {
            // First, try to get location from user profile
            if (user?.address?.coordinates && user.address.coordinates.length === 2) {
                setLocation({
                    latitude: user.address.coordinates[1], // latitude
                    longitude: user.address.coordinates[0], // longitude
                    isLoading: false,
                    error: null,
                    hasPermission: true
                });
                return;
            }

            // If no profile location, try browser geolocation
            if (!navigator.geolocation) {
                setLocation(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Geolocation is not supported by this browser',
                    hasPermission: false
                }));
                return;
            }

            // Request browser location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        isLoading: false,
                        error: null,
                        hasPermission: true
                    });
                },
                (error) => {
                    let errorMessage = 'Failed to get location';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied by user';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                    }
                    
                    setLocation(prev => ({
                        ...prev,
                        isLoading: false,
                        error: errorMessage,
                        hasPermission: false
                    }));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        };

        getUserLocation();
    }, [user]);

    return location;
};
