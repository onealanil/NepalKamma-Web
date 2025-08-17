import { GigI } from "@/types/gig";
import {
  MoreHorizontal,
  Calendar,
  Eye,
  Trash2,
  Edit,
  MapPin,
  User,
} from "lucide-react";
import SafeHTML from "../global/SafeHTML";
import { format } from "date-fns";
import Image from "next/image";

type GigCardProviderProps = {
  gig: GigI;
  onViewDetails?: (gig: GigI) => void;
  showActions?: boolean;
};

export const GigCardProvider = ({
  gig,
  onViewDetails,
  showActions = false,
}: GigCardProviderProps) => (
  <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      {/* Profile Picture */}
      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary/20 to-green-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
        {gig.postedBy?.profilePic?.url ? (
          <Image
            src={gig.postedBy.profilePic.url}
            alt={gig.postedBy.username || gig.title}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm md:text-lg truncate">
              {gig.title}
            </h3>
            {gig.postedBy?.username && (
              <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 mt-1">
                <User className="w-3 h-3" />
                {gig.postedBy.username}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                gig.visibility === "public"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {gig.visibility}
            </span>
            {showActions && (
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="text-sm md:text-base text-gray-700 mb-3 line-clamp-5">
          <SafeHTML html={gig?.gig_description || ""} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-primary text-sm md:text-base">
                <span className="text-gray-900">Price:</span> Rs.{gig.price.toLocaleString()}
              </span>
            </div>
            <div className="flex">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span>
                  {gig?.createdAt
                    ? format(new Date(gig.createdAt), "MMM dd")
                    : "N/A"}
                </span>
              </div>
              {gig.category && (
                <div className="hidden md:flex items-center gap-1">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {gig.category}
                  </span>
                </div>
              )}
            </div>
            {gig.postedBy?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="">{gig.postedBy.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewDetails?.(gig)}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white rounded-lg text-xs md:text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Eye className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
