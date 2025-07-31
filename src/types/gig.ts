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
    createdAt?: string;
    updatedAt?: string;
}