import axiosInstance from "./axios";

export const fetcher = async (url: string) => {
    const response = await axiosInstance.get(url);
    return response.data;
}