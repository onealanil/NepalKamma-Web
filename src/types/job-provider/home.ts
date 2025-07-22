export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Gig {
    _id: string;
    title: string;
    description: string;
    location: string;
    salary: number;
    createdAt: string;
    category: string;
    urgency: 'low' | 'medium' | 'high';
    distance?: string;
    applicants?: number;
    status: 'active' | 'paused' | 'completed';
}