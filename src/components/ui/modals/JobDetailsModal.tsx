
'use client';
import { useState } from "react";
import { JobI } from "@/types/job";
import SafeHTML from "@/components/global/SafeHTML";
import { Edit, Trash2, UserCheck } from "lucide-react";
import { EditJobModal } from "./EditJobModal";
import { updateJob } from "@/lib/job/job-api";
import { ErrorToast, SuccessToast } from "../Toast";
import { User } from "@/types/user";
import { useUserJobs } from "@/hooks/jobs/useJobs";

export const JobDetailsModal = ({
  isOpen,
  onClose,
  job,
}: {
  isOpen: boolean;
  onClose: () => void;
  job: JobI | null;
}) => {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const {mutate} = useUserJobs(job?.postedBy?._id);



  if (!isOpen || !job) return null;

  const handleSave = async (status: string, users: User[]) => {
    // Validate required data
    if (!job._id) {
      ErrorToast("Job ID is missing");
      return;
    }
    
    if (!users.length || !users[0]?._id) {
      ErrorToast("Please select a user to assign");
      return;
    }

    // Validate status
    const validStatuses = ['Pending', 'In_Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      ErrorToast("Invalid job status");
      return;
    }

    const jobData = {
      job_status: status,
      assignedTo: users[0]._id, 
    };

    const response = await updateJob(job._id, jobData);
    if (response.success) {
      SuccessToast("Job updated successfully!");
      mutate();
      setIsEditOpen(false);
      onClose();
    } else {
      ErrorToast(response.error || "Failed to update job. Please try again.");
    }
  };


  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
          {/* Fixed Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Assigned User Banner - Show when job is assigned */}
          {job.assignedTo && (job.job_status === "In_Progress" || job.job_status === "Completed") && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <img
                      src={job.assignedTo.profilePic?.url || '/default-profile.png'}
                      alt={job.assignedTo.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800">
                      Assigned to
                    </p>
                    <p className="text-lg font-semibold text-green-900 truncate">
                      {job.assignedTo.username}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    job.job_status === "Completed" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {job.job_status === "In_Progress" ? "In Progress" : job.job_status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <SafeHTML html={job.job_description || ""} isFullDescription={true} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-1">Price</h5>
                  <p className="text-2xl font-bold text-primary">₹{job.price.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-1">Category</h5>
                  <p className="text-gray-700">{job.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-1">Job Visibility</h5>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${job.visibility === "public"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {job.visibility}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-1">Created</h5>
                  <p className="text-gray-700">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-1">Status</h5>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    job.job_status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                    job.job_status === "In_Progress" ? "bg-blue-100 text-blue-700" :
                    job.job_status === "Completed" ? "bg-green-100 text-green-700" :
                    job.job_status === "Cancelled" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {job.job_status === "In_Progress" ? "In Progress" : job.job_status}
                  </span>
                </div>
                {job.phoneNumber && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-1">Contact</h5>
                    <p className="text-gray-700">{job.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fixed Footer Buttons */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => setIsEditOpen(true)}
              >
                <Edit className="w-4 h-4" />
                Update Status
              </button>
              <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Job
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <EditJobModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        job={job}
        onSave={handleSave}
      />
    </>
  );
};
