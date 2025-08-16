"use client";

import { JobFilters, CATEGORY_OPTIONS, SORT_OPTIONS, DEFAULT_FILTERS } from '@/types/filters';

interface DesktopFilterSidebarProps {
    filters: JobFilters;
    onFiltersChange: (filters: JobFilters) => void;
    onApplyFilters: () => void;
}

const DesktopFilterSidebar = ({
    filters,
    onFiltersChange,
    onApplyFilters
}: DesktopFilterSidebarProps) => {

    const handleFilterChange = (key: keyof JobFilters, value: any) => {
        const newFilters = {
            ...filters,
            [key]: value
        };
        onFiltersChange(newFilters);
    };

    const handleCategoryChange = (category: string) => {
        handleFilterChange('category', category);
    };

    const handleReset = () => {
        onFiltersChange(DEFAULT_FILTERS);
    };

    return (
        <div className="hidden lg:block lg:col-span-3 py-6">
            <div className="sticky top-6 space-y-6">
                {/* Filter Header */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Filters</h3>
                        <button 
                            onClick={handleReset}
                            className="text-primary text-sm font-medium hover:text-primary/80"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Distance Filter */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Distance Search</h4>
                        <button
                            onClick={() => handleFilterChange('useDistanceFilter', !filters.useDistanceFilter)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors${
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

                    {filters.useDistanceFilter && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>1 km</span>
                                <span>15 km</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="15"
                                value={filters.distance || 5}
                                onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="text-center">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                    Within {filters.distance || 5} km
                                </span>
                            </div>
                        </div>
                    )}

                    {!filters.useDistanceFilter && (
                        <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">
                                Distance filter is disabled. Showing all jobs.
                            </p>
                        </div>
                    )}
                </div>

                {/* Category Filter */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4">Category</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {CATEGORY_OPTIONS.map((category) => (
                            <label key={category.value} className="flex items-center">
                                <input
                                    type="radio"
                                    name="category"
                                    value={category.value}
                                    checked={filters.category === category.value}
                                    onChange={() => handleCategoryChange(category.value)}
                                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                                />
                                <span className="ml-3 text-sm text-gray-700">{category.label}</span>
                            </label>
                        ))}
                    </div>
                </div>



                {/* Sort By */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4">Sort By</h4>
                    <div className="space-y-3">
                        {SORT_OPTIONS.map((option) => (
                            <label key={option.value} className="flex items-center">
                                <input
                                    type="radio"
                                    name="sortBy"
                                    value={option.value}
                                    checked={filters.sortBy === option.value}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                                />
                                <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>



                {/* Apply Filters Button */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <button 
                        onClick={onApplyFilters}
                        className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DesktopFilterSidebar;
