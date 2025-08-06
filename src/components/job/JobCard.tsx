import { JobI } from "@/types/job";
import SafeHTML from "../global/SafeHTML";
import { Calendar, Eye, Trash2 } from "lucide-react";


type JobCardProps = {
    job: JobI;
    onDelete: (job: JobI) => void;
    onView: (job: JobI) => void;
};

export default function JobCard({ job, onDelete, onView }: JobCardProps) {
    const getUrgencyColor = (urgency?: string) => {
        switch (urgency) {
            case 'Urgent': return 'bg-red-100 text-red-600';
            case 'Medium': return 'bg-yellow-100 text-yellow-600';
            case 'Low': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-4">
            <div
                key={job._id}
                // onClick={() => handleJobSelect(job)}
                className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-primary/20"
            >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                            {job.category && (
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                                    {job.category}
                                </span>
                            )}
                            {job.priority && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.priority)}`}>
                                    {job.priority}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-primary">₹{job.price}</div>
                        {/* {job.location && (
                            <div className="text-xs text-gray-500">{job.location}</div>
                        )} */}
                    </div>
                </div>

                <SafeHTML html={job?.job_description || ''} />


                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="text-sm">{job.location}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {job?.createdAt
                                    ? new Date(job.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onView(job)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={() => {
                                if (job._id) onDelete(job);
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 