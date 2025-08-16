import { ReviewI } from "@/types/review";
import { Star } from "lucide-react";
import Image from "next/image";
import {formatDistanceToNow} from "date-fns";

// Review Component
const ReviewCard = ({ data }: { data: ReviewI }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                {data.reviewedBy.profilePic?.url ? (
                    <Image
                        src={data.reviewedBy.profilePic.url}
                        alt={data.reviewedBy.username}
                        width={40}
                        height={40}
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-xs">N/A</span>
                    </div>
                )}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{data.reviewedBy.username}</h4>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={`${i < data.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{data.reviewedBy.location}</p>
                <p className="text-gray-700 text-sm">{data.review}</p>
                <p className="text-xs text-gray-500 mt-2">
                    {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
                </p>
            </div>
        </div>
    </div>
);

export default ReviewCard;
