"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import LeftSideSeeker from "@/components/ui/LeftSideSeeker";
import { User as JobSeekerI } from "@/types/user";
import PeopleCard from "@/components/user/PeopleCard";
import Link from "next/link";
import RefreshingButton from "@/components/ui/RefreshingButton";
import { useTopRatedSeeker } from "@/hooks/useTopRatedSeekers";
import TopRatedJobSeekerPagination from "@/components/top-rated-seller/TopRatedJobSeekerPagination";

// Loading skeleton component
const PeopleLoader = () => (
  <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function TopSellerPage() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const { users: jobSeekers, pagination, isLoading, isError, mutate } = useTopRatedSeeker(currentPage);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await mutate();
    } catch (error) {
      console.error("Failed to refresh job providers:", error);
    }
    finally {
      setIsRefreshing(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isError) {
    return <div>Error loading job seekers</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Sidebar - Hidden on mobile, visible on desktop */}
          <LeftSideSeeker />

          {/* Main Content */}
          <div className="lg:col-span-6 py-6">
            {/* Back button */}
            <div className="mb-6 flex items-center justify-between ">
              <button
                onClick={() => router.push("/dashboard/job-provider")}
                className="flex items-center gap-2 mb-4 p-2 rounded-lg transition-colors"
              >
                <ChevronLeft size={24} className="text-gray-600" />
                <h1 className="text-xl font-bold text-gray-900">Top Sellers</h1>
              </button>
              <div>

                {/* Refresh Button */}
                <RefreshingButton
                  handleRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Content */}
            <div className="pb-20">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <PeopleLoader key={item} />
                  ))}
                </div>
              ) : (
                <>
                  {jobSeekers.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                      <div className="text-4xl mb-4">👥</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        No Job Seekers Found
                      </h3>
                      <p className="text-gray-600">
                        Check back later for top sellers in your area
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobSeekers.map((provider: JobSeekerI) => (
                        <Link
                          key={provider._id}
                          href={`/dashboard/job-provider/profile/user/${provider._id}`}
                        >
                          <PeopleCard
                            key={provider._id}
                            data={provider}
                          />
                        </Link>
                      ))}
                      <TopRatedJobSeekerPagination
                        pagination={pagination}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
