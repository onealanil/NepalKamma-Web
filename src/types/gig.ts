import { User } from "./user";

//interface of Gig
export interface GigI {
    _id?: string;
    title: string;
    gig_description: string;
    price: number;
    category: string;
    images?: [{ url: string, public_id: string }];
    postedBy?: User;
    visibility?: 'public' | 'private' | string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PaginatedGigs {
  gig: GigI[];
  totalGigs: number;
  totalPages: number;
  totalJobs: number;
  currentPage: number;
}

export interface SingleGig{
    gig: {
        data: GigI[];
    }
}