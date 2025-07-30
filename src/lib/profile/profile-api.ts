import { profilePros } from "@/types/job-seeker/profile-api";
import axiosInstance from "../axios";

//update profile
export const updateProfile = async (userId: string, profileData: profilePros) => {
  const response = await axiosInstance.put(`/user/edit-profile/${userId}`, profileData);
  return response.data;
};

//update phoneNumber
export const updatePhoneNumber = async (phoneNumber: string) => {
  const response = await axiosInstance.put(`/user/update-phone`, { phoneNumber });
  return response;
};
