import { JobI } from "@/types/job";
import { MapPin } from "lucide-react";

const JobCard = ({ data, onClick }: { data: JobI; onClick: () => void }) => (
    <div
        onClick={onClick}
        className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
        <div className="space-y-2 sm:space-y-3">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-2">
                {data.title}
            </h3>

            <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">
                {data.job_description.replace(/<[^>]*>/g, '')}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit">
                    {data.category}
                </span>
                <span className="font-bold text-base sm:text-lg text-gray-900">
                    Rs. {data.price.toLocaleString()}
                </span>
            </div>

            {data.location && (
                <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{data.location}</span>
                </div>
            )}
        </div>
    </div>
);

export default JobCard;