import axios from "axios";
import axiosInstance, { baseURL } from "./axios";
import { loginI, ResendOtpData, SignupI, VerifyOtpData } from "@/types/auth";
import { useAuthStore } from "@/store/authStore";


//signup user
export async function signup(data: SignupI) {
    try {
        const res = await axios.post(`${baseURL}/user/signup`, data);
        return res.data;
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            throw err;
        }
        throw new Error('An unknown error occurred');
    }
}

//verify otp
export async function verifyOTP(data: VerifyOtpData) {
    try {
        const res = await axios.post(`${baseURL}/user/verify`, data);
        return res.data;
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            throw err;
        }
        throw new Error('An unknown error occurred');
    }
}

//resend otp 
export async function resendOTP(data: ResendOtpData) {
    try {
        const res = await axios.post(`${baseURL}/user/resend-otp`, data);
        return res.data;
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            throw err;
        }
        throw new Error('An unknown error occurred');
    }
}

//signin user
export async function login(data: loginI) {
    try {
        const res = await axiosInstance.post(`/user/login`, data);
        const { user, accessToken } = res.data;
        useAuthStore.getState().setUser(user);
        useAuthStore.getState().setAccessToken(accessToken);

        return res.data;

    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            throw err;
        }
        throw new Error('An unknown error occurred');
    }
}

//logout user
export async function logOut() {
    try {
        await axiosInstance.get(`/user/logout`);

    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            throw err;
        }
        throw new Error('An unknown error occurred');
    }
}

//refresh token 
export const refreshAccessToken = async () => {
    try {
        const { data } = await axiosInstance.post('/auth/refresh-token');
        useAuthStore.getState().setAccessToken(data.accessToken);
    } catch (error) {
        useAuthStore.getState().logout();
    }
};

export const updateProfile = async (userId: string, profileData: any) => {
  const response = await axiosInstance.put(`/users/${userId}/profile`, profileData);
  return response.data;
};
