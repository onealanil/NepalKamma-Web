import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

axiosInstance.interceptors.response.use(
    res => res,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(`${baseURL}/refresh-token`, {}, {
                    withCredentials: true
                });
                const { accessToken } = data;
                useAuthStore.getState().setAccessToken(accessToken);

                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

