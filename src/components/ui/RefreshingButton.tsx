import { RefreshCw } from "lucide-react";

const RefreshingButton = ({
  handleRefresh,
  isRefreshing,
  isLoading,
}: {
  handleRefresh: () => void;
  isRefreshing: boolean;
  isLoading: boolean;
}) => {
  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing || isLoading}
      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
    >
      <RefreshCw
        size={16}
        className={`text-gray-600 ${isRefreshing ? "animate-spin" : ""}`}
      />
      <span className="text-sm font-medium text-gray-700">
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </span>
    </button>
  );
};

export default RefreshingButton;
