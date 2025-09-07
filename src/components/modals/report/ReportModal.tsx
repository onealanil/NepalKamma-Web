"use client";


import { ErrorToast } from "@/components/ui/Toast";
import { X } from "lucide-react";
import { useState } from "react";

export default function ReportModal({setIsReportModal}: {setIsReportModal: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [reportText, setReportText] = useState<string>("");

    /**
     * @function handleReportSubmit
     * Handles the submission of the report.
     * Currently, it just logs the report text to the console and closes the modal.
     */

    const handleReportSubmit = () => {
        ErrorToast("Direct Reporting feature is not available right now. Please contact our support email for further assistance.")
        setIsReportModal(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white w-[90%] max-w-lg rounded-2xl shadow-lg p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Write your report here:
                    </h2>
                    {/* close button  */}
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setIsReportModal(false)}
                    >
                        <X size={24} />
                        
                    </button>
                </div>

                {/* Textarea */}
                <textarea
                    className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your report here..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                />

                {/* Action buttons */}
                <div className="mt-4 flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        onClick={() => setReportText("")}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                        onClick={handleReportSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
