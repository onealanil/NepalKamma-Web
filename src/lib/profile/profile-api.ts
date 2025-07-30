import { profilePros } from "@/types/job-seeker/profile-api";
import axiosInstance from "../axios";

/**
 * @function updateProfile 
 * @description This function is used to update the user profile
 * @param userId ID of the user
 * @param profileData Data to be updated
 * @returns Response from the server
 * @route PUT /user/edit-profile/:id
 */
export const updateProfile = async (userId: string, profileData: profilePros) => {
  const response = await axiosInstance.put(`/user/edit-profile/${userId}`, profileData);
  return response.data;
};

/**
 * @function updatePhoneNumber
 * @param phoneNumber phone number to be updated
 * @returns Response from the server
 * @route PUT /user/update-phone
 */
export const updatePhoneNumber = async (phoneNumber: string) => {
  const response = await axiosInstance.put(`/user/update-phone`, { phone: phoneNumber });
  return response;
};
