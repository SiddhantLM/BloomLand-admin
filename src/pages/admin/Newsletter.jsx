import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Mail,
} from "lucide-react";
import { newsletter } from "@/services/newsletter";
import { useSelector } from "react-redux";

// Sample data structure for development - in production, we'll use API data
const initialSubscriptions = [
  {
    _id: "sub_001",
    email: "sarah.johnson@example.com",
    created_at: "2025-04-20T08:30:00",
    status: "active",
  },
  {
    _id: "sub_002",
    email: "robert.smith@example.com",
    created_at: "2025-04-22T10:15:00",
    status: "active",
  },
  // ... other sample data with consistent structure
];

export default function Newsletter() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  // Added pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await newsletter({ token: token });
        if (Array.isArray(res)) {
          setSubscriptions(res);
        } else {
          console.error("Expected array response from API:", res);
        }
      } catch (error) {
        console.error("Error fetching newsletter subscriptions:", error);
      }
    };
    fetchUsers();
  }, [token]);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Use useMemo for sorted and filtered subscriptions to avoid performance issues
  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (subscription) =>
          (subscription._id &&
            subscription._id
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (subscription.email &&
            subscription.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (!aValue && !bValue) return 0;
      if (!aValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (!bValue) return sortConfig.direction === "asc" ? 1 : -1;

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [subscriptions, searchTerm, sortConfig]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Render sort indicator
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  // Handle pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  function downloadEmailList() {
    const emails = subscriptions.map((i) => i.email);
    const emailString = emails.join(", ");
    const blob = new Blob([emailString], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "emails.txt";
    link.click();
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Newsletter Subscriptions
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={() => downloadEmailList()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Mail size={16} className="mr-2" /> Download Emails
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Search by ID or email address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Clear search button - only show when search is active */}
            {searchTerm && (
              <button
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                onClick={clearSearch}
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("_id")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>ID</span>
                      {renderSortIndicator("_id")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("email")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      {renderSortIndicator("email")}
                    </div>
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("created_at")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Subscribed At</span>
                      {renderSortIndicator("created_at")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems && currentItems.length > 0 ? (
                  currentItems.map((subscription) => (
                    <tr key={subscription._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-600">
                          {subscription._id
                            ? subscription._id.slice(0, 8) + "..."
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subscription.email || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {subscription.created_at
                            ? formatDate(subscription.created_at)
                            : "N/A"}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                          <AlertCircle size={32} />
                        </div>
                        <h3 className="text-base font-medium text-gray-900">
                          No subscriptions found
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {searchTerm
                            ? "Try adjusting your search criteria"
                            : "There are no newsletter subscriptions in the system yet"}
                        </p>
                        {searchTerm && (
                          <button
                            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
                            onClick={clearSearch}
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredSubscriptions.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredSubscriptions.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronDown className="h-5 w-5 rotate-90" />
                    </button>

                    {/* Display current page number */}
                    <button className="relative inline-flex items-center px-4 py-2 border border-indigo-500 bg-indigo-50 text-sm font-medium text-indigo-600">
                      {currentPage}
                    </button>

                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown className="h-5 w-5 -rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
