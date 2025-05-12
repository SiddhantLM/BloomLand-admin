import { getAllInvoices } from "@/services/invoices";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  Search,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { format } from "date-fns";

const Invoices = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const invoiceRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const getInvoices = async () => {
      const res = await getAllInvoices({ token });
      setUsers(res);
    };
    getInvoices();
  }, [token]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Handle search
  useEffect(() => {
    const results =
      users &&
      users.length > 0 &&
      users.filter(
        (user) =>
          user._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.user_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.product_id.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Sort users
  useEffect(() => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.user_id.name.localeCompare(b.user_id.name)
          : b.user_id.name.localeCompare(a.user_id.name);
      } else if (sortField === "created_at") {
        return sortDirection === "asc"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      } else if (sortField === "amount") {
        return sortDirection === "asc"
          ? parseInt(a.amount) - parseInt(b.amount)
          : parseInt(b.amount) - parseInt(a.amount);
      }
      return 0;
    });
    setFilteredUsers(sortedUsers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, sortDirection]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle checkboxes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedUsers(!selectAll ? currentUsers.map((user) => user._id) : []);
  };

  const handleSelect = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
      setSelectAll(false);
    } else {
      setSelectedUsers([...selectedUsers, id]);
      if (selectedUsers.length + 1 === currentUsers.length) {
        setSelectAll(true);
      }
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.log(error);
      return "Invalid Date";
    }
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount / 100); // Assuming amount is in paise/cents
  };

  // Generate and download PDF for a single invoice
  const generatePDF = async (orderData) => {
    setSelectedInvoice(orderData);
    setIsGeneratingPDF(true);

    // Wait for the next render cycle so the invoice element is created
    setTimeout(async () => {
      try {
        const invoiceElement = document.getElementById("invoice-container");

        if (!invoiceElement) {
          console.error("Invoice element not found");
          setIsGeneratingPDF(false);
          return;
        }

        // Apply conservative inline styles to prevent any color function issues
        const styleAllTextElements = (element) => {
          // Apply safe colors to all text elements
          const textElements = element.querySelectorAll(
            "p, h1, h2, h3, h4, h5, h6, span, div, td, th"
          );
          textElements.forEach((el) => {
            if (el.classList.contains("text-green-600")) {
              el.style.color = "#059669"; // Standard hex color for green-600
            } else if (el.classList.contains("text-gray-800")) {
              el.style.color = "#1f2937"; // Standard hex color for gray-800
            } else if (el.classList.contains("text-gray-700")) {
              el.style.color = "#374151"; // Standard hex color for gray-700
            } else if (el.classList.contains("text-gray-600")) {
              el.style.color = "#4b5563"; // Standard hex color for gray-600
            } else if (el.classList.contains("text-blue-600")) {
              el.style.color = "#2563eb"; // Standard hex color for blue-600
            } else {
              el.style.color = "#000000"; // Default black
            }
          });

          // Handle background colors
          const bgElements = element.querySelectorAll('[class*="bg-"]');
          bgElements.forEach((el) => {
            if (el.classList.contains("bg-gray-100")) {
              el.style.backgroundColor = "#f3f4f6"; // Standard hex color for gray-100
            } else if (el.classList.contains("bg-white")) {
              el.style.backgroundColor = "#ffffff"; // Standard white
            }
          });
        };

        // Clone the invoice element to avoid modifying the original
        const clonedInvoice = invoiceElement.cloneNode(true);

        // Apply safe styles to the clone
        styleAllTextElements(clonedInvoice);

        // Create a temporary container for the clone
        const tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        tempContainer.appendChild(clonedInvoice);
        document.body.appendChild(tempContainer);

        // Render the styled clone to canvas
        const canvas = await html2canvas(clonedInvoice, {
          scale: 2, // Higher scale for better quality
          logging: false,
          useCORS: true,
          backgroundColor: "#ffffff",
          // Explicitly avoid using any problematic color formats
          onclone: (document) => {
            const styles = document.createElement("style");
            styles.innerHTML = `
              * {
                color: #000000 !important;
                background-color: #ffffff !important;
              }
              .text-green-600 { color: #059669 !important; }
              .text-gray-800 { color: #1f2937 !important; }
              .text-gray-700 { color: #374151 !important; }
              .text-gray-600 { color: #4b5563 !important; }
              .bg-gray-100 { background-color: #f3f4f6 !important; }
            `;
            document.head.appendChild(styles);
          },
        });

        // Remove the temporary container
        document.body.removeChild(tempContainer);

        const imgData = canvas.toDataURL("image/png");

        // A4 dimensions: 210 x 297 mm
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgWidth = 190;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10; // Starting position

        // Add first page
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Generate filename based on order ID
        const filename = `invoice_${orderData.order_id || orderData._id}.pdf`;

        // Download the PDF
        pdf.save(filename);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate invoice. Please try again.");
      } finally {
        setIsGeneratingPDF(false);
        setSelectedInvoice(null);
      }
    }, 100);
  };

  // Handle bulk download
  const handleBulkDownload = async () => {
    const usersToDownload = filteredUsers.filter((user) =>
      selectedUsers.includes(user._id)
    );

    // Actually implement bulk download functionality
    if (usersToDownload.length > 0) {
      // Set a loading state
      setIsGeneratingPDF(true);

      try {
        // Process each invoice one at a time
        for (let i = 0; i < usersToDownload.length; i++) {
          // Add a small delay between each PDF to prevent browser freezing
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
          await generatePDF(usersToDownload[i]);
        }
      } catch (error) {
        console.error("Error in bulk download:", error);
        alert("There was an error generating some invoices.");
      } finally {
        setIsGeneratingPDF(false);
      }
    }
  };

  // Handle individual download
  const handleDownload = (id) => {
    const user = users.find((user) => user._id === id);
    if (user) {
      generatePDF(user);
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers =
    filteredUsers &&
    filteredUsers.length > 0 &&
    filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp size={16} />
    ) : (
      <ArrowDown size={16} />
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by ID, name or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={filterRef}>
              <button
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} className="mr-2" />
                Filters
                <ChevronDown size={16} className="ml-2" />
              </button>

              {showFilters && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <p className="px-4 py-2 text-sm font-medium text-gray-900">
                      Sort by Name
                    </p>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setSortField("name");
                        setSortDirection("asc");
                        setShowFilters(false);
                      }}
                    >
                      A to Z
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setSortField("name");
                        setSortDirection("desc");
                        setShowFilters(false);
                      }}
                    >
                      Z to A
                    </button>

                    <hr className="my-1" />

                    <p className="px-4 py-2 text-sm font-medium text-gray-900">
                      Sort by Amount
                    </p>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setSortField("amount");
                        setSortDirection("desc");
                        setShowFilters(false);
                      }}
                    >
                      High to Low
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setSortField("amount");
                        setSortDirection("asc");
                        setShowFilters(false);
                      }}
                    >
                      Low to High
                    </button>

                    <hr className="my-1" />

                    <p className="px-4 py-2 text-sm font-medium text-gray-900">
                      Sort by Date
                    </p>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setSortField("created_at");
                        setSortDirection("desc");
                        setShowFilters(false);
                      }}
                    >
                      Newest First
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => {
                        setSortField("created_at");
                        setSortDirection("asc");
                        setShowFilters(false);
                      }}
                    >
                      Oldest First
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className={`flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg ${
                  selectedUsers.length === 0 || isGeneratingPDF
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
                disabled={selectedUsers.length === 0 || isGeneratingPDF}
                onClick={handleBulkDownload}
              >
                <Download size={16} className="mr-2" />
                {isGeneratingPDF ? "Generating..." : "Download"}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <label htmlFor="checkbox-all" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID
                    <SortIcon field="id" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Event
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers &&
                currentUsers.length > 0 &&
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-${user._id}`}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelect(user._id)}
                        />
                        <label
                          htmlFor={`checkbox-${user._id}`}
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {user._id.slice(0, 4)}...
                    </td>
                    <td className="px-6 py-4">{user.user_id.name}</td>
                    <td className="px-6 py-4">{user?.product_id?.title}</td>
                    <td className="px-6 py-4">{user.product_id?.category}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDownload(user._id)}
                        disabled={isGeneratingPDF}
                        className={`flex items-center ml-auto text-blue-600 hover:underline ${
                          isGeneratingPDF ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Download size={16} className="mr-1" />
                        {isGeneratingPDF && selectedInvoice?._id === user._id
                          ? "Generating..."
                          : "Download"}
                      </button>
                    </td>
                  </tr>
                ))}
              {currentUsers && currentUsers.length === 0 && (
                <tr className="bg-white border-b">
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstUser + 1}-
            {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className={`p-2 border rounded ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 border rounded ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-2">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || !totalPages}
              className={`p-2 border rounded ${
                currentPage === totalPages || !totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages || !totalPages}
              className={`p-2 border rounded ${
                currentPage === totalPages || !totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Hidden invoice template that will be converted to PDF */}
      {selectedInvoice && (
        <div className="hidden">
          <div
            id="invoice-container"
            className="bg-white p-8 w-full max-w-3xl mx-auto my-8 shadow-lg"
            style={{ fontFamily: "Arial, sans-serif" }}
            ref={invoiceRef}
          >
            {/* Invoice Header */}
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
                <p className="text-gray-600 mt-1">
                  #{selectedInvoice.order_id || selectedInvoice._id}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold">Bloom Events</h2>
                <p className="text-gray-600">support@bloom.events</p>
                <p className="text-gray-600">Ahmedabad, Gujarat, India</p>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="flex justify-between mb-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Billed To:</h3>
                <p className="text-gray-700 font-medium">
                  {selectedInvoice.user_id.name}
                </p>
                <p className="text-gray-600">{selectedInvoice.user_id.email}</p>
                <p className="text-gray-600">
                  User ID: {selectedInvoice.user_id._id}
                </p>
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <span className="font-semibold text-gray-800">
                    Invoice Date:
                  </span>
                  <span className="text-gray-600 ml-2">
                    {formatDate(selectedInvoice.created_at)}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-800">
                    Payment ID:
                  </span>
                  <span className="text-gray-600 ml-2">
                    {selectedInvoice.payment_id}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Status:</span>
                  <span className="text-green-600 ml-2 font-medium">Paid</span>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Event Details:
              </h3>
              <table className="w-full mb-8">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-left">Dates</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">
                      <div className="font-medium">
                        {selectedInvoice.product_id.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        Event ID: {selectedInvoice.product_id._id}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {selectedInvoice.product_id.category}
                    </td>
                    <td className="py-3 px-4">
                      {formatDate(selectedInvoice.product_id.start_date)} -{" "}
                      {formatDate(selectedInvoice.product_id.end_date)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(selectedInvoice.amount)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td className="py-3 px-4" colSpan="3" align="right">
                      Total
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(selectedInvoice.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Invoice Footer */}
            <div className="border-t pt-4 text-center text-gray-600 text-sm">
              <p>Thank you for your business!</p>
              <p className="mt-1">
                For any questions regarding this invoice, please contact
                support@bloom.events
              </p>
              <p className="mt-4 text-xs">
                Invoice generated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
