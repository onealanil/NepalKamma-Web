// import GeoLocation from "@/components/geolocation/Geolocation";


// export default function SettingsPage() {
//     return (
//         <>
//             {/* <GeoLocation/> */}
//         </>
//     )
// }

"use client";

import { useState } from 'react';
import debounce from 'lodash.debounce';

interface Geometry {
  coordinates: number[];
  type: string;
}

interface Place {
  geometry: Geometry;
  properties: {
    city: string;
    country: string;
    formatted?: string;
  };
  type: string;
}

interface GeoapifyResponse {
  features: Place[];
}

interface GeoLocationProps {
  setGeometry?: (geometry: Geometry) => void;
  setLocationName?: (name: string) => void;
}

const GeoLocation = ({ setGeometry, setLocationName }: GeoLocationProps) => {
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [inputValue, setInputValue] = useState('');

  const fetchSuggestions = debounce(async (value: string) => {
    if (!value) {
      setSuggestions([]);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GEO_API_KEY as string;
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      `${value},Nepal`
    )}&limit=5&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Network response was not ok');
        throw new Error('Network response was not ok');
      }
      const data: GeoapifyResponse = await response.json();
      setSuggestions(data.features);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    fetchSuggestions(value);
  };

  const handleSuggestionPress = (place: Place) => {
    const locationName = place.properties.formatted || place.properties.city;
    setInputValue(locationName);
    setSuggestions([]);

    if (setGeometry) setGeometry(place.geometry);
    if (setLocationName) setLocationName(locationName);

    console.log('Selected place:', locationName);
    console.log('Coordinates:', place.geometry.coordinates);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter Location"
        className="w-full bg-green-50 rounded-md text-black px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionPress(suggestion)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                {suggestion.properties.formatted || `${suggestion.properties.city}, ${suggestion.properties.country}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function SettingsPage() {
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [locationName, setLocationName] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Settings</h2>
          <GeoLocation 
            setGeometry={setGeometry}
            setLocationName={setLocationName}
          />
        </div>
      </div>
    </div>
  );
}
