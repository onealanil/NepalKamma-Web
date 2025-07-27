
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Who from '@/components/auth/Who';
import { SignupFormData } from '@/types/auth';
import { signup } from '@/lib/auth';
import { AxiosError } from 'axios';



export default function SignUp() {
  const router = useRouter();
  const [who, setWho] = useState<string>('');
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    security_answer: '',
    gender: 'male'
  });
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }

    if (!formData.security_answer) {
      newErrors.security_answer = 'Security answer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * @function handleSubmit
   * @param e it is the event object
   * @returns void
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        role: who
      }

      const response = await signup(payload);
      if (response.status === 'pending' && response.data) {
        const params = new URLSearchParams({
          userId: response.data.userId,
          email: response.data.email,
          expiresAt: response.data.expiresAt
        });
        router.push(`/auth/verify-otp?${params.toString()}`);
      }

    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        alert(errorMessage);
      } else if (error instanceof Error) {
        alert('An error occurred during verification');
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-8">
      {who.length > 0 ? (
        // Signup Form
        <div className="flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Image
                src="/images/NepalKamma.png"
                alt="NepalKamma Logo"
                width={150}
                height={50}
                className="object-contain"
              />
              <div className="h-1 flex-1 bg-primary ml-4"></div>
            </div>

            {/* Title with Back Button */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-black">
                  Create an account
                </h1>
                <button
                  onClick={() => setWho('')}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Welcome to</span>
                <span className="text-primary font-bold text-xl">Nepal</span>
                <span className="text-black font-bold text-xl">Kamma</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your Username"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  className="w-full px-4 py-3 rounded-md border border-border  focus:outline-none text-black placeholder-gray-400"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="w-full px-4 py-3 rounded-md border border-border  focus:outline-none text-black placeholder-gray-400"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                  Password
                </label>
                <div className="flex items-center relative border border-border rounded-md">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your Password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className="w-full px-4 py-3 rounded-md  focus:outline-none text-black placeholder-gray-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 h-full flex items-center"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
                  Confirm Password
                </label>
                <div className="relative flex items-center border border-border rounded-md">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    className="w-full px-4 py-3 rounded-md focus:outline-none text-black placeholder-gray-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 h-full flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Security Question */}
              <div>
                <label htmlFor="security_answer" className="block text-sm font-medium text-black mb-2">
                  What is your birthplace? (Security Question)
                </label>
                <input
                  id="security_answer"
                  type="text"
                  placeholder="Enter your birthplace"
                  value={formData.security_answer}
                  onChange={handleInputChange('security_answer')}
                  className="w-full px-4 py-3 rounded-md border border-border  focus:outline-none text-black placeholder-gray-400"
                />
                {errors.security_answer && (
                  <p className="text-red-500 text-sm mt-1">{errors.security_answer}</p>
                )}
              </div>

              {/* Gender Field */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-black mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange('gender')}
                  className="w-full px-4 py-3 rounded-md border border-border  focus:outline-none text-black"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3 px-4 rounded-md font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Sign Up'
                )}
              </button>

              {/* Sign In Link */}
              <div className="text-center mt-4">
                <span className="text-gray-600">Already have an account? </span>
                <Link href="/auth/signin" className="text-primary font-semibold hover:underline">
                  Log In
                </Link>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Who Selection
        <div className="h-[calc(100vh-6rem)] flex items-center justify-center px-4">
          <Who setWho={setWho} />
        </div>
      )}
    </div>
  );
}
