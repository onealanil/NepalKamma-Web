import { Navigation, X } from "lucide-react";

const MoreModal = ({
    isOpen,
    onClose,
    userAddress,
    userLatitude,
    userLongitude,
    isCurrentUserVerified
}: {
    isOpen: boolean;
    onClose: () => void;
    userAddress?: string;
    userLatitude?: number;
    userLongitude?: number;
    isCurrentUserVerified: boolean;
}) => {
    if (!isOpen) return null;

    const handleViewOnMap = () => {
        if (userLatitude && userLongitude) {
            // Use your custom map implementation
            const mapUrl = `/dashboard/job-seeker/map?lat=${userLatitude}&lng=${userLongitude}`;
            window.open(mapUrl, '_blank');
        }
    };

    return (
        <div
            className="fixed inset-0 bg-backdrop-blur-sm bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl max-w-sm sm:max-w-md w-full p-4 sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">More Options</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                        <p className="text-gray-600">
                            {userAddress || 'No address provided'}
                        </p>
                    </div>

                    {isCurrentUserVerified && userLatitude && userLongitude && (
                        <button
                            onClick={handleViewOnMap}
                            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <Navigation size={20} />
                            View on Map
                        </button>
                    )}

                    {!isCurrentUserVerified && (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-yellow-800 text-sm">
                                Verify your account to access more features like viewing location on map.
                            </p>
                        </div>
                    )}

                    <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                        Report User
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoreModal;