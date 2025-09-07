"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Star,
    MapPin,
    MessageCircle,
    Phone,
    MoreHorizontal,
    ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import CallModal from "@/components/other-profile/CallModal";
import { usePaginatedReviews } from "@/hooks/review/useReviews";
import ReviewCard from "@/components/review/ReviewCard";
import ReviewPagination from "@/components/review/ReviewPagination";
import LeftSideProvider from "@/components/ui/LeftSideProvider";
import { useSingleUserSeeker } from "@/hooks/useSingleUserSeeker";
import { GigCard } from "@/components/gig/GigCard";
import MoreModalProvider from "@/components/other-profile/MoreModaProvider";
import Image from "next/image";
import { useMessageStore } from "@/store/messageStore";
import { CreateConversationData, CreateMessageData } from "@/types/message";
import { ErrorToast, SuccessToast } from "@/components/ui/Toast";
import clientLogger from "@/utils/logger";
import { useOnlineStatusIndicator } from "@/hooks/socket/useSocketOnlineUsers";

export default function UserProfilePage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    const { user: currentUser } = useAuthStore();

    const {
        reviews: reviewData,
        pagination,
        averageRating,
        isLoading: isLoadingReviews,
        currentPage,
        setCurrentPage,
    } = usePaginatedReviews(userId);

    const { user, userGigs, isLoading, isError } = useSingleUserSeeker(userId);

    const { isOnline: isOtherUserOnline } = useOnlineStatusIndicator(userId || '');

    const {
        createConversationAction,
        createMessageAction,
        error: messageError,
        clearError: clearMessageError
    } = useMessageStore();

    const [currentGigIndex, setCurrentGigIndex] = useState(0);
    const [moreModalVisible, setMoreModalVisible] = useState(false);
    const [callModalVisible, setCallModalVisible] = useState(false);
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);


    // Check if current user is verified
    const isCurrentUserVerified = currentUser?.isDocumentVerified === "verified";

    // Send message handler function
    const sendMessageHandler = useCallback(
        async (conversationId: string) => {
            if (!user?.username || !currentUser?.username || !user?._id) {
                ErrorToast("Missing required information to send message");
                return;
            }

            const messageData: CreateMessageData = {
                conversationId,
                msg: `Hello ${user.username}, I want to ask you something about your gig. Can we discuss? My username is ${currentUser.username}.`,
                recipientId: user._id,
            };

            try {
                const message = await createMessageAction(messageData);
                if (message) {
                    SuccessToast("Message sent successfully!");
                    // Navigate to chat page
                    router.push(`/dashboard/job-provider/chat/${conversationId}`);
                } else {
                    ErrorToast(messageError || "Failed to send message");
                }
            } catch (error) {
                ErrorToast("Failed to send message. Please try again.");
                clientLogger.error("Send message error:", error);
            } finally {
                setIsCreatingConversation(false);
            }
        },
        [user, currentUser, createMessageAction, messageError, router]
    );

    // Create conversation handler
    const createConversationHandler = useCallback(async () => {
        if (!currentUser?._id || !user?._id) {
            ErrorToast("Missing user information");
            return;
        }

        if (currentUser._id === user._id) {
            ErrorToast("You cannot message yourself");
            return;
        }

        setIsCreatingConversation(true);
        clearMessageError();

        const conversationData: CreateConversationData = {
            senderId: currentUser._id,
            receiverId: user._id,
        };

        try {
            const conversation = await createConversationAction(conversationData);
            if (conversation) {
                await sendMessageHandler(conversation._id);
            } else {
                ErrorToast(messageError || "Failed to create conversation");
                setIsCreatingConversation(false);
            }
        } catch (error) {
            ErrorToast("Failed to create conversation. Please try again.");
            clientLogger.error("Create conversation error:", error);
            setIsCreatingConversation(false);
        }
    }, [currentUser, user, createConversationAction, sendMessageHandler, messageError, clearMessageError]);

    const handleMessagePress = () => {
        if (!isCurrentUserVerified) {
            ErrorToast("You need to be verified to send messages.");
            return;
        }
        createConversationHandler();
    };

    const handleCallPress = () => {
        if (!isCurrentUserVerified) {
            alert("You need to be verified to make calls.");
            return;
        }
        setCallModalVisible(true);
    };

    const handleNextGig = () => {
        if (userGigs.length > 0) {
            setCurrentGigIndex((prev) => (prev + 1) % userGigs.length);
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        User Not Found
                    </h2>
                    <p className="text-gray-600">
                        The user you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const currentGig = userGigs[currentGigIndex];


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-7xl mx-auto px-2 sm:px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                    <LeftSideProvider />

                    {/* Main Content */}
                    <div className="lg:col-span-6 py-4 lg:py-6">
                        {/* Verification Notice for unverified users */}
                        {!isCurrentUserVerified && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                                <div className="flex items-start gap-2">
                                    <div className="w-5 h-5 text-yellow-600 mt-0.5">⚠️</div>
                                    <div>
                                        <h4 className="font-semibold text-yellow-800 text-sm sm:text-base">
                                            Verification Required
                                        </h4>
                                        <p className="text-yellow-700 text-xs sm:text-sm mt-1">
                                            Verify your document to access messaging, calling, and
                                            location features.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Profile Header */}
                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 lg:flex-row lg:items-start">
                                {/* Profile Picture */}
                                <div className="relative flex-shrink-0">
                                    <Image
                                        src={
                                            user.profilePic?.url || "https://picsum.photos/200/200"
                                        }
                                        alt={user.username}
                                        width={96}
                                        height={96}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-primary"
                                    />
                                </div>

                                {/* User Details */}
                                <div className="flex-1 text-center sm:text-left lg:text-left w-full">
                                    <div className="flex flex-col sm:flex-row lg:flex-row items-center sm:items-start lg:items-center gap-2 mb-2">
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                            {user.username}
                                        </h1>
                                        {user.isDocumentVerified === "verified" && (
                                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-3 h-3 text-white"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-center sm:justify-start lg:justify-start gap-1 mb-2">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="font-semibold text-gray-900">
                                            {averageRating?.toFixed(1) || "0.0"}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-3 leading-relaxed text-sm sm:text-base">
                                        {user.bio || (
                                            <span className="text-red-500 font-bold">No bio</span>
                                        )}
                                    </p>

                                    <div className="flex items-center justify-center sm:justify-start lg:justify-start gap-1 mb-3">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="text-gray-700 text-sm sm:text-base">
                                            {user.location || (
                                                <span className="text-red-500 font-bold">
                                                    No location
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="my-4">
                                        <span className='text-red-500 text-xs'>
                                            This may not be the exact location. It could be the nearest place to where the user is located.
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-center sm:justify-start lg:justify-start gap-1 mb-3">
                                            <span className={`text-gray-700 borderborder-black text-sm py-2 flex gap-x-2 px-4 rounded-md sm:text-base `}>
                                                User is
                                                <span className="font-semibold">
                                                    {isOtherUserOnline ? <span className="text-green-500">Online</span> : <span className="text-red-500">Offline</span>}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex sm:flex-row lg:flex-row items-stretch sm:items-center justify-between px-4 lg:px-0 lg:justify-between gap-3 sm:gap-2 lg:gap-2 mb-4 sm:mb-6">
                            <button
                                onClick={handleMessagePress}
                                className={`flex items-center justify-center gap-2 text-white px-4 sm:px-6 lg:px-10 py-3 sm:py-2 rounded-md font-semibold transition-colors ${isCurrentUserVerified && !isCreatingConversation
                                    ? "bg-primary hover:bg-primary/90"
                                    : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                disabled={!isCurrentUserVerified || isCreatingConversation}
                            >
                                {isCreatingConversation ? (
                                    <div className="w-[17px] h-[17px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <MessageCircle size={17} />
                                )}
                                <span className="text-sm sm:text-base">
                                    {isCreatingConversation ? "Sending..." : "Message"}
                                </span>
                            </button>

                            <button
                                onClick={handleCallPress}
                                className={`flex items-center justify-center gap-2 text-white px-4 sm:px-8 lg:px-20 py-3 sm:py-2 rounded-md font-semibold transition-colors ${isCurrentUserVerified
                                    ? "bg-primary hover:bg-primary/90"
                                    : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                disabled={!isCurrentUserVerified}
                            >
                                <Phone size={17} />
                                <span className="text-sm sm:text-base">Call</span>
                            </button>

                            <button
                                onClick={() => setMoreModalVisible(true)}
                                className="flex items-center justify-center gap-2 disabled:opacity-50 bg-primary text-white px-4 sm:px-6 lg:px-10 py-3 sm:py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors"
                                disabled={!isCurrentUserVerified}
                            >
                                <MoreHorizontal size={17} />
                                <span className="text-sm sm:text-base">More</span>
                            </button>
                        </div>

                        {/* About Me Section */}
                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                                About me
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                {user.about_me || (
                                    <span className="text-red-500 font-bold">No about me</span>
                                )}
                            </p>
                        </div>
                        {/* Skills */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-3">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skills && user.skills.length > 0 ? (
                                    user.skills.map((skill: string, index: number) => (
                                        <span
                                            key={index}
                                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No skills listed</p>
                                )}
                            </div>
                        </div>

                        {/* Gigs Section */}
                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                                Gigs
                            </h2>

                            {userGigs.length > 0 ? (
                                <div className="space-y-3 sm:space-y-4">
                                    <GigCard
                                        gig={currentGig}
                                    />

                                    {userGigs.length > 1 && (
                                        <button
                                            onClick={handleNextGig}
                                            disabled={!isCurrentUserVerified}
                                            className="w-full bg-primary disabled:opacity-50 text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                                        >
                                            <span>
                                                Next Gig ({currentGigIndex + 1} of {userGigs.length})
                                            </span>
                                            <ChevronRight size={20} />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6 sm:py-8">
                                    <p className="text-gray-500 text-sm sm:text-base">
                                        No Gigs available
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <div className="sticky top-6 space-y-6">
                            {/* User Stats */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">User Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Completed Jobs</span>
                                        <span className="font-bold text-primary">
                                            {user.totalCompletedJobs || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Average Rating</span>
                                        <span className="font-bold text-yellow-500">
                                            {averageRating?.toFixed(1) || "0.0"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">User Income</span>
                                        <span className="font-bold text-green-600">
                                            Rs. {user.totalIncome || 0} 
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Verified</span>
                                        <span
                                            className={`font-bold ${user.isDocumentVerified === "verified"
                                                ? "text-green-600"
                                                : "text-red-600"
                                                }`}
                                        >
                                            {user.isDocumentVerified === "verified" ? "Yes" : "No"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Jobs</span>
                                        <span className="font-bold text-blue-600">
                                            {userGigs.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Reviews List */}
                            <div className="space-y-4">
                                {isLoadingReviews ? (
                                    <p className="text-primary">Loading...</p>
                                ) : (
                                    <p className="text-gray-700">
                                        Total {pagination?.totalReviews || 0} Reviews
                                    </p>
                                )}

                                {!isLoadingReviews && reviewData.length > 0 && (
                                    <>
                                        <div className="space-y-4">
                                            {reviewData.map((reviewItem) => (
                                                <ReviewCard key={reviewItem._id} data={reviewItem} />
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        <ReviewPagination
                                            pagination={pagination}
                                            currentPage={currentPage}
                                            onPageChange={setCurrentPage}
                                            isLoading={isLoadingReviews}
                                        />
                                    </>
                                )}

                                {!isLoadingReviews && reviewData.length === 0 && (
                                    <p className="text-red-500 font-bold">No review found</p>
                                )}
                            </div>

                            {/* Skills */}
                            {/* <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills && user.skills.length > 0 ? (
                                        user.skills.map((skill: string, index: number) => (
                                            <span
                                                key={index}
                                                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No skills listed</p>
                                    )}
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Mobile Stats Section - Visible only on mobile */}
                    <div className="lg:hidden mt-4 space-y-4">
                        {/* User Stats */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-3">User Stats</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <span className="block text-xs text-gray-600">
                                        Completed Jobs
                                    </span>
                                    <span className="font-bold text-primary">
                                        {user.totalCompletedJobs || 0}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-xs text-gray-600">
                                        Average Rating
                                    </span>
                                    <span className="font-bold text-yellow-500">
                                        {averageRating?.toFixed(1) || "0.0"}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-xs text-gray-600">User Income</span>
                                    <span className="font-bold text-green-600">
                                        Rs. {user.totalIncome || 0}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-xs text-gray-600">Verified</span>
                                    <span
                                        className={`font-bold ${user.isDocumentVerified === "verified"
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        {user.isDocumentVerified === "verified" ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Reviews List */}
                        <div className="space-y-4">
                            {isLoadingReviews ? (
                                <p className="text-primary">Loading...</p>
                            ) : (
                                <p className="text-gray-700">
                                    Total {pagination?.totalReviews || 0} Reviews
                                </p>
                            )}

                            {!isLoadingReviews && reviewData.length > 0 && (
                                <>
                                    <div className="space-y-4">
                                        {reviewData.map((reviewItem) => (
                                            <ReviewCard key={reviewItem._id} data={reviewItem} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <ReviewPagination
                                        pagination={pagination}
                                        currentPage={currentPage}
                                        onPageChange={setCurrentPage}
                                        isLoading={isLoadingReviews}
                                    />
                                </>
                            )}

                            {!isLoadingReviews && reviewData.length === 0 && (
                                <p className="text-red-500 font-bold">No review found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CallModal
                isOpen={callModalVisible}
                onClose={() => setCallModalVisible(false)}
                phoneNumber={user.phoneNumber}
                isCurrentUserVerified={isCurrentUserVerified}
            />

            <MoreModalProvider
                isOpen={moreModalVisible}
                onClose={() => setMoreModalVisible(false)}
                userAddress={user.location}
                userLatitude={user.address?.coordinates?.[1]}
                userLongitude={user.address?.coordinates?.[0]}
                isCurrentUserVerified={isCurrentUserVerified}
            />
        </div>
    );
}
