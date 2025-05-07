import { useState } from "react";

export default function EventModal({ open, setOpen }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "April 11th, 2025",
    venue: "",
    landmark: "",
    city: "",
    state: "",
    organizerName: "",
    organizerEmail: "",
    poster: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = () => {
    // This would be implemented with actual file upload functionality
    console.log("Select image clicked");
  };

  const handleSubmit = () => {
    console.log("Creating event with data:", formData);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white rounded-md w-full max-w-md relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Add New Event
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Create a new event by filling in the details below.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Event title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Event description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 text-gray-700"
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 mb-2"
              />
              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 mb-2"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer Name
                </label>
                <input
                  type="text"
                  name="organizerName"
                  placeholder="Organizer name"
                  value={formData.organizerName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer Email
                </label>
                <input
                  type="email"
                  name="organizerEmail"
                  placeholder="Organizer email"
                  value={formData.organizerEmail}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Poster
              </label>
              <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-gray-500">
                <p className="text-sm text-center mb-2">
                  Drag and drop an image here or click to select
                </p>
                <button
                  onClick={handleImageUpload}
                  className="px-4 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm"
                >
                  Select Image
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
