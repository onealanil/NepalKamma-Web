"use client";


import { useState } from "react";

export default function ReportModal() {
    const [reportText, setReportText] = useState<string>("");

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6">
                {/* Header */}
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Write your report here:
                </h2>

                {/* Textarea */}
                <textarea
                    className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={() => alert(`Report submitted: ${reportText}`)}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
