"use client";

import LeftSideProvider from "@/components/ui/LeftSideProvider";
import { ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useUserJobs } from "@/hooks/jobs/useJobs";
import { useAuthStore } from "@/store/authStore";
import { JobI } from "@/types/job";
import { MotivationalQuotes } from "@/components/ui/MotivationalQuotes";
import JobCard from "@/components/job/JobCard";
import { useEnsureAuth } from "@/hooks/useEnsureAuth";
import Loader from "@/components/global/Loader";

export default function MyJobsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isReady } = useEnsureAuth();


    const { jobs, isLoading, mutate } = useUserJobs(user?._id as string);


    const LoadingCard = () => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );

    if (!isReady) {
        return <Loader />
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar */}
                    <LeftSideProvider />

                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => router.back()}
                                className="lg:hidden p-2 hover:bg-white rounded-full transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Jobs</h1>
                                <p className="text-gray-600">Manage your posted Jobs</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">{jobs.length}</p>
                                    <p className="text-gray-600 text-sm">Total Jobs</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {jobs.filter((g: JobI) => g.visibility === 'public').length}
                                    </p>
                                    <p className="text-gray-600 text-sm">Active Jobs</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-center'>
                            <button onClick={() => router.push("/dashboard/job-provider/create-job")} className="w-full my-3 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                <span>Create New Job</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy-plus">
                                    <line x1="15" x2="15" y1="12" y2="18" />
                                    <line x1="12" x2="18" y1="15" y2="15" />
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>

                        {/* Gigs List */}
                        <div className="space-y-4">
                            {isLoading ? (
                                <>
                                    {[1, 2, 3].map((item) => (
                                        <LoadingCard key={item} />
                                    ))}
                                </>
                            ) : jobs.length > 0 ? (
                                jobs.map((job: JobI) => (
                                    <JobCard key={job._id} job={job} />

                                ))
                            ) : (
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                    <div className="text-4xl mb-4">📝</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Gigs Yet</h3>
                                    <p className="text-gray-600 mb-6">Start by creating your first gig to showcase your skills</p>
                                    <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                                        Create Your First Job
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <MotivationalQuotes isProvider={true} />
                    </div>
                </div>
            </div>
            {/* Gig Detail Modal */}
            {/* <GigDetailModal
                isOpen={showGigModal}
                onClose={() => setShowGigModal(false)}
                gig={selectedGig}
            />
            {showDeleteConfirm && gigToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Delete Gig</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete <span className="font-semibold">{gigToDelete.title}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => gigToDelete._id && handleDeleteGigFunction(gigToDelete._id)}
                                disabled={isDeleteLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                {isDeleteLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting Gig...
                                    </div>
                                ) : (
                                    'Delete Gig'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

        </div>
    );
}