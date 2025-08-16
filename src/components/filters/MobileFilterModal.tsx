"use client";

import { useState, useEffect } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { JobFilters, CATEGORY_OPTIONS, SORT_OPTIONS, DEFAULT_FILTERS } from '@/types/filters';

interface MobileFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: JobFilters;
    onFiltersChange: (filters: JobFilters) => void;
    onApplyFilters: () => void;
}

const MobileFilterModal = ({
    isOpen,
    onClose,
    filters,
    onFiltersChange,
    onApplyFilters
}: MobileFilterModalProps) => {
    const [localFilters, setLocalFilters] = useState<JobFilters>(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    if (!isOpen) return null;

    const handleLocalFilterChange = (key: keyof JobFilters, value: any) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleCategoryChange = (category: string) => {
        handleLocalFilterChange('category', category);
    };

    const handleApply = () => {
        onFiltersChange(localFilters);
        onApplyFilters();
        onClose();
    };

    const handleReset = () => {
        setLocalFilters(DEFAULT_FILTERS);
        onFiltersChange(DEFAULT_FILTERS);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1 text-primary text-sm font-medium hover:text-primary/80"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4 space-y-6">
                    {/* Distance Filter */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Distance Search</h4>
                            <button
                                onClick={() => handleLocalFilterChange('useDistanceFilter', !localFilters.useDistanceFilter)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                    localFilters.useDistanceFilter ? 'bg-primary' : 'bg-gray-200'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        localFilters.useDistanceFilter ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        {localFilters.useDistanceFilter && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                    <span>1 km</span>
                                    <span>15 km</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="15"
                                    value={localFilters.distance || 5}
                                    onChange={(e) => handleLocalFilterChange('distance', parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                                <div className="text-center">
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                        Within {localFilters.distance || 5} km
                                    </span>
                                </div>
                            </div>
                        )}

                        {!localFilters.useDistanceFilter && (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-sm">
                                    Distance filter is disabled. Showing all jobs.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Category</h4>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                            {CATEGORY_OPTIONS.map((category) => (
                                <label key={category.value} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category.value}
                                        checked={localFilters.category === category.value}
                                        onChange={() => handleCategoryChange(category.value)}
                                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                                    />
                                    <span className="ml-3 text-sm text-gray-700">{category.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>



                    {/* Sort By */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Sort By</h4>
                        <div className="space-y-3">
                            {SORT_OPTIONS.map((option) => (
                                <label key={option.value} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="sortBy"
                                        value={option.value}
                                        checked={localFilters.sortBy === option.value}
                                        onChange={(e) => handleLocalFilterChange('sortBy', e.target.value)}
                                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                                    />
                                    <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>


                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <button
                        onClick={handleApply}
                        className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileFilterModal;
