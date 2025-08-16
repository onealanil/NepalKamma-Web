"use client";

import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Banknote } from 'lucide-react';
import { JobI } from '@/types/job';
import { SuccessToast, ErrorToast } from '@/components/ui/Toast';
import { PaymentI } from '@/types/payment';
import { createPayment } from '@/lib/payment/payment-api';

interface PayModalProps {
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
    job: JobI | null;
    onPaymentComplete?: () => void;
}

const PayModal: React.FC<PayModalProps> = ({
    isVisible,
    setIsVisible,
    job,
    onPaymentComplete
}) => {
    const [amount, setAmount] = useState<string>('');
    const [isPaying, setIsPaying] = useState(false);
    const [showOfflineModal, setShowOfflineModal] = useState(false);

    if (!isVisible || !job) return null;

    const handleClose = () => {
        setIsVisible(false);
        setShowOfflineModal(false);
        setAmount('');
        setIsPaying(false);
    };

    const handleOnlinePayment = () => {
        // Show coming soon message
        ErrorToast('Online payment functionality coming soon!');
    };

    const handleOfflinePayment = () => {
        setShowOfflineModal(true);
    };

    const processOfflinePayment = async () => {
        // Validate required fields
        if (!job?.postedBy?._id || !job?.assignedTo?._id) {
            ErrorToast('User information not found');
            return;
        }

        if (job.postedBy._id === job.assignedTo._id) {
            ErrorToast('You cannot pay yourself');
            return;
        }

        if (job.job_status !== "Completed") {
            ErrorToast('Job is not completed yet');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            ErrorToast('Please enter a valid amount');
            return;
        }

        setIsPaying(true);
        try {
            // Create payment data with proper type safety
            const paymentData: PaymentI = {
                paymentBy: job.postedBy._id,
                paymentTo: job.assignedTo._id,
                job: job._id,
                amount: parseFloat(amount),
                paymentMethod: 'cash',
                receiverNumber: job.assignedTo.phoneNumber,
            };
            const response = await createPayment(paymentData);
            if (response.success) {
                SuccessToast('Payment request sent successfully!');
                onPaymentComplete?.();
                handleClose();
            } else {
                ErrorToast(response.message || 'Failed to process payment');
            }
        } catch (error) {
            console.error('Payment error:', error);
            ErrorToast('Failed to process payment. Please try again.');
        } finally {
            setIsPaying(false);
        }
    };

    if (showOfflineModal) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Banknote size={32} className="text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Offline Payment
                        </h2>
                        <p className="text-gray-600 text-sm">
                            How much is fixed with the job seeker?
                        </p>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Write your amount here:
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">Rs.</span>
                            </div>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter your amount here..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Job Info */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-6">
                        <div className="text-sm flex flex-col gap-1">
                            <p className="font-semibold text-gray-900">{job.title}</p>
                            <p className="text-gray-600">Worker: {job.assignedTo?.username}</p>
                            <p className="text-gray-600">Original Price: Rs. {job.price}</p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={processOfflinePayment}
                        disabled={isPaying || !amount}
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isPaying ? 'Processing Payment...' : 'Pay'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DollarSign size={32} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Choose Payment Method
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Select how you want to pay for this job
                    </p>
                </div>

                {/* Job Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex flex-col items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-900">{job.title}</p>
                            <p className="text-sm text-gray-600">Worker: {job.assignedTo?.username}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-primary">Rs. {job.price}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-3">
                    {/* Online Payment */}
                    <button
                        onClick={handleOnlinePayment}
                        className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-primary/10">
                            <CreditCard size={24} className="text-blue-600 group-hover:text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Online Payment</p>
                            <p className="text-sm text-gray-600">Pay with card or digital wallet</p>
                        </div>
                    </button>

                    {/* Offline Payment */}
                    <button
                        onClick={handleOfflinePayment}
                        className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-primary/10">
                            <Banknote size={24} className="text-green-600 group-hover:text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Offline Payment</p>
                            <p className="text-sm text-gray-600">Pay in cash directly</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayModal;
