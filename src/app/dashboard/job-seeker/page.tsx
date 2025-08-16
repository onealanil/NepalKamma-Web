"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LeftSideSeeker from "@/components/ui/LeftSideSeeker";
import { useNearbyJobs } from "@/hooks/jobs/useNearbyJobs";
import { useAuthStore } from "@/store/authStore";
import JobCardSeeker from "@/components/job/JobCardSeeker";
import { JobI } from "@/types/job";
import { LoadingCard } from "@/components/ui/loader/LoadingCard";
import { useRecommendedJobs } from "@/hooks/jobs/useRecommendedJobs";
import ErrorNearBy from "@/components/ui/dashboard/job-seeker/ErrorNearBy";
import { useMostRecent } from "@/hooks/jobs/useMostRecent";
import ErrorMostRecent from "@/components/ui/dashboard/job-seeker/ErrorMostRecent";
import RefreshingButton from "@/components/ui/RefreshingButton";

function JobSeekerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [currentTab, setCurrentTab] = useState<
    "Best Matches" | "Most Recent" | "Nearby"
  >("Nearby");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Get coordinates from user profile
  const latitude = user?.address?.coordinates?.[1];
  const longitude = user?.address?.coordinates?.[0];

  // Use the nearby jobs hook with
  const {
    jobs: nearByJobs,
    isLoading,
    isError,
    mutate,
  } = useNearbyJobs(latitude, longitude);

  // Use for the recommened jobs hook
  const {
    jobs: recommendedJobs,
    isLoading: recommendedLoading,
    isError: recommendedError,
    mutate: recommendedMutate,
  } = useRecommendedJobs();

  // Use for the most recent jobs hook
  const {
    jobs: recentJobs,
    isLoading: recentLoading,
    isError: recentError,
    mutate: recentMutate,
  } = useMostRecent();

  // Handle missing coordinates
  if (!latitude || !longitude) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="hidden lg:block lg:col-span-3">
              <LeftSideSeeker />
            </div>
            <div className="lg:col-span-9 py-6">
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Location Required
                </h3>
                <p className="text-gray-600 mb-6">
                  Please update your profile with your location to see nearby
                  jobs.
                </p>
                <button
                  onClick={() =>
                    router.push("/dashboard/job-seeker/profile/edit-profile")
                  }
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Update Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle API errors
  //Nearby
  if (isError) {
    return <ErrorNearBy mutate={mutate} />;
  }

  //recommendation
  if (recommendedError) {
    return <ErrorNearBy mutate={recommendedMutate} />;
  }

  //recent
  if (recentError) {
    return <ErrorMostRecent mutate={recentMutate} />;
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await mutate();
      await recommendedMutate();
      await recentMutate();
    } catch (error) {
      console.error("Failed to refresh jobs:", error);
    } finally {
      setIsRefreshing(false);
    }
  }

  const handleTabChange = (tab: "Best Matches" | "Most Recent" | "Nearby") => {
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <LeftSideSeeker />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 py-6">
            <div className="bg-white rounded-xl shadow-sm">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between gap-2 items-center-center mb-4">
                  <div className="flex gap-2 items-center ">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                      Discover Jobs,
                    </h1>
                    <span className="floating-animation text-lg md:text-xl font-bold text-primary">
                      Earn Money
                    </span>
                  </div>
                  <div>
                    <RefreshingButton
                      handleRefresh={handleRefresh}
                      isRefreshing={isRefreshing}
                      isLoading={isLoading}
                    />
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  {(["Best Matches", "Most Recent", "Nearby"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                          currentTab === tab
                            ? "bg-primary text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {tab}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Loading State */}
                {isLoading && recommendedLoading && recentLoading && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-gray-50 rounded-xl p-4">
                        <LoadingCard />
                      </div>
                    ))}
                  </div>
                )}

                {/* Jobs Content */}
                {!isLoading && (
                  <>
                    {currentTab === "Nearby" && (
                      <>
                        {nearByJobs.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="text-4xl mb-4">📍</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              No nearby jobs available
                            </h3>
                            <p className="text-gray-600 mb-6">
                              There are no jobs within 10km of your location.
                              Try expanding your search area.
                            </p>
                            <button
                              onClick={() => mutate()}
                              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                            >
                              Refresh Jobs
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex bg-gradient-to-r from-primary/5 to-green-50 items-center justify-between mb-4 border border-gray-100 rounded-lg p-4">
                              <p className="text-sm font-bold text-gray-600">
                                Found {nearByJobs.length} jobs within 10km of
                                your location
                              </p>
                              <button
                                onClick={() => mutate()}
                                className="text-primary hover:text-primary/80 text-sm font-medium"
                              >
                                Refresh
                              </button>
                            </div>
                            {nearByJobs.map((job: JobI) => (
                              <JobCardSeeker
                                key={job._id}
                                data={job}
                                onSelect={() => {}}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* near by  */}

                    {!recommendedLoading && (
                      <>
                        {currentTab === "Best Matches" && (
                          <>
                            {recommendedJobs.length === 0 ? (
                              <div className="text-center py-12">
                                <div className="text-4xl mb-4">🎯</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                  No recommended jobs available
                                </h3>
                                <p className="text-gray-600 mb-6">
                                  There are no recommended jobs based on your
                                  profile. Try updating your profile.
                                </p>
                                <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
                                  <button
                                    onClick={() => recommendedMutate()}
                                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                  >
                                    Refresh Jobs
                                  </button>
                                  <button
                                    onClick={() =>
                                      router.push(
                                        "/dashboard/job-seeker/profile/edit-profile"
                                      )
                                    }
                                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                                  >
                                    Update Profile
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {recommendedJobs.map(
                                  (
                                    job: JobI & {
                                      similarityScore?: number;
                                      recommendationReason?: string;
                                      matchedSkills?: string[];
                                    }
                                  ) => (
                                    <div
                                      key={job._id}
                                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
                                    >
                                      {/* Recommendation Header */}
                                      <div className="bg-gradient-to-r from-primary/5 to-green-50 px-4 py-3">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium text-primary">
                                              Recommended for You
                                            </span>
                                          </div>
                                          {job.similarityScore && (
                                            <div className="flex items-center gap-1">
                                              <span className="text-xs text-gray-500">
                                                Match:
                                              </span>
                                              <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                                                {Math.round(
                                                  job.similarityScore * 100
                                                )}
                                                %
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* Recommendation Reason */}
                                        {job.recommendationReason && (
                                          <div className="mt-2 flex items-start gap-2">
                                            <svg
                                              className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                              />
                                            </svg>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                              {job.recommendationReason}
                                            </p>
                                          </div>
                                        )}

                                        {/* Matched Skills */}
                                        {job.matchedSkills &&
                                          job.matchedSkills.length > 0 && (
                                            <div className="mt-3">
                                              <div className="flex flex-wrap gap-1">
                                                <span className="text-xs text-gray-500 mr-2">
                                                  Matched skills:
                                                </span>
                                                {job.matchedSkills
                                                  .slice(0, 3)
                                                  .map((skill, index) => (
                                                    <span
                                                      key={index}
                                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                                                    >
                                                      ✓ {skill}
                                                    </span>
                                                  ))}
                                                {job.matchedSkills.length >
                                                  3 && (
                                                  <span className="text-xs text-gray-500">
                                                    +
                                                    {job.matchedSkills.length -
                                                      3}{" "}
                                                    more
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                      </div>

                                      {/* Job Card */}
                                      <div className="p-0">
                                        <JobCardSeeker
                                          data={job}
                                          onSelect={() => {}}
                                        />
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {currentTab === "Most Recent" && (
                      <>
                        {recentJobs?.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="text-4xl mb-4">⏰</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              Recent Jobs Coming Soon
                            </h3>
                            <p className="text-gray-600 mb-6">
                              We're working on showing the most recently posted
                              jobs in your area.
                            </p>
                            <button
                              onClick={() => setCurrentTab("Nearby")}
                              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                            >
                              View Nearby Jobs
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center bg-gradient-to-r from-primary/5 to-green-50 justify-between mb-4 border border-gray-100 rounded-lg p-4">
                              <p className="text-sm font-bold text-gray-600">
                                Here is the 5 most recent jobs for you
                              </p>
                              <button
                                onClick={() => recentMutate()}
                                className="text-primary hover:text-primary/80 text-sm font-medium"
                              >
                                Refresh
                              </button>
                            </div>
                            {recentJobs.map((job: JobI) => (
                              <JobCardSeeker
                                key={job._id}
                                data={job}
                                onSelect={() => {}}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;
