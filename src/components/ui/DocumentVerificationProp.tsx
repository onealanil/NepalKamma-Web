import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DocumentVerificationPopup({ user }: { user: { isDocumentVerified: string, role: string } }) {
    const [showPopup, setShowPopup] = useState(user.isDocumentVerified === "is_not_verified");
    const router = useRouter();

    if (!showPopup) return null;

    function handleNavigate() {
        router.push(`/dashboard/${user.role === "job_seeker" ? "job-seeker" : "job-provider"}/profile/verify-document`);
        setShowPopup(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-xl relative w-[90%] max-w-md">
                {/* Close button */}
                <div className="flex justify-between items-center">
                    <div></div>
                    <button
                        onClick={() => setShowPopup(false)}
                        className="absolute top-0 right-1 text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ✕
                    </button>

                </div>

                <h2 className="text-2xl font-bold mb-4 mt-2 text-gray-800">
                    Document Verification Required
                </h2>
                <p className="mb-6 font-semibold text-gray-600">
                    Your documents are not verified. Please submit the required documents to proceed.
                </p>
                <div>
                    <h1>By verifying your documents, you can:</h1>
                    <ul className="list-disc list-inside mt-2 mb-4 text-gray-600">
                        <li>Enhance your profile credibility</li>
                        <li>Access exclusive job opportunities and freelancer</li>
                        <li>Build trust with potential employers</li>
                        <li>Direct Message</li>
                        <li>View map and distance</li>
                        <li>And much more features available..</li>
                    </ul>
                </div>
                <button
                    onClick={handleNavigate}
                    className="px-4 rounded-md font-semibold py-2 bg-primary text-white hover:bg-primary-foreground transition-colors"
                >
                    Verify Documents
                </button>
            </div>
        </div>
    );
}
