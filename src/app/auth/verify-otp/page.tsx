'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { ResendOtpData, VerifyOtpData } from '@/types/auth';
import { resendOTP, verifyOTP } from '@/lib/auth';

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [counter, setCounter] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');

  // Get params from URL
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');
  const expiresAt = searchParams.get('expiresAt');

  // Counter for resend OTP
  useEffect(() => {
    if (counter === null && expiresAt) {
      const expiryTime = Date.parse(expiresAt);
      const diff = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setCounter(diff);
    }

    if (counter === 0) return;

    const interval = setInterval(() => {
      setCounter(prevCounter => {
        if (prevCounter !== null && prevCounter > 1) {
          return prevCounter - 1;
        } else {
          clearInterval(interval);
          return null;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, counter]);

  /**
   * @function handleOtpChange
   * @param index it is the index of the OTP input
   * @param value it is the value of the OTP input
   * @returns void
   */
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  /**
   * @function handleKeyDown
   * @param index it is the index of the OTP input
   * @param e it is the event object
   * @returns void
   */
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  /**
   * @function verifyHandler
   * @description Handle the verify button click
   */
  const verifyHandler = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4 || !userId) return;

    setIsVerifying(true);
    try {
      const data: VerifyOtpData = {
        userId,
        otp: otpString,
      };

      const response = await verifyOTP(data);
      if (response.status === 'success') {
        setResponseMessage(response.message);
        setShowModal(true);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Invalid OTP';
        alert(errorMessage);
      } else if (error instanceof Error) {
        alert('An error occurred during verification');
      } else {
        alert('An unknown error occurred');
      }
    }
    setIsVerifying(false);
  };

  /**
   * @function handleResendOtp
   * @description Handle the resend OTP button click
   */
  const handleResendOtp = async () => {
    if (counter !== 0 || !userId || !email) return;

    setIsResending(true);
    try {
      const data: ResendOtpData = {
        userId,
        email,
      };

      const response = await resendOTP(data);

      if (response.status === 'pending' && response.data) {
        // Clear current OTP inputs
        setOtp(['', '', '', '']);

        const newExpiryTime = response.data.expiresAt;
        const diff = Math.max(0, Math.floor((Date.parse(newExpiryTime) - Date.now()) / 1000));
        setCounter(diff);

        alert('OTP has been sent to your email');
      } else {
        alert(response.message || 'Failed to resend OTP');
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
        alert(errorMessage);
      } else if (error instanceof Error) {
        alert('An error occurred while resending OTP');
      } else {
        alert('An unknown error occurred');
      }
    }
    setIsResending(false);
  };

  /**
   * @function handleModalOk
   * @description Handle the OK button click in the success modal
   */
  const handleModalOk = () => {
    setShowModal(false);
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/NepalKamma.png"
            alt="NepalKamma Logo"
            width={240}
            height={80}
            className="object-contain"
          />
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-black mb-4">
            We sent OTP code to verify your email
          </h1>
          <p className="text-black text-lg">
            {email || ''}
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-4 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              maxLength={1}
            />
          ))}
        </div>

        {/* Timer and Resend */}
        <div className="text-center mb-8">
          <p className="text-black mb-2">
            {counter === 0 ? (
              'Now you can resend'
            ) : (
              <>
                After{' '}
                <span className="text-3xl font-bold text-green-600">
                  {counter}
                </span>{' '}
                sec you can resend
              </>
            )}
          </p>
          {counter === 0 && (
            <button
              onClick={handleResendOtp}
              disabled={isResending}
              className="flex items-center justify-center gap-2 mx-auto text-green-600 font-semibold hover:text-green-700 disabled:opacity-50"
            >
              <span>Resend</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={verifyHandler}
          disabled={isVerifying || otp.join('').length !== 4}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isVerifying ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Verify'
          )}
        </button>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link href="/auth/signin" className="text-green-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Verified</h3>
              <p className="text-gray-600 mb-4">{responseMessage}</p>
              <button
                onClick={handleModalOk}
                className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
