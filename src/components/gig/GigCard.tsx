import { GigI } from "@/types/gig";
import { MoreHorizontal, Calendar, Eye, Trash2, Edit } from "lucide-react";
import SafeHTML from "../global/SafeHTML";
import {format} from "date-fns";

type GigCardProps = {
    gig: GigI;
    onView: (gig: GigI) => void
    onDelete: (gigId: GigI) => void
}

export const GigCard = ({ gig, onView, onDelete }: GigCardProps) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-green-100 rounded-xl flex items-center justify-center overflow-hidden">
                {gig.postedBy?.profilePic?.url ? (
                    <img
                        src={gig.postedBy?.profilePic.url}
                        alt={gig.title}
                        className="w-12 h-12 md:w-full md:h-full object-cover"
                    />
                ) : (
                    <span className="text-2xl">
                        Not Found
                    </span>
                )}
            </div>

            <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-sm md:text-lg">{gig.title}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${gig.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {gig.visibility}
                        </span>
                        <button className="hidden md:block p-1 hover:bg-gray-100 rounded-full">
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>

                <SafeHTML html={gig?.gig_description || ''} />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold text-primary">₹{gig.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {gig?.createdAt
                                    ? new Date(gig.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onView(gig)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={() => {
                                if (gig._id) onDelete(gig);
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
