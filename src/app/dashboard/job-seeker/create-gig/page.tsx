"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, X, Image as ImageIcon } from 'lucide-react';
import { Formik } from 'formik';
import CreateGigTips from '@/components/ui/CreateGigTips';
import { MotivationalQuotes } from '@/components/ui/MotivationalQuotes';
import { SuccessToast, ErrorToast } from '@/components/ui/Toast';
import { Skills_data } from '@/utils/data/data';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { uploadGigImages } from '@/lib/gig/gig-api';
import { useGigStore } from '@/store/gigStore';
import { useEnsureAuth } from '@/hooks/useEnsureAuth';
import { GigI } from '@/types/gig';
import { AxiosError } from 'axios';
import { gigSchema } from '@/types/schema/gigSchema';
import { ZodError } from 'zod';

const initialValues: GigI = {
    title: '',
    price: 500,
    category: '',
    gig_description: ''
};

const CreateGigPage = () => {
    const router = useRouter();
    const { isReady, isLoading } = useEnsureAuth();
    const { createGig } = useGigStore();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    /**
     * @function handleImageUpload
     * @description this function is for handling the image upload
     * @param e event of the input element
     */
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxImages = 3;

        if (files.length > maxImages) {
            ErrorToast(`Maximum ${maxImages} images allowed`);
            return;
        }

        setImages(files);

        // Create previews
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    /**
     * @function handleSubmit
     * @param values values for Gig 
     * @returns Message to the user if the Gig is successfully created or not
     * @description this function is for creating the gigs
     */
    const handleSubmit = async (values: GigI) => {
        try {
            //validation
            gigSchema.parse(values);
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Validation failed";
                ErrorToast(firstError);
                return;
            }
        }

        if (images.length === 0) {
            ErrorToast('Please add at least one image');
            return;
        }

        if (!isReady) {
            ErrorToast("Authentication not ready to proceed, Login Again!");
            return;
        }

        setIsSubmitting(true);
        try {
            // Create FormData for image upload
            const formData = new FormData();
            images.forEach(image => {
                formData.append('files', image);
            });
            //uploading the image
            const responseImage = await uploadGigImages(formData);
            if (responseImage?.status !== 201) {
                ErrorToast("Something went wrong uploading your image, Please try again later!");
                return;
            }
            //Creating the gig
            const newValues = {
                ...values
            }

            const responseGig = await createGig(responseImage?.data?.imagesData?._id, newValues);
            if (responseGig.status === "success") {
                SuccessToast("Successfully Created your Gig!");
                router.push('/dashboard/job-seeker/my-gigs');
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Failed to Create the Gig!';
                ErrorToast(errorMessage);
            } else {
                ErrorToast('An error occurred while creating your gig');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <CreateGigTips />
                    </div>

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
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    Create a <span className="text-primary">Gig</span>
                                </h1>
                                <p className="text-gray-600">Share your skills with Other</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <Formik
                                initialValues={initialValues}
                                onSubmit={handleSubmit}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                                    <div className="space-y-6">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Gig Title *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="I will provide home services at any time."
                                                className="w-full px-4 py-3 border border-green-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                onChange={handleChange('title')}
                                                onBlur={handleBlur('title')}
                                                value={values.title}
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Gig Description *
                                            </label>
                                            <RichTextEditor
                                                value={values.gig_description}
                                                onChange={(value) => setFieldValue('gig_description', value)}
                                                placeholder="Describe what you'll deliver, your process, and what makes your service unique..."
                                                height="250px"
                                            />
                                        </div>

                                        {/* Price and Category */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                                    Price (₹) *
                                                </label>
                                                <input
                                                    type="number"
                                                    min="500"
                                                    placeholder="500"
                                                    className="w-full px-4 py-3 border border-green-100 rounded-lg "
                                                    onChange={handleChange('price')}
                                                    onBlur={handleBlur('price')}
                                                    value={values.price}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                                    Category *
                                                </label>
                                                <select
                                                    className="w-full px-4 py-3 border border-green-100 rounded-lg"
                                                    onChange={handleChange('category')}
                                                    onBlur={handleBlur('category')}
                                                    value={values.category}
                                                >
                                                    <option value="">Select Category</option>
                                                    {Skills_data.map(category => (
                                                        <option key={category.id} value={category.name}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Image Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Gig Images * (Max 3) (Banner)
                                            </label>
                                            <div className="border-2 border-dashed border-green-200 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <label htmlFor="image-upload" className="cursor-pointer">
                                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                    <p className="text-gray-600 mb-2">Click to upload images</p>
                                                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB each</p>
                                                </label>
                                            </div>

                                            {/* Image Previews */}
                                            {imagePreviews.length > 0 && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium text-gray-900 mb-2">Preview</p>
                                                    <div className="flex gap-4 overflow-x-auto">
                                                        {imagePreviews.map((preview, index) => (
                                                            <div key={index} className="relative flex-shrink-0">
                                                                <img
                                                                    src={preview}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className="w-24 h-24 object-cover rounded-lg"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(index)}
                                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleSubmit()}
                                            disabled={isSubmitting}
                                            className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Creating Gig...
                                                </div>
                                            ) : (
                                                'Create Gig'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </Formik>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <MotivationalQuotes isProvider={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateGigPage;

