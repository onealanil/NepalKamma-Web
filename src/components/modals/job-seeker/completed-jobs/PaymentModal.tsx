import { CompletedJob } from "@/types/job-provider/CompletedJob";

// Payment Modal Component
const PaymentModal = ({
    isOpen,
    onClose,
    data
}: {
    isOpen: boolean;
    onClose: () => void;
    data: CompletedJob | null;
}) => {
    if (!isOpen || !data) return null;

    const getPaymentStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'provider_paid':
                return 'Paid';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{data.job.title}</h3>
                            <p className="text-gray-600 text-sm">
                                <span className="font-medium">Location:</span> {data.job.location}
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Amount:</span>
                                    <p className="font-semibold">Rs. {data.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Status:</span>
                                    <p className="font-semibold">{getPaymentStatusText(data.paymentStatus)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Payment Type:</span>
                                    <p className="font-semibold capitalize">{data.paymentType}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Date:</span>
                                    <p className="font-semibold">{new Date(data.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="space-y-3">
                                <div>
                                    <span className="text-gray-500 text-sm">Payment From:</span>
                                    <div className="mt-1">
                                        <p className="font-semibold">{data.PaymentBy.username}</p>
                                        <p className="text-sm text-gray-600">{data.PaymentBy.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm">Payment To:</span>
                                    <div className="mt-1">
                                        <p className="font-semibold">{data.PaymentTo.username}</p>
                                        <p className="text-sm text-gray-600">{data.PaymentTo.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {data.recieverNumber && (
                            <div className="border-t pt-4">
                                <span className="text-gray-500 text-sm">Receiver Number:</span>
                                <p className="font-semibold mt-1">{data.recieverNumber}</p>
                            </div>
                        )}

                        {data.confirmation_image && data.confirmation_image.length > 0 && (
                            <div className="border-t pt-4">
                                <span className="text-gray-500 text-sm">Confirmation Images:</span>
                                <p className="text-sm text-gray-600 mt-1">{data.confirmation_image.length} image(s) attached</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
