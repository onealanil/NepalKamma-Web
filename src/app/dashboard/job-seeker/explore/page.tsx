"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Search, WholeWord } from "lucide-react";
import LeftSideSeeker from "@/components/ui/LeftSideSeeker";
import { JobI } from "@/types/job";
import JobCardSeeker from "@/components/job/JobCardSeeker";
import Pagination from "@/components/ui/Pagination";
import MobileFilterModal from "@/components/filters/MobileFilterModal";
import DesktopFilterSidebar from "@/components/filters/DesktopFilterSidebar";
import LocationStatus from "@/components/ui/LocationStatus";
import { useSearchJobs } from "@/hooks/jobs/useFilteredJobs";
import { JobFilters, DEFAULT_FILTERS, SORT_OPTIONS } from "@/types/filters";
import RefreshingButton from "@/components/ui/RefreshingButton";

function ExplorePage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use filtered jobs hook
  const {
    jobs,
    totalPages,
    totalJobs,
    isLoading,
    isError,
    mutate,
    hasActiveFilters,
  } = useSearchJobs(currentPage, 5, filters);

  const handleJobSelect = (job: JobI) => {
    // Navigate to job detail page
    router.push(`/dashboard/job-seeker/job/${job._id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleApplyFilters = () => {
    mutate();
  };

  const handleSearch = (query: string) => {
    const newFilters = {
      ...filters,
      text: query,
    };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await mutate();
    } catch (error) {
      console.error("Failed to refresh jobs:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getEmptyMessage = () => {
    return {
      title: "No jobs available",
      subtitle: "Stay tuned for more jobs.",
      icon: "🎯",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
      <div className="w-full max-w-md lg:max-w-7xl mx-auto px-4 pb-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <LeftSideSeeker />
          {/* Main Content */}
          <div className="lg:col-span-6 py-6">
            {/* Hero Section */}
            <div className="mb-6">
              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit}>
                  <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Search className="w-5 h-5 text-primary" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for Jobs near you..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="flex-1 outline-none text-gray-700 bg-transparent"
                    />
                    <button
                      type="submit"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Search className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </form>

                {/* Location Status */}
                <LocationStatus
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
                <div className="flex items-center justify-end">
                  <RefreshingButton
                    handleRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                    isLoading={isLoading}
                  />
                </div>

                {/* Mobile Filter Button */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="w-full  rounded-xl p-4 flex items-center justify-center gap-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <Filter className="w-5 h-5 text-primary" />
                    <span className="font-medium text-gray-700">
                      Filters{" "}
                      {hasActiveFilters && (
                        <span className="text-primary">
                          (
                          {
                            Object.keys(filters).filter((key) => {
                              const value = filters[key as keyof JobFilters];
                              if (key === "category")
                                return (
                                  value && value !== "All" && value !== "all"
                                );
                              if (key === "distance")
                                return value && value !== 5;
                              if (key === "sortBy")
                                return value && value !== "recent";
                              if (key === "text")
                                return (
                                  value &&
                                  typeof value === "string" &&
                                  value.trim() !== ""
                                );
                              if (key === "useDistanceFilter")
                                return value === false;
                              return false;
                            }).length
                          }
                          )
                        </span>
                      )}
                    </span>
                  </button>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Active Filters
                      </h4>
                      <button
                        onClick={() => {
                          setFilters(DEFAULT_FILTERS);
                          setCurrentPage(1);
                        }}
                        className="text-primary text-sm font-medium hover:text-primary/80"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.text && (
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                          Search: "{filters.text}"
                        </span>
                      )}
                      {filters.category &&
                        filters.category !== "All" &&
                        filters.category !== "all" && (
                          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                            Category: {filters.category}
                          </span>
                        )}
                      {filters.useDistanceFilter === false && (
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                          All Jobs (No Distance Filter)
                        </span>
                      )}
                      {filters.useDistanceFilter &&
                        filters.distance &&
                        filters.distance !== 5 && (
                          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                            Within {filters.distance}km
                          </span>
                        )}
                      {filters.sortBy && filters.sortBy !== "recent" && (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                          Sort:{" "}
                          {
                            SORT_OPTIONS.find(
                              (opt) => opt.value === filters.sortBy
                            )?.label
                          }
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="min-h-[60vh]">
              {isLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="bg-white rounded-xl p-4 shadow-sm"
                    >
                      <div className="animate-pulse">
                        <div className="flex justify-between items-start mb-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && (
                <>
                  {isError ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                      <div className="text-4xl mb-4">⚠️</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Failed to Load Jobs
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Something went wrong while fetching jobs. Please try
                        again.
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : totalJobs === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                      <div className="text-4xl mb-4">
                        {getEmptyMessage().icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {getEmptyMessage().title}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {getEmptyMessage().subtitle}
                      </p>
                      <button
                        onClick={() =>
                          router.push("/dashboard/job-seeker/profile")
                        }
                        className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Complete Profile
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Jobs List */}
                      <div className="space-y-4 mb-6">
                        {jobs.map((job: JobI) => (
                          <JobCardSeeker
                            key={job._id}
                            data={job}
                            onSelect={handleJobSelect}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalJobs={totalJobs}
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Sidebar - Desktop Filters */}
          <DesktopFilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApplyFilters={handleApplyFilters}
          />
        </div>
        {/* Main Content  */}
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}

export default ExplorePage;
