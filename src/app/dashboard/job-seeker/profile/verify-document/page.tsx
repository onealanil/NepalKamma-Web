"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { SuccessToast, ErrorToast } from '@/components/ui/Toast';
import { AxiosError } from 'axios';
import Loader from '@/components/global/Loader';
import { MotivationalQuotes } from '@/components/ui/MotivationalQuotes';
import SkillsGuide from '@/components/ui/SkillsGuide';
import { X, Upload, Phone, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function VerifyDocument() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [images, setImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImagePicker = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = (e) => {
            const files = Array.from((e.target as HTMLInputElement).files || []);
            setImages(files.slice(0, 2)); // Only first 2 images
        };
        input.click();
    }, []);

    const verifyDocumentHandler = useCallback(async () => {
        if (images.length === 0) {
            ErrorToast('Please select at least one document image');
            return;
        }

        setIsSubmitting(true);
        try {
            // Add your document verification API call here
            // const response = await verifyDocument(formData);
            
            SuccessToast('Document verification request submitted successfully');
            router.push('/dashboard/job-seeker/profile');
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Failed to submit verification request';
                ErrorToast(errorMessage);
            } else {
                ErrorToast('An error occurred while submitting verification request');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [images, router]);

    if (!user) {
        return <Loader />
    }

    const renderVerifiedContent = () => (
        <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">Document Verified</h3>
                </div>
                <p className="text-green-700">
                    Your documents are verified. You can now create a gig.
                </p>
            </div>

            {/* Phone Number Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Phone Number</h4>
                        {/* <p className="text-primary font-medium">{user?.phoneNumber || 'Not added'}</p> */}
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/job-seeker/phone-verify')}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                    >
                        <Phone className="w-4 h-4" />
                        {user?.phoneNumber ? 'Change' : 'Add'}
                    </button>
                </div>
            </div>

            {/* Documents Preview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Verified Documents</h4>
                <div className="grid grid-cols-2 gap-4">
                    {user?.documents?.map((doc: any, index: number) => (
                        <img
                            key={index}
                            src={doc.url}
                            alt={`Document ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPendingContent = () => (
        <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-yellow-800">Verification Pending</h3>
                </div>
                <p className="text-yellow-700 mb-4">
                    Your documents are pending. NepalKamma is currently reviewing them. 
                    We will email you once your documents have been verified. Thank you for your patience.
                </p>
                <button
                    onClick={() => router.push('/dashboard/job-seeker/profile')}
                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                    Go to Profile
                </button>
            </div>
        </div>
    );

    const renderUnverifiedContent = () => (
        <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-800">Document Verification Required</h3>
                </div>
                <p className="text-red-700">
                    Note: You can't create a gig without verifying your document. This is to ensure that you are a real person and not a bot.
                </p>
            </div>

            {/* Phone Number Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Phone Number</h4>
                        {/* <p className="text-primary font-medium">{user?.phoneNumber || 'Not added'}</p> */}
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/job-seeker/phone-verify')}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                    >
                        <Phone className="w-4 h-4" />
                        {user?.phoneNumber ? 'Change' : 'Add'}
                    </button>
                </div>
            </div>

            {/* Document Upload Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700 text-sm">
                        Note: You can upload your citizenship card or passport or driving license. 
                        Please make sure the document is clear and visible.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Add Images
                        </label>
                        <button
                            onClick={handleImagePicker}
                            className="w-full bg-green-50 border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:bg-green-100 transition-colors"
                        >
                            <Upload className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-green-700 font-medium">
                                {images.length === 0 ? 'Click to add images' : `${images.length} image(s) selected`}
                            </p>
                        </button>
                    </div>

                    {/* Image Preview */}
                    {images.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <h4 className="text-sm font-medium text-gray-900">Preview</h4>
                                <p className="text-red-500 text-xs">
                                    Only first 2 images will be selected
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {images.slice(0, 2).map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Document ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={verifyDocumentHandler}
                        disabled={isSubmitting || images.length === 0}
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Requesting...' : 'Request Verification'}
                    </button>
                </div>
            </div>
        </div>
    );

    const getContent = () => {
        switch (user?.isDocumentVerified) {
            case 'verified':
                return renderVerifiedContent();
            case 'Pending':
                return renderPendingContent();
            default:
                return renderUnverifiedContent();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                    <SkillsGuide />
                    
                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        <div className="max-w-2xl mx-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    Verify Document
                                </h1>
                                <p className="text-gray-600">
                                    Complete your document verification to start creating gigs
                                </p>
                            </div>

                            {/* Content */}
                            {getContent()}
                        </div>
                    </div>

                    {/* Right Sidebar - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <MotivationalQuotes />
                    </div>
                </div>
            </div>
        </div>
    );
}