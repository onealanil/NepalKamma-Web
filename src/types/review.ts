export interface ReviewI {
    _id: string;
    rating: number;
    review: string;
    reviewedBy: {
        _id: string;
        username: string;
        profilePic?: { url: string };
        location: string;
    };
    reviewedTo: {
        _id: string;
        username: string;
        profilePic?: { url: string };
        location: string;
    };
    createdAt: string;
    updatedAt: string;
}
