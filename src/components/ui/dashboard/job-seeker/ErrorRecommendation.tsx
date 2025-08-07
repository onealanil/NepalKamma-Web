import LeftSideSeeker from "../../LeftSideSeeker";


export default function ErrorRecommendation({mutate}: {mutate: () => void}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="hidden lg:block lg:col-span-3">
                        <LeftSideSeeker />
                    </div>
                    <div className="lg:col-span-9 py-6">
                        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                            <div className="text-4xl mb-4">⚠️</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Failed to Load Jobs
                            </h3>
                            <p className="text-gray-600 mb-6">
                                There was an error loading recommended jobs. Please try again.
                            </p>
                            <button
                                onClick={() => mutate()}
                                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}