"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { SuccessToast, ErrorToast } from '@/components/ui/Toast';
import axios, { AxiosError } from 'axios';
import Loader from '@/components/global/Loader';
import { MotivationalQuotes } from '@/components/ui/MotivationalQuotes';
import SkillsGuide from '@/components/ui/SkillsGuide';
import { ArrowLeft, Phone } from 'lucide-react';
import Image from 'next/image';
import { updatePhoneNumber } from '@/lib/profile/profile-api';
import { useEnsureAuth } from '@/hooks/useEnsureAuth';

/**
 * @function VerifyPhone
 * @description This page is used to verify the phone number of the user
 * @returns {JSX.Element}
 */
export default function VerifyPhone(){
    const router = useRouter();
    const { isReady, isLoading } = useEnsureAuth();
    const { user } = useAuthStore();
    const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || '');
    const [countryCode, setCountryCode] = useState<string>('+977');
    const [isVerifying, setIsVerifying] = useState<boolean>(false);

    /**
     * @function validatePhoneNumber
     * @description Validate the phone number
     * @param phone {string} it is the phone number
     * @returns boolean
     */
    const validatePhoneNumber = async (phone: string): Promise<boolean> => {
        const nepalPhoneRegex = /^9[0-9]{9}$/;
        const isValid = nepalPhoneRegex.test(phone);

        if (isValid) {
            const options = {
                method: 'GET',
                url: 'https://phonenumbervalidatefree.p.rapidapi.com/ts_PhoneNumberValidateTest.jsp',
                params: {
                    number: phone,
                    country: 977,
                },
                headers: {
                    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
                    'X-RapidAPI-Host': 'phonenumbervalidatefree.p.rapidapi.com',
                },
            };

            try {
                const response = await axios.request(options);
                if (response?.data.E164Format !== 'Invalid') {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                ErrorToast('An error occurred while validating phone number, Try again Later');
                return false;
            }
        } else {
            return false;
        }
    };

    /**
     * @function updatePhoneDatabase
     * @returns void
     * @description Update the phone number in the database
     */
    const updatePhoneDatabase = async () => {
        if (!isReady) {
            ErrorToast('Authentication not ready');
            return;
        }

        try {
            const response = await updatePhoneNumber(phoneNumber);
            if (response.status === 200) {
                SuccessToast('Phone number added successfully');
            }
            // router.push('/dashboard/job-seeker/profile');
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Failed to update phone number';
                ErrorToast(errorMessage);
            } else {
                ErrorToast('An error occurred while updating phone number');
            }
        } finally {
            setIsVerifying(false);
        }
    };

    /**
     * @function handlePhoneVerification
     * @description Handle the phone verification button click
     * @returns void
     */
    const handlePhoneVerification = async () => {
        try {
            if (!phoneNumber) {
                ErrorToast('Please enter a phone number');
                return;
            }
            setIsVerifying(true);
            const isValid = await validatePhoneNumber(phoneNumber);
            if (!isValid) {
                ErrorToast('Invalid phone number!');
                return;
            }

            await updatePhoneDatabase();
        }
        catch (error) {
            ErrorToast('An error occurred while validating phone number, Try again Later');
        }
        finally {
            setIsVerifying(false);
        }
    };

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                    <SkillsGuide />

                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        <div className="max-w-2xl mx-auto">
                            {/* Header with Back Button */}
                            <div className="flex items-center gap-4 mb-6">
                                <button
                                    onClick={() => router.push('/dashboard/job-seeker/profile')}
                                    className="p-2 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Verify Phone Number
                                    </h1>
                                    <p className="text-gray-600">
                                        Add your phone number to complete your profile
                                    </p>
                                </div>
                            </div>

                            {/* Logo Section */}
                            <div className="flex justify-center mb-8">
                                <Image
                                    src="/images/NepalKamma.png"
                                    alt="NepalKamma Logo"
                                    width={240}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>

                            {/* Phone Input Section */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                                            Enter a phone number
                                        </label>

                                        {/* Phone Input */}
                                        <div className="space-y-4">
                                            {/* Country Code Selector */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Country Code
                                                </label>
                                                <select
                                                    value={countryCode}
                                                    onChange={(e) => setCountryCode(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                >
                                                    <option value="+977">🇳🇵 Nepal (+977)</option>
                                                </select>
                                            </div>

                                            {/* Phone Number Input */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Phone className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        placeholder="9812345678"
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        autoFocus
                                                    />
                                                </div>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Enter your phone number without country code
                                                </p>
                                            </div>

                                            {/* Preview */}
                                            {phoneNumber && (
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-sm text-gray-600">Preview:</p>
                                                    <p className="font-medium text-gray-900">
                                                        {countryCode} {phoneNumber}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Verify Button */}
                                    <button
                                        onClick={handlePhoneVerification}
                                        disabled={isVerifying || !phoneNumber}
                                        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isVerifying ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            'Verify'
                                        )}
                                    </button>

                                    {/* Info Note */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-blue-700 text-sm">
                                            <strong>Note:</strong> Your phone number will be used for account verification and important notifications. We will not share it with third parties.
                                        </p>
                                    </div>
                                </div>
                            </div>
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
