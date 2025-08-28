export interface PaymentI{
    _id?: string;
    paymentBy: string;
    paymentTo: string;
    receiverNumber?: string;
    confirmation_image?: [{ url: string, public_id: string }];
    job: string;
    amount: number;
    paymentMethod: 'cash' | 'online' | string;
    paymentStatus?:"provider_paid" | "request_payment" | "Completed" | "Cancelled" | string;
    createdAt?: string;
    updatedAt?: string;
}