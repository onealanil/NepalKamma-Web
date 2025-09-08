
"use client";

import LeftSideProvider from "@/components/ui/LeftSideProvider";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useUserJobs } from "@/hooks/jobs/useJobs";
import { useAuthStore } from "@/store/authStore";
import { JobI } from "@/types/job";
import { MotivationalQuotes } from "@/components/ui/MotivationalQuotes";
import JobCard from "@/components/job/JobCard";
import { useEnsureAuth } from "@/hooks/useEnsureAuth";
import Loader from "@/components/global/Loader";
import { LoadingCard } from "@/components/ui/loader/LoadingCard";
import { useState } from "react";
import { ErrorToast, SuccessToast } from "@/components/ui/Toast";
import { deleteJob } from "@/lib/job/job-api";
import { JobDetailsModal } from "@/components/ui/modals/JobDetailsModal";
import Link from "next/link";

export default function MyJobsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { isReady } = useEnsureAuth();
    const { jobs, isLoading, mutate } = useUserJobs(user?._id as string);
    const [jobToDelete, setJobToDelete] = useState<JobI | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("pending");
    const [showJobModal, setShowJobModal] = useState<boolean>(false);
    const [selectedJob, setSelectedJob] = useState<JobI | null>(null);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const handleViewJob = (job: JobI) => {
        setSelectedJob(job);
        setShowJobModal(true);
    };


    /**
     * @function handleRefresh
     * @description Function to refresh the jobs list
     */
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await mutate();
        } catch (error) {
            console.error('Failed to refresh jobs:', error);
            ErrorToast('Failed to refresh jobs');
        } finally {
            setIsRefreshing(false);
        }
    };

    /**
     * @function handleDeleteJob
     * @description Function to handle job deletion confirmation
     * @param job - The job to delete
     */
    const handleDeleteJob = (job: JobI) => {
        setJobToDelete(job || null);
        setShowDeleteConfirm(true);
    }

    /**
     * @function handleDeleteJobFunction
     * @description Function to handle job deletion
     * @param jobId - The ID of the job to delete
     */
    const handleDeleteJobFunction = async (jobId: string) => {
        setIsDeleteLoading(true);
        if (!jobId) {
            ErrorToast("Something went wrong!");
            setIsDeleteLoading(false);
            return;
        }

        const response = await deleteJob(jobId);
        if (response.success) {
            setShowDeleteConfirm(false);
            setJobToDelete(null);
            SuccessToast("Successfully deleted your job!");
            await mutate();
        } else {
            ErrorToast(response.error || "Failed to delete job.");
        }
        setIsDeleteLoading(false);
    }


    /**
     * if authentication is not ready
     **/
    if (!isReady) {
        return <Loader />
    }
    /**
     * if user is not authenticated
     **/
    if (!user) {
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
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => router.back()}
                                    className="lg:hidden p-2 rounded-full transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Jobs</h1>
                                    <p className="text-gray-600">Manage your posted Jobs</p>
                                </div>
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Refresh jobs"
                            >
                                <RefreshCw
                                    className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`}
                                />
                            </button>
                        </div>

                        {/* stats  */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Pending', 'In_Progress', 'Completed', 'Cancelled', 'Paid', 'can_delete'].map((status) => (
                                <button
                                    key={status}
                                    className={`
        px-4 py-2 rounded-full text-sm font-medium
        border transition-colors duration-200
        ${activeTab === status.toLowerCase()
                                            ? 'bg-green-600 text-white border-green-700 shadow'
                                            : ' text-gray-700 border-gray-300 hover:bg-gray-100'
                                        }
      `}
                                    onClick={() => setActiveTab(status.toLowerCase())}
                                >
                                    {status === "In_Progress" ? "In Progress" : (status === "can_delete" ? "Can Delete" : status)}

                                    ({jobs.filter((job: JobI) => {
                                        if (job.job_status && job.visibility === "public" && job.job_status === "Pending") {
                                            return job.job_status === status;
                                        }
                                        if (job.job_status && job.job_status !== "Pending") return job.job_status === status;
                                    }).length
                                    })
                                </button>
                            ))}
                        </div>


                        {/* stats  */}


                        <div className='flex items-center justify-center'>
                            <Link href={"/dashboard/job-provider/create-job"} className="w-full my-3 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                <span>Create New Job</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy-plus">
                                    <line x1="15" x2="15" y1="12" y2="18" />
                                    <line x1="12" x2="18" y1="15" y2="15" />
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </Link>
                        </div>

                        {/* alert message  */}

                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2
v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        After posting a job, if you don&apos;t see it here immediately, please refresh the list using the refresh button.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2
v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        Click on the eye icon on any job to update job status (e.g., mark as &apos;In Progress&apos;, &apos;Completed&apos;, or &apos;Cancelled&apos;), or to view more details about the job.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {
                            activeTab === "can_delete" && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2
v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                Jobs listed under &apos;Can Delete&apos; can be removed from your job list. These jobs are either cancelled or completed or private and no longer active. Make sure to delete these jobs to keep your job list organized.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            activeTab === "paid" && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2
v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                Good job ! You have successfully marked the jobs as &apos;Paid&apos;. This indicates that the payment process for these jobs has been completed. Keep up the great work! Once we verified the payment from both sides, this jobs will be moved to &apos;can delete&apos; section.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }



                        {
                            activeTab === "completed" && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2
v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                Till now job seeker has completed the jobs, Now click on the &apos;Go to Payments&apos; button to proceed for payment and mark the job as &apos;Paid&apos;.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {/* Go to Payments page button  */}
                        {activeTab === "completed" && (
                            <div className="flex items-center justify-center mb-6">
                                <Link href={"/dashboard/job-provider/completed-jobs"} className="w-full max-w-xs bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                    <span>Go to Payments</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card">
                                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                                        <line x1="2" x2="22" y1="10" y2="10" />
                                        <line x1="6" x2="6.01" y1="16" y2="16" />
                                        <line x1="10" x2="14" y1="16" y2="16" />
                                    </svg>
                                </Link>
                            </div>
                        )
                        }


                        {/* Gigs List */}
                        <div className="space-y-4">
                            {isLoading ? (
                                <>
                                    {[1, 2, 3].map((item) => (
                                        <LoadingCard key={item} />
                                    ))}
                                </>
                            ) : jobs.length > 0 ? (
                                jobs
                                    .filter((job: JobI) => {
                                        if (activeTab === "pending") return job.job_status === "Pending" && job.visibility === "public";
                                        if (activeTab === "in_progress") return job.job_status === "In_Progress";
                                        if (activeTab === "completed") return job.job_status === "Completed";
                                        if (activeTab === "cancelled") return job.job_status === "Cancelled";
                                        if (activeTab === "paid") return job.job_status === "Paid";
                                        if (activeTab === "can_delete") return job.job_status === "can_delete" || job.visibility === "private";
                                        return false;
                                    })
                                    .map((job: JobI) => (
                                        <JobCard key={job._id} onView={handleViewJob} job={job} onDelete={handleDeleteJob} />
                                    ))
                            ) : (
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                    <div className="text-4xl mb-4">📝</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Jobs Yet</h3>
                                    <p className="text-gray-600 mb-6">Start posting a job, connect with local talent</p>
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

            {/* Job Details Modal */}
            <JobDetailsModal
                isOpen={showJobModal}
                onClose={() => setShowJobModal(false)
                }
                job={selectedJob}
            />

            {showDeleteConfirm && jobToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Delete Job</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete <span className="font-semibold">{jobToDelete.title}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => jobToDelete._id && handleDeleteJobFunction(jobToDelete._id)}
                                disabled={isDeleteLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                {isDeleteLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting Job...
                                    </div>
                                ) : (
                                    'Delete Job'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
