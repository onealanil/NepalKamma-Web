"use client";

import { CompletedJob } from "@/types/job-provider/CompletedJob";
import { CreditCard, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ErrorToast, SuccessToast } from "@/components/ui/Toast";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

// Request Payment Modal Component
const RequestPaymentModal = ({
    isOpen,
    onClose,
    data,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    data: CompletedJob | null;
    onSuccess?: () => void;
}) => {
    const [khaltiNumber, setKhaltiNumber] = useState('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isRequesting, setIsRequesting] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setKhaltiNumber('');
            setSelectedImages([]);
            setPreviewImages([]);
            setErrors({});
            setIsRequesting(false);
        }
    }, [isOpen]);

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            previewImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewImages]);

    if (!isOpen || !data) return null;

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const maxImages = 2;

        // Clear previous errors
        setErrors(prev => ({ ...prev, images: '' }));

        if (files.length === 0) {
            return;
        }

        if (files.length > maxImages) {
            ErrorToast(`You can only upload up to ${maxImages} images`);
            return;
        }

        // Validate file types and sizes
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        for (const file of files) {
            if (!validTypes.includes(file.type)) {
                ErrorToast('Please upload only JPEG, PNG, or WebP images');
                return;
            }
            if (file.size > maxSize) {
                ErrorToast('Each image must be less than 5MB');
                return;
            }
        }

        // Take only first 2 images
        const twoImages = files.slice(0, 2);
        setSelectedImages(twoImages);

        // Cleanup previous preview URLs
        previewImages.forEach(url => URL.revokeObjectURL(url));

        // Create new preview URLs
        const previews = twoImages.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    /**
     * @function updateKhaltiNumber
     * @description Updates the Khalti number for the payment
     */
    const updateKhaltiNumber = async () => {
        try {
            const response = await axiosInstance.put(
                `/payment/updateKhalitNumber/${data?._id}`,
                {
                    recieverNumber: khaltiNumber,
                }
            );
            if (response.status !== 200) {
                throw new Error('Failed to update khalti number');
            }
            SuccessToast('Khalti Number added successfully');
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Failed to update khalti number';
                ErrorToast(errorMessage);
            } else {
                ErrorToast('An error occurred while updating khalti number');
            }
            throw error;
        }
    };

    /**
     * @function validateForm
     * @description Validates the form before submission
     */
    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};

        if (!data?._id) {
            ErrorToast('Something went wrong, Please try again later');
            return false;
        }

        // Validate Khalti number for online payments
        if (data?.paymentType === 'online' && (!khaltiNumber || khaltiNumber.trim() === '')) {
            newErrors.khaltiNumber = 'Please Add your Khalti Number';
            ErrorToast('Please Add your Khalti Number');
            return false;
        }

        // Validate images
        if (!Array.isArray(selectedImages) || selectedImages.length === 0) {
            newErrors.images = 'Please add images';
            ErrorToast('Please add images');
            return false;
        }

        if (selectedImages.length !== 2) {
            newErrors.images = 'Upload exactly 2 images';
            ErrorToast('Upload exactly 2 images');
            return false;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * @function handleSubmit
     * @description Handles the payment request submission
     */
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsRequesting(true);

        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Append each image with the key "files"
            for (let i = 0; i < selectedImages.length; i++) {
                formData.append('files', selectedImages[i]);
            }

            // Submit payment request with images
            const response = await axiosInstance.put(
                `/payment/requestPayment/${data?._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error('Failed to submit payment request');
            }

            // Update Khalti number if it's an online payment
            if (data?.paymentType === 'online' && khaltiNumber.trim()) {
                await updateKhaltiNumber();
            }

            SuccessToast('Payment request submitted successfully');

            // Call success callback if provided
            if (onSuccess) {
                onSuccess();
            }

            onClose();

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Failed to submit payment request';
                ErrorToast(errorMessage);
            } else {
                ErrorToast('An error occurred while submitting your request');
            }
        } finally {
            setIsRequesting(false);
        }
    };

    const deductedAmount = data.amount * 0.95; // 5% deduction

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Request Payment</h2>
                            <p className="text-sm text-gray-500">Payment Confirmation slip</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Payment Amount Info - Only show for non-cash payments */}
                    {data?.paymentType !== 'cash' && (
                        <>
                            <div className="mb-6">
                                <p className="text-gray-700 mb-2 font-bold">
                                    Payment You will received after 5% deduction
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    Rs.{Math.floor(deductedAmount)}/-
                                </p>
                            </div>

                            {/* Note for online payments */}
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                                <p className="text-red-600 text-sm text-center font-bold">
                                    <span className="font-medium">Note:</span> Enter your khalti number correctly. Payment will be sent to the provided khalti number.
                                </p>
                            </div>

                            {/* Khalti Number Input */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Enter your Khalti Number
                                </label>
                                <input
                                    type="text"
                                    value={khaltiNumber}
                                    onChange={(e) => {
                                        setKhaltiNumber(e.target.value);
                                        if (errors.khaltiNumber) {
                                            setErrors(prev => ({ ...prev, khaltiNumber: '' }));
                                        }
                                    }}
                                    placeholder="9803234563"
                                    className={`w-full px-4 py-3 bg-green-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                        errors.khaltiNumber ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {errors.khaltiNumber && (
                                    <p className="text-red-500 text-sm mt-1">{errors.khaltiNumber}</p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Upload Note */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-red-600 text-sm text-center font-bold">
                            <span className="font-medium">Note:</span> {
                                data?.paymentType !== 'cash'
                                    ? 'Upload the Screenshot of confirmation message between you and job provider or any other proof of payment. It is mandatory and with this proof we acknowledge that you have received the payment. And this proof will boost your profile and you will get more job opportunities.'
                                    : 'Upload the Screenshot of confirmation message between you and job provider or any other proof of payment. It is mandatory and with this proof we acknowledge that you have received the payment. And this proof will boost your profile and you will get more job opportunities.'
                            } 
                        </p>
                    </div>

                    {/* Image Upload */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Add Images
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                        />

                        <label
                            htmlFor="image-upload"
                            className={`w-full py-3 px-4 bg-green-50 border rounded-lg flex items-center justify-center cursor-pointer hover:bg-green-100 transition-colors ${
                                errors.images ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <div className="text-center">
                                <p className="text-gray-700 font-semibold">
                                    {selectedImages.length === 0 ? 'Click to add images' : 'Images added'}
                                </p>
                            </div>
                        </label>

                        {errors.images && (
                            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                        )}

                        {selectedImages.length > 0 && (
                            <div className="mt-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <p className="text-gray-700 font-medium">Preview</p>
                                    <p className="text-red-500 text-sm">
                                        Only First 2 images will be selected
                                    </p>
                                </div>

                                <div className="flex gap-3 overflow-x-auto">
                                    {previewImages.slice(0, 2).map((preview: string, index: number) => (
                                        <div key={index} className="relative flex-shrink-0">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-24 h-32 object-cover rounded-lg border border-gray-200"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isRequesting}
                        className={`w-full py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                            isRequesting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                        } text-white`}
                    >
                        <CreditCard size={20} />
                        {isRequesting ? 'Requesting...' : 'Request Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestPaymentModal;