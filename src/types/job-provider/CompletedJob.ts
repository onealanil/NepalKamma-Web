//completedjob for job-seeker (request payment)
export interface CompletedJob {
    _id: string;
    amount: number;
    paymentType: string;
    paymentStatus: string;
    recieverNumber: string;
    confirmation_image: string[];
    createdAt: string;
    updatedAt: string;
    PaymentBy: {
        _id: string;
        username: string;
        email: string;
    };
    PaymentTo: {
        _id: string;
        username: string;
        email: string;
    };
    job: {
        _id: string;
        title: string;
        location: string;
        description?: string;
        category?: string;
        skills_required?: string[];
        payment_method?: string[];
        price?: number;
        postedBy?: {
            _id: string;
            username: string;
            profilePic?: { url: string };
            onlineStatus?: boolean;
        };
    };
}
