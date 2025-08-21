import { GigI } from "@/types/gig";
import { Calendar } from "lucide-react";
import SafeHTML from "../global/SafeHTML";

type GigCardProps = {
    gig: GigI;
}

export const GigCard = ({ gig }: GigCardProps) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-sm md:text-lg">{gig.title}</h3>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
