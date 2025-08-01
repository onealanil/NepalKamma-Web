import { User } from "./user";

export interface JobI {
    title: string;
    address: { type: { type: string, enum: ["Point"], default: "Point" }, coordinates: { type: number[] } };
    location: string;
    phoneNumber: string;
    skills_required: string[];
    job_description: string;
    payment_method: string[];
    price: number;
    category: string;
    postedBy: User;
    rating: number;
    job_status: "Pending" | "In_Progress" | "Completed" | "Cancelled" | "Paid" | string;
    assignedTo: User;
    experiesIn: Date;
    visibility: "public" | "private" | string;
    createdAt?: Date;
    updatedAt?: Date;

}