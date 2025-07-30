export interface profilePros{
    username: string;
    title: string;
    bio: string;
    about_me: string;
    skills: string[];
    location: string;
    latitude: number;
    longitude: number;
    [key: string]: unknown;
}