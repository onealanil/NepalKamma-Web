//login form data /auth/signin/page.tsx
export interface LoginFormData {
    email: string;
    password: string;
}

//signup interface /lib/auth.ts
export interface SignupI {
    username: string;
    email: string;
    password: string;
    security_answer: string;
    gender: string;
    location: string;
    latitude: number;
    longitude: number;
}

//login interface /lib/auth.ts
export interface loginI {
    email: string,
    password: string
}

//signup form data /auth/signup/page.tsx
export interface SignupFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    security_answer: string;
    gender: string;
    location: string;
    latitude: number;
    longitude: number;
}

//verify opt /auth/verify-otp/page.tsx
export interface VerifyOtpData {
    userId: string;
    otp: string;
}

export interface ResendOtpData {
    userId: string;
    email: string;
}
