import { Phone, X } from "lucide-react";

const CallModal = ({
    isOpen,
    onClose,
    phoneNumber,
    isCurrentUserVerified
}: {
    isOpen: boolean;
    onClose: () => void;
    phoneNumber?: string;
    isCurrentUserVerified: boolean;
}) => {
    if (!isOpen) return null;

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
                    <h3 className="text-xl font-bold text-gray-900">Call User</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {isCurrentUserVerified ? (
                        <>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="font-semibold text-green-900 mb-2">Phone Number</h4>
                                <p className="text-green-800 font-mono text-lg">
                                    {phoneNumber || 'No phone number available'}
                                </p>
                            </div>

                            {phoneNumber && (
                                <a
                                    href={`tel:${phoneNumber}`}
                                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Phone size={20} />
                                    Call Now
                                </a>
                            )}
                        </>
                    ) : (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <h4 className="font-semibold text-red-900 mb-2">Verification Required</h4>
                            <p className="text-red-800">
                                You need to be verified to view phone numbers and make calls.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallModal;