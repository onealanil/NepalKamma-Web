//components/geolocation/AutoSuggestionGeoLocation.tsx

export interface Geometry {
    coordinates: number[];
    type: string;
}

export interface Place {
    geometry: Geometry;
    properties: {
        city: string;
        country: string;
        formatted?: string;
    };
    type: string;
}

export interface GeoapifyResponse {
    features: Place[];
}

export interface GeoLocationProps {
    setGeometry?: (geometry: Geometry) => void;
    setLocationName?: (name: string) => void;
}