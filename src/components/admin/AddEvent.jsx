"use client";

import { useState, useRef } from "react";
import { CalendarIcon, PlusCircle, X, Clock } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addEvent } from "@/services/event";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "primereact/editor";

// Simple Date Picker Component
const DatePicker = ({ date, setDate, label, disabled }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-gray-400"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : label || "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          // onSelect={setDate}
          initialFocus
          disabled={disabled}
          onSelect={(selected) => {
            setDate(selected);
            setOpen(false); // Close the popover after selection
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

// Time Picker Component
const TimePicker = ({ selectedTime, setSelectedTime }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ["00", "15", "30", "45"];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedTime && "text-gray-400"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedTime || "Select a time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-2 max-h-64 overflow-y-auto">
          {hours.map((hour) => {
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            const amPm = hour < 12 ? "AM" : "PM";

            return minutes.map((minute) => {
              const timeString = `${displayHour}:${minute} ${amPm}`;

              return (
                <div
                  key={`${hour}-${minute}`}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded-md"
                  onClick={() => {
                    setSelectedTime(timeString);
                  }}
                >
                  {timeString}
                </div>
              );
            });
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default function AddEventModal() {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [inclusion, setInclusion] = useState("");
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [description, setDescription] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: {
      city: "",
      state: "",
      country: "",
    },
    price: "",
    inclusions: [],
    images: [],
    eventType: "day0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "city") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, city: value },
      }));
    } else if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, state: value },
      }));
    } else if (name === "country") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, country: value },
      }));
    }

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAddInclusion = () => {
    if (inclusion.trim() === "") return;

    setFormData((prev) => ({
      ...prev,
      inclusions: [...prev.inclusions, inclusion.trim()],
    }));
    setInclusion("");
  };

  const handleRemoveInclusion = (index) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    addImagesToFormData(Array.from(files));
  };

  const addImagesToFormData = (files) => {
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      addImagesToFormData(imageFiles);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!formData.price.trim()) newErrors.price = "Starting price is required";
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // "2025-04-24"
  };

  function convertTo24HrFormat(timeString) {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") hours = String(+hours + 12);
    if (modifier === "AM" && hours === "12") hours = "00";

    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  const formatTimestamp = (date, time) => {
    if (!date || !time) return null;

    const day = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const fullTime = convertTo24HrFormat(time); // "HH:mm"
    return `${day} ${fullTime}:00`; // "YYYY-MM-DD HH:mm:ss"
  };

  const handleSubmit = (status) => {
    if (!validateForm()) return;

    // Prepare data for submission
    const eventData = {
      // ...formData,
      startDate,
      endDate,
      // status,
      scheduledFor:
        status === "scheduled"
          ? {
              date: scheduleDate,
              time: scheduleTime,
            }
          : null,

      inclusions: formData.inclusions,
      images: formData.images,
      type: formData.eventType,
      location: formData.location,
      price: formData.price,
      title: formData.title,
      description: formData.description,
      visibility: status === "published" ? "public" : "private",
    };

    console.log("Submitted Event:", eventData);

    const data = new FormData();

    // Add basic text fields
    data.append("title", formData.title);
    data.append("description", description);
    data.append("price", formData.price);
    data.append("type", formData.eventType);
    data.append("visibility", status === "published" ? "public" : "private");

    // Add location as JSON string
    data.append("location", JSON.stringify(formData.location));

    // Add dates
    if (startDate) data.append("startDate", formatDate(startDate));
    if (endDate) data.append("endDate", formatDate(endDate));

    // Add scheduling information if applicable
    if (status === "scheduled" && scheduleDate && scheduleTime) {
      const scheduledFor = formatTimestamp(scheduleDate, scheduleTime);
      data.append("scheduledFor", scheduledFor);
    }

    // Add inclusions as JSON string
    if (formData.inclusions.length > 0) {
      formData.inclusions.forEach((inclusion) => {
        data.append("inclusions", inclusion);
      });

      // data.append("inclusions", formData.inclusions);
    }

    // Add images
    formData.images.forEach((imageObj) => {
      // Append the actual file object, not the preview object
      data.append("images", imageObj.file);
    });
    dispatch(addEvent({ event: data, token: token }));

    // let message = "";
    // if (status === "published") message = "Event published!";
    // else if (status === "draft") message = "Event saved as draft!";
    // else if (status === "scheduled")
    //   message = `Event scheduled for ${format(
    //     scheduleDate,
    //     "PPP"
    //   )} at ${scheduleTime}!`;

    // alert(message);

    // Reset the form
    setFormData({
      title: "",
      description: "",
      city: "",
      state: "",
      country: "",
      price: "",
      inclusions: [],
      images: [],
      location: {
        city: "",
        state: "",
        country: "",
      },
    });
    setStartDate(null);
    setEndDate(null);
    setScheduleDate(null);
    setScheduleTime(null);
    setInclusion("");
    setOpen(false);
    setDescription(null);
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-800 transition"
        >
          + Add Event
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3">
          <div className="bg-white rounded-md w-full max-w-xl relative max-h-[90vh] overflow-y-auto thin-scrollbar">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-2xl"
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
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Event title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } rounded-md px-3 py-2 text-gray-700`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <Editor
                  value={formData.description}
                  name="description"
                  className=""
                  onTextChange={(e) => setDescription(e.htmlValue)}
                  style={{ height: "320px" }}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.eventType ? "border-red-500" : "border-gray-300"
                    } rounded-md px-3 py-2 text-gray-700`}
                  >
                    <option value="day0">Day 0</option>
                    <option value="10x">10x</option>
                    <option value="100x">100x</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 justify-between">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      date={startDate}
                      setDate={setStartDate}
                      label="Select start date"
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <DatePicker
                      date={endDate}
                      setDate={setEndDate}
                      label="Select end date"
                      disabled={(date) =>
                        !startDate ||
                        date <= new Date(startDate.setHours(0, 0, 0, 0))
                      }
                    />
                  </div>
                </div>

                {/* Starting Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Starting Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="text"
                      name="price"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full border ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      } rounded-md pl-7 pr-3 py-2 text-gray-700`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.location.city}
                    onChange={handleChange}
                    className={`w-full border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } rounded-md px-3 py-2 text-gray-700 mb-2`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mb-1">{errors.city}</p>
                  )}
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.location.state}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 mb-2"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.location.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                  />
                </div>

                {/* Inclusions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What's Included
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) => setInclusion(e.target.value)}
                      placeholder="Add what's included in this event"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddInclusion();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddInclusion}
                      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                    >
                      <PlusCircle size={20} />
                    </button>
                  </div>

                  {formData.inclusions.length > 0 && (
                    <ul className="space-y-1 border border-gray-200 rounded-md p-3 bg-gray-50">
                      {formData.inclusions.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2"></span>
                            {item}
                          </div>
                          <button
                            onClick={() => handleRemoveInclusion(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Multiple Image Upload with Drag and Drop */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Images
                  </label>
                  <div
                    ref={fileInputRef}
                    className={`border-2 border-dashed ${
                      isDragging
                        ? "border-blue-500 bg-blue-50"
                        : formData.images.length > 0
                        ? "border-blue-300"
                        : "border-gray-300"
                    } rounded-md p-6 flex flex-col items-center justify-center text-gray-500 transition-colors`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      multiple
                      ref={fileInputRef}
                    />

                    {formData.images.length === 0 ? (
                      <>
                        <p className="text-sm text-center mb-2">
                          {isDragging
                            ? "Drop images here"
                            : "Drag and drop images here or click to select"}
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="px-4 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-200"
                        >
                          Select Images
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-2 w-full mb-3">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="relative h-20 w-full">
                                <img
                                  src={image.preview}
                                  alt={`Preview ${index}`}
                                  className="h-full w-full object-cover rounded-md"
                                />
                                <button
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                              <p className="text-xs truncate mt-1 text-gray-500">
                                {image.name}
                              </p>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="px-4 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-200"
                        >
                          Add More Images
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Schedule Publication */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Schedule Publication
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Date
                      </label>
                      <DatePicker
                        date={scheduleDate}
                        setDate={setScheduleDate}
                        label="Schedule date"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Time
                      </label>
                      <TimePicker
                        selectedTime={scheduleTime}
                        setSelectedTime={setScheduleTime}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => handleSubmit("draft")}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
                    type="button"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleSubmit("published")}
                    className="flex-1 bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800"
                    type="button"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => {
                      if (!scheduleDate || !scheduleTime) {
                        alert(
                          "Please select both a date and time to schedule publication"
                        );
                        return;
                      }
                      handleSubmit("scheduled");
                    }}
                    className="flex-1 bg-green-700 text-white py-2 rounded-md hover:bg-green-600"
                    type="button"
                    disabled={!scheduleDate || !scheduleTime}
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
