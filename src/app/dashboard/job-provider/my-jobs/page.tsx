"use client";

import LeftSideProvider from "@/components/ui/LeftSideProvider";
import { ChevronLeft, Trash2 } from "lucide-react";
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
import SafeHTML from "@/components/global/SafeHTML";

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

    const handleViewJob = (job: JobI) => {
        setSelectedJob(job);
        setShowJobModal(true);
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
        try {
            await deleteJob(jobId);
            setShowDeleteConfirm(false);
            setJobToDelete(null);
            SuccessToast("Successfully, Deleted your Job")
            mutate();
        } catch (err) {
            ErrorToast("Failed to delete job.");
        } finally {
            setIsDeleteLoading(false);
        }
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

    /**
     * Single job modal
     */
    const JobDetailsModal = ({ isOpen, onClose, job }: { isOpen: boolean; onClose: () => void; job: JobI | null }) => {
        if (!isOpen || !job) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                <SafeHTML html={job?.job_description || ''} isFullDescription={true} />

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-semibold text-gray-900 mb-1">Price</h5>
                                    <p className="text-2xl font-bold text-primary">₹{job.price.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-semibold text-gray-900 mb-1">Category</h5>
                                    <p className="text-gray-700">{job.category}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-semibold text-gray-900 mb-1">Status</h5>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${job.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {job.visibility}
                                    </span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-semibold text-gray-900 mb-1">Created</h5>
                                    <p className="text-gray-700">
                                        {
                                            job.createdAt ?
                                                new Date(job.createdAt).toLocaleDateString() : "N/A"
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Delete Job
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };




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
                                className="lg:hidden p-2 rounded-full transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Jobs</h1>
                                <p className="text-gray-600">Manage your posted Jobs</p>
                            </div>
                        </div>

                        {/* stats  */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Pending', 'In Progress', 'Completed', 'Cancelled', 'Paid'].map((status) => (
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
                                    {status} ({jobs.filter((job: JobI) => job.job_status === status).length})
                                </button>
                            ))}
                        </div>


                        {/* stats  */}


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
                                    <JobCard key={job._id} onView={handleViewJob} job={job} onDelete={handleDeleteJob} />

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
                                        Deleting JOb...
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