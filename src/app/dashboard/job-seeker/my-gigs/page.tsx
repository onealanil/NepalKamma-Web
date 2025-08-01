"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Eye, Edit, Trash2, MoreHorizontal, Calendar, DollarSign } from 'lucide-react';
import LeftSideSeeker from '@/components/ui/LeftSideSeeker';
import { MotivationalQuotes } from '@/components/ui/MotivationalQuotes';
import { GigI } from '@/types/gig';
import { useAuthStore } from '@/store/authStore';
import { ErrorToast, SuccessToast } from '@/components/ui/Toast';
import Loader from '@/components/global/Loader';
import { useUserGigs } from '@/hooks/gigs/useGigs';
import { GigCard } from '@/components/gig/GigCard';
import { deleteGig } from '@/lib/gig/gig-api';
import SafeHTML from '@/components/global/SafeHTML';
212

const MyGigsPage = () => {
    const router = useRouter();
    const { user } = useAuthStore();
    const { gigs, isLoading, mutate } = useUserGigs(user?._id || "");
    const [selectedGig, setSelectedGig] = useState<GigI | null>(null);
    const [showGigModal, setShowGigModal] = useState(false);
    const [gigToDelete, setGigToDelete] = useState<GigI | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

    const handleViewGig = (gig: GigI) => {
        setSelectedGig(gig);
        setShowGigModal(true);
    };

    const handleDeleteGig = (gig: GigI) => {
        setGigToDelete(gig || null);
        setShowDeleteConfirm(true);
    }

    const handleDeleteGigFunction = async (gigId: string) => {
        setIsDeleteLoading(true);
        try {
            await deleteGig(gigId);
            setShowDeleteConfirm(false);
            setGigToDelete(null);
            SuccessToast("Successfully, Deleted your gig")
            mutate();
        } catch (err) {
            ErrorToast("Failed to delete gig.");
        } finally {
            setIsDeleteLoading(false);
        }
    }

    if (isLoading) return <Loader />

    const GigDetailModal = ({ isOpen, onClose, gig }: { isOpen: boolean; onClose: () => void; gig: GigI | null }) => {
        if (!isOpen || !gig) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{gig.title}</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {gig.images?.[0]?.url && (
                            <div className="mb-6">
                                <img
                                    src={gig.images[0].url}
                                    alt={gig.title}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                <SafeHTML html={gig?.gig_description || ''} />

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-semibold text-gray-900 mb-1">Price</h5>
                                    <p className="text-2xl font-bold text-primary">₹{gig.price.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-semibold text-gray-900 mb-1">Category</h5>
                                    <p className="text-gray-700">{gig.category}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-semibold text-gray-900 mb-1">Status</h5>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${gig.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {gig.visibility}
                                    </span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-semibold text-gray-900 mb-1">Created</h5>
                                    <p className="text-gray-700">
                                        {
                                            gig.createdAt ?
                                                new Date(gig.createdAt).toLocaleDateString() : "N/A"
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Delete Gig
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar */}
                    <LeftSideSeeker />

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
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Gigs</h1>
                                <p className="text-gray-600">Manage your posted gigs</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">{gigs.length}</p>
                                    <p className="text-gray-600 text-sm">Total Gigs</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {gigs.filter((g: GigI) => g.visibility === 'public').length}
                                    </p>
                                    <p className="text-gray-600 text-sm">Active Gigs</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-center'>
                            <button onClick={() => router.push("/dashboard/job-seeker/create-gig")} className="w-full my-3 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                <span>Create New Gig</span>
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
                            ) : gigs.length > 0 ? (
                                gigs.map((gig: GigI) => (
                                    <GigCard key={gig._id} gig={gig} onView={handleViewGig} onDelete={handleDeleteGig} />
                                ))
                            ) : (
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                    <div className="text-4xl mb-4">📝</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Gigs Yet</h3>
                                    <p className="text-gray-600 mb-6">Start by creating your first gig to showcase your skills</p>
                                    <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                                        Create Your First Gig
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <MotivationalQuotes />
                    </div>
                </div>
            </div>
            {/* Gig Detail Modal */}
            <GigDetailModal
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
            )}

        </div>
    );
};

export default MyGigsPage;
