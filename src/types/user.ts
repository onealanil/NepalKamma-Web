//interface for the User data--> overall application
export interface User {
  _id: string;
  __v: number;
  email: string;
  username: string;
  role: 'job_seeker' | string;
  profilePic: {
    public_id: string;
    url: string;
  };
  address: {
    type: 'Point';
    coordinates: [number, number];
  };
  refreshToken: string | null;
  title: string;
  about_me: string;
  bio: string;
  isTick: boolean;
  isVerified: boolean;
  isDocumentVerified: 'verified' | 'is_not_verified' | 'Pending' | string;
  location: string;
  gender: 'male' | 'female' | 'other' | string;
  phoneNumber: string;
  fcm_token: string;
  can_review: unknown[];
  documents: [{ url: string, public_id: string }];
  createdAt: string;
  updatedAt: string;
  savedPostGig: unknown[];
  savedPostJob: unknown[];
  security_answer: string;
  skills: string[];
  mileStone: number;
  onlineStatus: boolean;
  totalAmountPaid: number;
  totalCompletedJobs: number;
  totalIncome: number;
  userAccountStatus: 'Active' | 'Inactive' | string;
  averageRating?: number;
}
