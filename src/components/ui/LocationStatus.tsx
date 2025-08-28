"use client";

import { useAuthStore } from "@/store/authStore";
import { MapPin, AlertCircle, Globe } from "lucide-react";
import { JobFilters } from "@/types/filters";

interface LocationStatusProps {
    filters: JobFilters;
    onFiltersChange: (filters: JobFilters) => void;
}

const LocationStatus = ({ filters, onFiltersChange }: LocationStatusProps) => {
    const { user } = useAuthStore();
    
    const hasLocation = user?.address?.coordinates &&
                       user.address.coordinates.length === 2 &&
                       user.address.coordinates[0] !== 0 &&
                       user.address.coordinates[1] !== 0;

    const handleToggleDistanceFilter = () => {
        onFiltersChange({
            ...filters,
            useDistanceFilter: !filters.useDistanceFilter
        });
    };

    return (
        <div className={`rounded-lg p-4 mb-4 border ${
            filters.useDistanceFilter
                ? hasLocation
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                : 'bg-blue-50 border-blue-200'
        }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {filters.useDistanceFilter ? (
                        hasLocation ? (
                            <MapPin className="w-5 h-5 text-green-600" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                        )
                    ) : (
                        <Globe className="w-5 h-5 text-blue-600" />
                    )}

                    <div className="flex-1">
                        {filters.useDistanceFilter ? (
                            hasLocation ? (
                                <>
                                    <p className="text-green-800 text-sm font-medium">
                                        Distance Search: Within {filters.distance || 5}km
                                    </p>
                                    <p className="text-green-700 text-xs">
                                        Location: {user.location || 'Set'}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-yellow-800 text-sm font-medium">
                                        Distance Search Enabled
                                    </p>
                                    <p className="text-yellow-700 text-xs">
                                        Please update your profile location to use distance-based search
                                    </p>
                                </>
                            )
                        ) : (
                            <>
                                <p className="text-blue-800 text-sm font-medium">
                                    Showing All Jobs
                                </p>
                                <p className="text-blue-700 text-xs">
                                    Distance filter is disabled
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Toggle Switch */}
                <button
                    onClick={handleToggleDistanceFilter}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        filters.useDistanceFilter ? 'bg-primary' : 'bg-gray-200'
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            filters.useDistanceFilter ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>
        </div>
    );
};

export default LocationStatus;
