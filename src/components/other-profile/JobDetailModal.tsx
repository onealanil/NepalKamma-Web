import { JobI } from "@/types/job";
import { MapPin } from "lucide-react";

const JobDetailModal = ({
    isOpen,
    onClose,
    job
}: {
    isOpen: boolean;
    onClose: () => void;
    job: JobI | null;
}) => {
    if (!isOpen || !job) return null;

    return (
        <div
            className="fixed inset-0 bg-backdrop-blur-sm bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl max-w-sm sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                            <p className="text-gray-600 leading-relaxed">
                                {job.job_description.replace(/<[^>]*>/g, '')}
                            </p>
                        </div>

                        {job.location && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{job.location}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
                                {job.category}
                            </span>
                            <span className="font-bold text-2xl text-gray-900">
                                Rs. {job.price.toLocaleString()}
                            </span>
                        </div>

                        <div className="pt-4 border-t">
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
        </div>
    );
};

export default JobDetailModal;
