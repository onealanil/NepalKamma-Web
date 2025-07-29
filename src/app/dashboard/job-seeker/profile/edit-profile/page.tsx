
"use client";

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Formik } from 'formik';
import { SuccessToast, ErrorToast } from '@/components/ui/Toast';
import { updateProfile } from '@/lib/auth';
import { AxiosError } from 'axios';
import { Skills_data } from '@/utils/data/data';
import Loader from '@/components/global/Loader';
import { MotivationalQuotes } from '@/components/ui/MotivationalQuotes';
import SkillsGuide from '@/components/ui/SkillsGuide';

interface EditProfileProps {
    username: string;
    title: string;
    bio: string;
    about_me: string;
}

interface Geometry {
    coordinates: number[];
    type: string;
}

const GeoLocationComponent = ({
    setGeometry,
    setLocationName
}: {
    setGeometry: (geometry: Geometry) => void;
    setLocationName: (name: string) => void;
}) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');

    //   const fetchSuggestions = async (value: string) => {
    //     if (!value) {
    //       setSuggestions([]);
    //       return;
    //     }

    //     const apiKey = process.env.NEXT_PUBLIC_GEO_API_KEY;
    //     const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
    //       `${value},Nepal`
    //     )}&limit=5&apiKey=${apiKey}`;

    //     try {
    //       const response = await fetch(url);
    //       const data = await response.json();
    //       setSuggestions(data.features);
    //     } catch (error) {
    //       console.error('Error fetching suggestions:', error);
    //     }
    //   };

    const handleSuggestionClick = (place: any) => {
        const locationName = place.properties.formatted || place.properties.city;
        setInputValue(locationName);
        setSuggestions([]);
        setGeometry(place.geometry);
        setLocationName(locationName);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    //   fetchSuggestions(e.target.value);
                }}
                placeholder="Search location..."
                className="w-full px-4 py-3 rounded-md border border-border focus:outline-none text-black placeholder-gray-400"
            />
            {suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {suggestions.map((place, index) => (
                        <div
                            key={index}
                            onClick={() => handleSuggestionClick(place)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                        >
                            <span className="text-gray-900">
                                {place.properties.formatted || place.properties.city}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function EditProfile() {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
    const [locationName, setLocationName] = useState<string>('');
    const [geometry, setGeometry] = useState<Geometry>({ coordinates: [], type: 'Point' });
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = useMemo(
        () => ({
            username: typeof user?.username === 'string' ? user.username : '',
            title: typeof user?.title === 'string' ? user.title : '',
            bio: typeof user?.bio === 'string' ? user.bio : '',
            about_me: typeof user?.about_me === 'string' ? user.about_me : '',
        }),
        [user],
    );

    const handleEditProfile = useCallback(
        async (values: EditProfileProps) => {
            if (!user) return;

            setIsLoading(true);
            try {
                const skillsRequired = selectedSkills.map(
                    (index: number) => Skills_data[index - 1]?.name
                ).filter(Boolean);

                const newValues = {
                    ...values,
                    skills: skillsRequired,
                    location: locationName,
                    latitude: geometry.coordinates[1],
                    longitude: geometry.coordinates[0],
                };

                const response = await updateProfile(user._id, newValues);

                if (response) {
                    // Update user in store
                    setUser({ ...user, ...newValues });
                    SuccessToast('Profile Updated Successfully');
                    router.push('/dashboard/job-seeker/profile');
                }
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const errorMessage = error.response?.data?.message || 'Failed to update profile';
                    ErrorToast(errorMessage);
                } else {
                    ErrorToast('An error occurred while updating profile');
                }
            } finally {
                setIsLoading(false);
            }
        },
        [user, selectedSkills, locationName, geometry, setUser, router],
    );

    const toggleSkill = (skillId: number) => {
        setSelectedSkills(prev =>
            prev.includes(skillId)
                ? prev.filter(id => id !== skillId)
                : [...prev, skillId]
        );
    };

    if (!user) {
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sidebar - Hidden on mobile, visible on desktop */}
                   <SkillsGuide/>
                    {/* Main Content */}
                    <div className="lg:col-span-6 py-6">
                        <div className="max-w-2xl mx-auto">
                            {/* Form */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <Formik
                                    initialValues={initialValues}
                                    onSubmit={handleEditProfile}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                                        <div className="space-y-6">
                                            {/* Username */}
                                            <div>
                                                <label className="block text-sm font-medium text-black mb-2">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Username"
                                                    value={values.username}
                                                    onChange={handleChange('username')}
                                                    onBlur={handleBlur('username')}
                                                    className="w-full px-4 py-3 rounded-md border border-border focus:outline-none text-black placeholder-gray-400"
                                                />
                                                {errors.username && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <div>
                                                <label className="block text-sm font-medium text-black mb-2">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="You are a ..."
                                                    value={values.title}
                                                    onChange={handleChange('title')}
                                                    onBlur={handleBlur('title')}
                                                    className="w-full px-4 py-3 rounded-md border border-border focus:outline-none text-black placeholder-gray-400"
                                                />
                                                {errors.title && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                                )}
                                            </div>

                                            {/* Bio */}
                                            <div>
                                                <label className="block text-sm font-medium text-black mb-2">
                                                    Bio
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Bio"
                                                    value={values.bio}
                                                    onChange={handleChange('bio')}
                                                    onBlur={handleBlur('bio')}
                                                    className="w-full px-4 py-3 rounded-md border border-border focus:outline-none text-black placeholder-gray-400"
                                                />
                                                {errors.bio && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                                                )}
                                            </div>

                                            {/* Location */}
                                            <div>
                                                <label className="block text-sm font-medium text-black mb-2">
                                                    Location
                                                </label>
                                                <GeoLocationComponent
                                                    setGeometry={setGeometry}
                                                    setLocationName={setLocationName}
                                                />
                                            </div>

                                            {/* About Me */}
                                            <div>
                                                <label className="block text-sm font-medium text-black mb-2">
                                                    About Me
                                                </label>
                                                <textarea
                                                    placeholder="About Me"
                                                    value={values.about_me}
                                                    onChange={handleChange('about_me')}
                                                    onBlur={handleBlur('about_me')}
                                                    rows={4}
                                                    className="w-full px-4 py-3 rounded-md border border-border focus:outline-none text-black placeholder-gray-400 resize-none"
                                                />
                                                {errors.about_me && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.about_me}</p>
                                                )}
                                            </div>

                                            {/* Skills (only for job seekers) */}
                                            {user.role === 'job_seeker' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-black mb-2">
                                                        Add Skills
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
                                            )}

                                            {/* Submit Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleSubmit()}
                                                disabled={isLoading}
                                                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? 'Updating...' : 'Done'}
                                            </button>
                                        </div>
                                    )}
                                </Formik>
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
