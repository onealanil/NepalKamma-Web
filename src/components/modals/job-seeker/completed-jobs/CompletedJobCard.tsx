import { CompletedJob } from "@/types/job-provider/CompletedJob";
import { Calendar, CheckCircle, CreditCard, DollarSign, Eye, MapPin } from "lucide-react";

const CompletedJobCard = ({
    data,
    onViewPayment,
    onRequestPayment
}: {
    data: CompletedJob;
    onViewPayment: (job: CompletedJob) => void;
    onRequestPayment: (job: CompletedJob) => void;
}) => {
    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'provider_paid':
            case 'paid':
                return 'bg-green-100 text-green-600';
            case 'request_payment':
                return 'bg-yellow-100 text-yellow-600';
            case 'processing':
                return 'bg-blue-100 text-blue-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPaymentStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'provider_paid':
                return 'Paid';
            case 'request_payment':
                return 'Requested';
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    return (
        <div className=" rounded-xl p-4 mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    {data?.PaymentBy?.username ? (
                        <span className="text-primary font-semibold text-lg">
                            {data.PaymentBy.username.charAt(0).toUpperCase()}
                        </span>
                    ) : (
                        <span className="text-primary font-semibold text-lg">
                            ?
                        </span>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                            {data.job.title}
                        </h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                        Payment from: <span className="font-medium">{data.PaymentBy.username}</span>
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{data.job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatDate(data.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>Rs. {data.amount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getPaymentStatusColor(data.paymentStatus)}`}>
                                {getPaymentStatusText(data.paymentStatus)}
                            </span>

                            <span className="px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-600">
                                {data.paymentType.charAt(0).toUpperCase() + data.paymentType.slice(1)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            {data.paymentStatus === 'provider_paid' && (
                                <button
                                    onClick={() => onRequestPayment(data)}
                                    className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors whitespace-nowrap"
                                >
                                    <CreditCard size={14} />
                                    Request Payment
                                </button>
                            )}
                            {
                                data.paymentStatus === 'request_payment' && (
                                    <button
                                        onClick={() => onViewPayment(data)}
                                        className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors whitespace-nowrap"
                                    >
                                        <CheckCircle size={14} />
                                        Requested
                                    </button>
                                )
                            }

                            <button
                                onClick={() => onViewPayment(data)}
                                className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors whitespace-nowrap"
                            >
                                <Eye size={14} />
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletedJobCard;
