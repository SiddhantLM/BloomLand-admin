import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Filter,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";

const UserDataTable = ({ usersData }) => {
  // State variables
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    fieldOfWork: "",
    city: "",
    status: "",
  });
  const [appliedFilters, setAppliedFilters] = useState([]);

  // Settings
  const usersPerPage = 3;

  // Derived state
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Get unique values for filter dropdowns
  const uniqueFields = [...new Set(users?.map((user) => user.fieldOfWork))];
  const uniqueCities = [...new Set(users?.map((user) => user.city))];
  const statusOptions = ["Pending", "Approved", "Rejected"];
  const navigate = useNavigate();

  // Calculate age from date of birth
  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    setUsers(usersData);
  }, [usersData]);

  // Handle search
  useEffect(() => {
    applyFiltersAndSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, appliedFilters, users]);

  const applyFiltersAndSearch = () => {
    let result = users ? [...users] : null;

    // Apply search term
    if (users && searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user._id.toLowerCase().includes(searchTerm.toLowerCase())
        // user.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // user.journey.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    appliedFilters.forEach((filter) => {
      result = result.filter((user) => user[filter.type] === filter.value);
    });

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle checkbox selection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      setSelectAll(false);
    } else {
      setSelectedUsers([...selectedUsers, userId]);
      if (selectedUsers.length + 1 === currentUsers.length) {
        setSelectAll(true);
      }
    }
  };

  // Handle pagination
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Handle bulk actions
  const handleApproveAll = () => {
    setUsers(
      users.map((user) =>
        selectedUsers.includes(user.id) ? { ...user, status: "Approved" } : user
      )
    );
    setSelectedUsers([]);
    setSelectAll(false);
  };

  const handleRejectAll = () => {
    setUsers(
      users.map((user) =>
        selectedUsers.includes(user.id) ? { ...user, status: "Rejected" } : user
      )
    );
    setSelectedUsers([]);
    setSelectAll(false);
  };

  // Handle individual actions
  // const handleApproveUser = (userId) => {
  //   setUsers(
  //     users.map((user) =>
  //       user.id === userId ? { ...user, status: "Approved" } : user
  //     )
  //   );
  // };

  // const handleRejectUser = (userId) => {
  //   setUsers(
  //     users.map((user) =>
  //       user.id === userId ? { ...user, status: "Rejected" } : user
  //     )
  //   );
  // };

  // Handle filter actions
  const applyFilter = () => {
    const newFilters = [];

    if (filters.fieldOfWork) {
      newFilters.push({ type: "fieldOfWork", value: filters.fieldOfWork });
    }

    if (filters.city) {
      newFilters.push({ type: "city", value: filters.city });
    }

    if (filters.status) {
      newFilters.push({ type: "status", value: filters.status });
    }

    setAppliedFilters(newFilters);
    setShowFilterPanel(false);
  };

  const removeFilter = (filter) => {
    setAppliedFilters(
      appliedFilters.filter(
        (f) => !(f.type === filter.type && f.value === filter.value)
      )
    );
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
    setFilters({
      fieldOfWork: "",
      city: "",
      status: "",
    });
  };

  const getUserStatus = (level) => {
    if (level === 0) {
      return "Not Approved";
    } else if (level === 1) {
      return "Day 0";
    } else if (level === 2) {
      return "10x";
    } else if (level === 3) {
      return "100x";
    }
  };

  const getUserReady = (state) => {
    if (state === "100") {
      return "Fully ready";
    } else if (state === "mostly") {
      return "Mostly ready";
    } else if (state === "reset") {
      return "Still opening to it";
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold">User Management</div>
      {users && users.length > 0 ? (
        <>
          <p className="text-gray-500">
            Review and manage user profiles and information
          </p>

          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <Input
                placeholder="Search users..."
                className="pl-3 pr-10 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={selectedUsers.length === 0}
                  >
                    Bulk Actions
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleApproveAll}>
                    Approve All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRejectAll}>
                    Reject All
                  </DropdownMenuItem>
                  <DropdownMenuItem>Export Selected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Filter Users</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilterPanel(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Field of Work
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={filters.fieldOfWork}
                    onChange={(e) =>
                      setFilters({ ...filters, fieldOfWork: e.target.value })
                    }
                  >
                    <option value="">All Fields</option>
                    {uniqueFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={filters.city}
                    onChange={(e) =>
                      setFilters({ ...filters, city: e.target.value })
                    }
                  >
                    <option value="">All Cities</option>
                    {uniqueCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
                <Button size="sm" onClick={applyFilter}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}

          {/* Applied Filters */}
          {appliedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Active filters:</span>
              {appliedFilters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                >
                  <span className="mr-1 font-medium">{filter.type}:</span>
                  {filter.value}
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => removeFilter(filter)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={clearAllFilters}
              >
                Clear all
              </button>
            </div>
          )}

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-28">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Field of Work</TableHead>
                  <TableHead>Readiness</TableHead>
                  {/* <TableHead>City</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers &&
                  currentUsers.length > 0 &&
                  currentUsers.map((user) => (
                    <TableRow
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/users/${user._id}`);
                      }}
                      key={user?._id}
                      className={
                        user.status === "Approved"
                          ? "bg-green-50"
                          : user.status === "Rejected"
                          ? "bg-red-50"
                          : ""
                      }
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className=" text-sm bg-gray-100 w-fit px-2 py-1">
                          {user?._id?.slice(0, 4)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {calculateAge(user.dob)} years old
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{user.journey}</div>
                        <div className="text-sm text-gray-500">
                          {/* {user.category} */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{getUserReady(user.ready)}</div>
                        <div className="text-sm text-gray-500">
                          {user.revenue}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                      <div>{user.city}</div>
                    </TableCell> */}
                      <TableCell>
                        <div
                          className={`rounded-full px-2 py-1 text-xs font-medium w-fit ${
                            user.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : user.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {getUserStatus(user.allowed)}
                        </div>
                      </TableCell>
                      {/* {title === "Requests" && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveUser(user._id);
                              }}
                              disabled={user.status === "Approved"}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();  
                                handleRejectUser(user._id);
                              }}
                              disabled={user.status === "Rejected"}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      )} */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstUser + 1}-
              {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
              >
                <ChevronFirst className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex items-center px-3 text-sm">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
              >
                <ChevronLast className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div>No users to display</div>
      )}
    </div>
  );
};

export default UserDataTable;
