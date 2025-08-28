
import { PaymentI } from "@/types/payment";
import axiosInstance from "../axios";
import { handleApiError } from "../job/job-api";
import { ApiResponse } from "@/types/job-provider/job-api";



// ---------------------- Payment store for job provider ---------------------------
export async function createPayment(paymentData: PaymentI): Promise<ApiResponse> {
  try {
    const response = await axiosInstance.post(`/payment/createPayment`, paymentData);
    return {
      success: true,
      data: response.data,
      message: "Payment created successfully"
    };
  } catch (error: unknown) {
    return handleApiError(error, "Failed to create payment. Please try again.");
  }
}


// ------------------------ Payment store for job seeker ----------------------------------
export async function getPaymentByProvider(): Promise<ApiResponse> {
  try {
    const response = await axiosInstance.get(`/payment/getPaymentByProvider`);
    return {
      success: true,
      data: response.data,
      message: "Payment fetched successfully"
    };
  }
  catch (error: unknown) {
    return handleApiError(error, "Failed to fetch payment. Please try again.");
  }
}

