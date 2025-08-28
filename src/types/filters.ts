export interface JobFilters {
    text?: string;              // Search text for title and description
    category?: string;          // Single category selection (not array)
    distance?: number;          // Distance in km for location search
    useDistanceFilter?: boolean; // Toggle for distance-based search
    sortBy?: 'recent' | 'rating' | 'price_high_to_low' | 'price_low_to_high';
    location?: {
        latitude?: number;      // lat for backend
        longitude?: number;     // lng for backend
    };
}

export interface FilterOption {
    label: string;
    value: string;
    color?: string;
}

export interface SortOption {
    label: string;
    value: 'recent' | 'rating' | 'price_high_to_low' | 'price_low_to_high';
}

export interface CategoryOption {
    label: string;
    value: string;
    count?: number;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
    { label: 'All Categories', value: 'All' },
    { label: 'Home Service', value: 'home_services' },
    { label: 'Repairs', value: 'repairs' },
    { label: 'Automotive', value: 'automotive' },
    { label: 'Business', value: 'business' },
    { label: 'Childcare', value: 'childcare' },
    { label: 'Construction', value: 'construction' },
    { label: 'Computer IT', value: 'computer_it' },
    { label: 'Education & Training', value: 'education_training' },
    { label: 'Labor', value: 'labor' },
    { label: 'Gardening & Farming', value: 'gardening_farming' }
];

export const SORT_OPTIONS: SortOption[] = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Price: Low to High', value: 'price_low_to_high' },
    { label: 'Price: High to Low', value: 'price_high_to_low' },
    { label: 'Highest Rating', value: 'rating' }
];

export const DEFAULT_FILTERS: JobFilters = {
    text: '',
    category: 'All',
    distance: 5,
    useDistanceFilter: true,
    sortBy: 'recent',
    location: {}
};
