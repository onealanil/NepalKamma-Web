export interface Job {
    _id: string;
    title: string;
    description: string;
    location: string;
    salary: number;
    createdAt: string;
    category?: string;
    urgency?: 'low' | 'medium' | 'high';
    distance?: string;
}
