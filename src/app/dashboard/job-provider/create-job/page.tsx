"use client";

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, X, Image as ImageIcon } from 'lucide-react';
import { Formik } from 'formik';
import { MotivationalQuotes } from '@/components/ui/MotivationalQuotes';
import { SuccessToast, ErrorToast } from '@/components/ui/Toast';
import { category, experiesHours, payment_method, Skills_data } from '@/utils/data/data';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { useJobStore } from '@/store/jobStore';
import { useEnsureAuth } from '@/hooks/useEnsureAuth';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import CreateJobTips from '@/components/ui/CreateJobTips';
import { JobI } from '@/types/job';
import AutoSuggestionGeoLocation from '@/components/geolocation/AutoSuggestionGeoLocation';
import { useAuthStore } from '@/store/authStore';
import { jobSchema } from '@/types/schema/jobSchema';
import Loader from '@/components/global/Loader';
import { initialValues } from '@/types/job-provider/create-job';

const CreateJobPage = () => {
    const router = useRouter();
    const { isReady, isLoading } = useEnsureAuth();
    const { user } = useAuthStore();
    const { createJob } = useJobStore();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [locationName, setLocationName] = useState<string>('');
    const [geometry, setGeometry] = useState<{ coordinates: number[]; type: string }>({
        coordinates: [],
        type: 'Point',
    });
    const [selectedSkills, setSelectedSkills] = useState<number[]>([]);


    /**
     * @function handleSubmit
     * @param values values for Job
     * @returns Message to the user if the Job is successfully created or not
     * @description this function is for creating the jobs
     */
    const handleSubmit = useCallback(async (values: JobI) => {
        //validation
        try {
            jobSchema.parse(values);
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0]?.message || "Validation failed";
                ErrorToast(firstError);
                return;
            }
        }
        const skillsRequired = selectedSkills.map(
            (index: number) => Skills_data[index - 1]?.name
        ).filter(Boolean);

        if (!locationName || !geometry || !geometry.coordinates || skillsRequired.length === 0) {
            setIsSubmitting(false);
            ErrorToast('Please select a location');
            return;
        }


        if (!isReady) {
            ErrorToast("Authentication not ready to proceed, Login Again!");
            return;
        }

        setIsSubmitting(true);
        try {
            //Creating the job
            const newValues = {
                ...values,
                skills_required: skillsRequired,
                location: locationName,
                latitude: geometry?.coordinates?.[1],
                longitude: geometry?.coordinates?.[0],
                phoneNumber: user?.phoneNumber || '9804077722',
            }

            const response = await createJob(newValues);
            if (response.success) {
                SuccessToast("Successfully Created your Job!");
                router.push('/dashboard/job-provider/my-jobs');
            } else {
                ErrorToast(response.error || "Failed to create job. Please try again.");
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Failed to Create the Job!';
                ErrorToast(errorMessage);
            } else {
                ErrorToast('An error occurred while creating your job');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [isReady, selectedSkills, geometry, locationName, router]);

    const toggleSkill = (skillId: number) => {
        setSelectedSkills(prev =>
            prev.includes(skillId)
                ? prev.filter(id => id !== skillId)
                : [...prev, skillId]
        );
    };

    if(isLoading){
        return <Loader/>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <CreateJobTips />
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
                                    Create a <span className="text-primary">Job</span>
                                </h1>
                                <p className="text-gray-600">Share Jobs with Others</p>
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
                                                Job Title *
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
                                                Job Description *
                                            </label>
                                            <RichTextEditor
                                                value={values.job_description}
                                                onChange={(value) => setFieldValue('job_description', value)}
                                                placeholder="Describe what type of job you're offering..."
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
                                                    {category.map(category => (
                                                        <option key={category.id} value={category.name}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {/* Location */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-medium text-black">
                                                    Location
                                                </label>
                                                {locationName && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setLocationName('');
                                                            setGeometry({ coordinates: [], type: 'Point' });
                                                        }}
                                                        className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-red-200 text-red-600 hover:text-red-700 transition-colors"
                                                        title="Clear location"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                            <AutoSuggestionGeoLocation
                                                setGeometry={setGeometry}
                                                setLocationName={setLocationName}
                                            />
                                            <div className='flex gap-x-2 mt-2'>
                                                <span className='text-black text-sm font-semibold'>Location: </span>
                                                <span className='text-primary'>{locationName || 'Not selected'}</span>
                                            </div>
                                        </div>

                                        {/* skills section start -- */}
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-2">
                                                Required Skills
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                                                {Skills_data.map((skill) => (
                                                    <button
                                                        key={skill.id}
                                                        type="button"
                                                        onClick={() => toggleSkill(skill.id)}
                                                        className={`p-2 rounded-md border border-black text-sm font-medium transition-colors ${selectedSkills.includes(skill.id)
                                                            ? 'bg-primary text-white'
                                                            : 'text-gray-700'
                                                            }`}
                                                    >
                                                        {skill.name}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Selected Skills Display */}
                                            {selectedSkills.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedSkills.map((skillId) => {
                                                        const skill = Skills_data.find(s => s.id === skillId);
                                                        return skill ? (
                                                            <span
                                                                key={skillId}
                                                                className="bg-gray-300 border border-black text-black px-2 py-1 rounded-md text-sm"
                                                            >
                                                                {skill.name}
                                                            </span>
                                                        ) : null;
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        {/* skills section end ---  */}

                                        {/* Expires in hrs section start --- */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Set Expiry Time *
                                            </label>
                                            <select
                                                className="w-full px-4 py-3 border border-green-100 rounded-lg"
                                                onChange={handleChange('experiesInHrs')}
                                                onBlur={handleBlur('experiesInHrs')}
                                                value={values.experiesInHrs}
                                            >
                                                <option value="">Select Expiry time</option>
                                                {experiesHours.map(hour => (
                                                    <option key={hour.id} value={hour.value}>
                                                        {hour.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Expires in hrs section end --- */}

                                        {/* ----payment method start --- */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Set Payment method * ("Default Cash: Online payment is not available yet")
                                            </label>
                                            <select
                                                className="w-full px-4 py-3 border border-green-100 rounded-lg"
                                                onChange={handleChange('payment_method')}
                                                onBlur={handleBlur('payment_method')}
                                                value={values.payment_method}
                                            >
                                                <option value="">Select Payment Method</option>
                                                {payment_method.map(method => (
                                                    <option key={method.id} value={method.name}>
                                                        {method.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* ------payment method end ------- */}

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
                                                    Creating Job...
                                                </div>
                                            ) : (
                                                'Create Job'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </Formik>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 py-6">
                        <MotivationalQuotes isProvider={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateJobPage;

