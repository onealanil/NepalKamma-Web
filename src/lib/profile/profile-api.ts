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

/**
 * @function verifyDocument
 * @description This function is used to verify the document of the user
 * @param formData Form data containing the document images
 * @returns Response from the server
 * @route POST /user/upload-document
 */
export const verifyDocument = async (formData: FormData) => {
  const response = await axiosInstance.post(`/user/upload-document`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

/**
 * @function updateProfilePicture
 * @description This function is used to update the profile picture of the user
 * @param formData Form data containing the profile picture
 * @returns Response from the server
 * @route PUT /user/update-picture
 */
export const updateProfilePicture = async (formData: FormData) => {
  const response = await axiosInstance.put(`/user/update-picture`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};
