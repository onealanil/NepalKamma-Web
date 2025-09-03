import { User } from "./user";

export interface JobI {
    _id?: string;
    title: string;
    address?: { type: { type: string, enum: ["Point"], default: "Point" }, coordinates: { type: number[] } };
    location?: string;
    phoneNumber: string;
    skills_required?:string[];
    job_description: string;
    payment_method: string;
    price: number;
    category: string;
    postedBy?: User;
    rating?: number;
    job_status?: "Pending" | "In_Progress" | "Completed" | "Cancelled" | "Paid" | "can_delete"| string;
    assignedTo?: User;
    experiesIn?: Date;
    visibility?: "public" | "private" | string;
    priority?: "low" | "medium" | "Urgent" | string;
    experiesInHrs?: string;
    createdAt?: Date;
    updatedAt?: Date;
    recommendationReason?: string;
    captchaToken?: string;
}

export interface PaginatedJobs {
  job: JobI[];
  totalPages: number;
  totalJobs: number;
  currentPage: number;
}

export interface UserJobs {
  userJobs: JobI[];
}

export interface SingleJob{
  job: JobI;
}