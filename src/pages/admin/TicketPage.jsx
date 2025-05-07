import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getTickets } from "@/store/slices/adminSlice";

// Sample ticket data - in a real app, this would come from your API
// const initialTickets = [
//   {
//     id: "TKT-1001",
//     category: "Technical Support",
//     description: "Unable to login to the application after the recent update",
//     status: "Open",
//     priority: "High",
//     createdAt: "2025-04-20T08:30:00",
//     user: "sarah.johnson@example.com",
//   },
//   {
//     id: "TKT-1002",
//     category: "Billing",
//     description: "Duplicate charge on my account for April subscription",
//     status: "In Progress",
//     priority: "Medium",
//     createdAt: "2025-04-22T10:15:00",
//     user: "robert.smith@example.com",
//   },
//   {
//     id: "TKT-1003",
//     category: "Feature Request",
//     description: "Please add dark mode to the dashboard",
//     status: "Open",
//     priority: "Low",
//     createdAt: "2025-04-23T14:45:00",
//     user: "mark.wilson@example.com",
//   },
//   {
//     id: "TKT-1004",
//     category: "Technical Support",
//     description: "App crashes when uploading files larger than 50MB",
//     status: "Resolved",
//     priority: "High",
//     createdAt: "2025-04-15T09:20:00",
//     user: "emily.davis@example.com",
//   },
//   {
//     id: "TKT-1005",
//     category: "Account Access",
//     description: "Need to reset 2FA after changing my phone",
//     status: "Closed",
//     priority: "Medium",
//     createdAt: "2025-04-10T16:30:00",
//     user: "james.brown@example.com",
//   },
//   {
//     id: "TKT-1006",
//     category: "Billing",
//     description: "Question about upcoming plan changes and pricing",
//     status: "Open",
//     priority: "Low",
//     createdAt: "2025-04-25T11:05:00",
//     user: "lisa.taylor@example.com",
//   },
//   {
//     id: "TKT-1007",
//     category: "Technical Support",
//     description: "Error message when attempting to export reports",
//     status: "In Progress",
//     priority: "High",
//     createdAt: "2025-04-24T13:40:00",
//     user: "david.miller@example.com",
//   },
//   {
//     id: "TKT-1008",
//     category: "Feature Request",
//     description: "Add the ability to schedule recurring reports",
//     status: "Open",
//     priority: "Medium",
//     createdAt: "2025-04-26T10:30:00",
//     user: "jennifer.white@example.com",
//   },
//   {
//     id: "TKT-1009",
//     category: "Account Access",
//     description: "Unable to add new team members to our organization",
//     status: "Resolved",
//     priority: "High",
//     createdAt: "2025-04-19T15:20:00",
//     user: "michael.lee@example.com",
//   },
//   {
//     id: "TKT-1010",
//     category: "Technical Support",
//     description: "Dashboard widgets not loading data properly",
//     status: "Open",
//     priority: "Medium",
//     createdAt: "2025-04-27T09:15:00",
//     user: "amanda.clark@example.com",
//   },
// ];

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock size={14} className="mr-1" />,
    },
    "in-touch": {
      color: "bg-blue-100 text-blue-800",
      icon: <RefreshCw size={14} className="mr-1" />,
    },
    resolved: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle size={14} className="mr-1" />,
    },
  };

  const config = statusConfig[status] || statusConfig["Open"];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {status}
    </span>
  );
};

// Priority indicator component
const PriorityIndicator = ({ priority }) => {
  const priorityConfig = {
    High: { color: "text-red-500", icon: <AlertCircle size={16} /> },
    Medium: { color: "text-yellow-500", icon: <AlertCircle size={16} /> },
    Low: { color: "text-green-500", icon: <AlertCircle size={16} /> },
  };

  const config = priorityConfig[priority] || priorityConfig["Medium"];

  return (
    <div className={`${config.color}`} title={`Priority: ${priority}`}>
      {config.icon}
    </div>
  );
};

export default function AdminTicketsPage() {
  // const [tickets, setTickets] = useState(initialTickets);
  const { tickets } = useSelector((state) => state.admin);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    category: [],
    priority: [],
  });
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const getSortedTickets = (ticketsArray) => {
    return [...ticketsArray]?.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Handle search and filtering
  useEffect(() => {
    let result = tickets;

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (ticket) =>
          ticket._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.status.length > 0) {
      result = result.filter((ticket) =>
        filters.status.includes(ticket.status)
      );
    }
    if (filters.category.length > 0) {
      result = result.filter((ticket) =>
        filters.category.includes(ticket.category)
      );
    }

    // Apply sorting
    // if (result?.length > 0) {
    result = getSortedTickets(result);
    // }

    setFilteredTickets(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets, searchTerm, filters, sortConfig]);

  // Toggle filter for status, category or priority
  const toggleFilter = (type, value) => {
    setFilters((prevFilters) => {
      const newValues = [...prevFilters[type]];
      const index = newValues.indexOf(value);

      if (index === -1) {
        newValues.push(value);
      } else {
        newValues.splice(index, 1);
      }

      return {
        ...prevFilters,
        [type]: newValues,
      };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: [],
      category: [],
      priority: [],
    });
    setSearchTerm("");
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    return [...new Set(tickets.map((ticket) => ticket[key]))];
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Support Tickets
          </h1>
          <div className="flex space-x-3"></div>
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
                placeholder="Search tickets by ID, description or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                className={`flex items-center px-4 py-2 border ${
                  filterOpen
                    ? "bg-indigo-50 border-indigo-200"
                    : "border-gray-200"
                } rounded-md text-sm font-medium hover:bg-gray-50`}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter size={16} className="mr-2 text-gray-500" />
                Filter
                <ChevronDown size={16} className="ml-2 text-gray-500" />
              </button>

              {/* Filter Dropdown */}
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-700">
                        Filters
                      </h3>
                      <button
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                        onClick={clearFilters}
                      >
                        Clear all
                      </button>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">
                        Status
                      </h4>
                      <div className="space-y-2">
                        {getUniqueValues("status").map((status) => (
                          <label key={status} className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 rounded"
                              checked={filters.status.includes(status)}
                              onChange={() => toggleFilter("status", status)}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {status}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">
                        Category
                      </h4>
                      <div className="space-y-2">
                        {getUniqueValues("category").map((category) => (
                          <label key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 rounded"
                              checked={filters.category.includes(category)}
                              onChange={() =>
                                toggleFilter("category", category)
                              }
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Priority Filter */}
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-2">
                        Priority
                      </h4>
                      <div className="space-y-2">
                        {getUniqueValues("priority").map((priority) => (
                          <label key={priority} className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 rounded"
                              checked={filters.priority.includes(priority)}
                              onChange={() =>
                                toggleFilter("priority", priority)
                              }
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {priority}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Active Filters */}
            {(filters.status.length > 0 ||
              filters.category.length > 0 ||
              filters.priority.length > 0) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-500">Active filters:</span>
                {filters.status.map((status) => (
                  <span
                    key={status}
                    className="flex items-center bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded"
                  >
                    Status: {status}
                    <button
                      className="ml-1 text-indigo-500 hover:text-indigo-700"
                      onClick={() => toggleFilter("status", status)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {filters.category.map((category) => (
                  <span
                    key={category}
                    className="flex items-center bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded"
                  >
                    Category: {category}
                    <button
                      className="ml-1 text-indigo-500 hover:text-indigo-700"
                      onClick={() => toggleFilter("category", category)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {filters.priority.map((priority) => (
                  <span
                    key={priority}
                    className="flex items-center bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded"
                  >
                    Priority: {priority}
                    <button
                      className="ml-1 text-indigo-500 hover:text-indigo-700"
                      onClick={() => toggleFilter("priority", priority)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ticket Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("id")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Ticket ID</span>
                      {renderSortIndicator("id")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("category")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Category</span>
                      {renderSortIndicator("category")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span>Description</span>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {renderSortIndicator("status")}
                    </div>
                  </th>
                  {/* <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("priority")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Priority</span>
                      {renderSortIndicator("priority")}
                    </div>
                  </th> */}
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("createdAt")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                      {renderSortIndicator("createdAt")}
                    </div>
                  </th>
                  {/* <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets && filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/tickets/${ticket._id}`);
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-900 px-2 w-fit">
                          {ticket._id.slice(0, 6)}...
                        </div>
                        <div className="text-xs text-gray-500 w-fit px-2">
                          {ticket.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {ticket.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {ticket.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={ticket.status} />
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <PriorityIndicator priority={ticket.priority} />
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(ticket.created_at)}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                          <MoreHorizontal size={16} />
                        </button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                          <AlertCircle size={32} />
                        </div>
                        <h3 className="text-base font-medium text-gray-900">
                          No tickets found
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {searchTerm ||
                          Object.values(filters).some((arr) => arr.length > 0)
                            ? "Try adjusting your search or filter criteria"
                            : "There are no tickets in the system yet"}
                        </p>
                        {(searchTerm ||
                          Object.values(filters).some(
                            (arr) => arr.length > 0
                          )) && (
                          <button
                            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
                            onClick={clearFilters}
                          >
                            Clear all filters
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
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">
                      {filteredTickets?.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredTickets?.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <ChevronDown className="h-5 w-5 rotate-90" />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      2
                    </button>
                    <button className="hidden md:inline-flex relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      10
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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
