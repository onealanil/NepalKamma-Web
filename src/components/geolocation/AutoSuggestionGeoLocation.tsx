"use client";

import { useState } from 'react';
import debounce from 'lodash.debounce';
import { GeoapifyResponse, GeoLocationProps, Place } from '@/types/AutoSuggestionT';

const AutoSuggestionGeoLocation = ({ setGeometry, setLocationName }: GeoLocationProps) => {
    const [suggestions, setSuggestions] = useState<Place[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [hasSelected, setHasSelected] = useState(false); // ✅ NEW

    const fetchSuggestions = debounce(async (value: string) => {
        if (!value || hasSelected) { // ✅ prevent fetch if already selected
            setSuggestions([]);
            return;
        }

        const apiKey = process.env.NEXT_PUBLIC_GEO_API_KEY as string;
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            `${value},Nepal`
        )}&limit=5&apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');

            const data: GeoapifyResponse = await response.json();
            setSuggestions(data.features);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }, 300);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setHasSelected(false);
        fetchSuggestions(value);
    };

    const handleSuggestionPress = (place: Place) => {
        const locationName = place.properties.formatted || place.properties.city;
        setInputValue(locationName);
        setHasSelected(true);
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
                className="w-full rounded-md text-black px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {!hasSelected && suggestions.length > 0 && ( // ✅ prevent showing if selected
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
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

export default AutoSuggestionGeoLocation;
