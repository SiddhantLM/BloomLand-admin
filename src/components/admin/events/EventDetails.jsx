import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  Mail,
  Users,
  Trash2,
  PenLine,
  ArrowLeft,
  Share2,
  Calendar,
  Download,
  Copy,
  CheckCheck,
  Save,
  X,
  Upload,
  PlusCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteEvent, updateEvent } from "@/services/event";
import { useSelector } from "react-redux";
import { Editor } from "primereact/editor";
export default function EventDetail({ event, setEvent }) {
  const [copied, setCopied] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [inclusion, setInclusion] = useState("");
  const [description, setDescription] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [newPreview, setNewPreview] = useState([]);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // const [startDate, setStartDate] = useState(
  //   event ? new Date(event.start_date) : new Date()
  // );
  // const [endDate, setEndDate] = useState(
  //   event && event.end_date ? new Date(event.end_date) : null
  // );
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: null,
    images: [],
    price: "0",
    eventType: "day0",
    inclusions: [],
    organizerInfo: {
      name: "",
      email: "",
    },
  });

  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      setFormData({
        title: event.title || "",
        description: event.description || "",
        startDate: format(eventDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        eventType: event.type || "day0",
        price: event.price?.toString() || "0",
        location: event.location || "",
        images: event.images ? event.images : [],
        inclusions: event.includes || [],
      });
      setDescription(event.description);
      setState(event.location?.state);
      setCity(event.location?.city);
      setCountry(event.location?.country);
    }
  }, [event]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const isUpcoming = new Date(event.start_date) > new Date();

  // Handle copy event link
  const copyEventLink = () => {
    const eventLink = `${window.location.origin}/events/${event._id}`;
    navigator.clipboard.writeText(eventLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle download event details
  const downloadEventDetails = () => {
    const eventDetails = `
      ${event.title}
      Date: ${format(new Date(event.start_date), "PPP")}
      Location: ${event.location.city}, ${event.location.state}, ${
      event.location.country
    }
      
      Description: ${event.description}
    `;

    const element = document.createElement("a");
    const file = new Blob([eventDetails], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${event.title
      .toLowerCase()
      .replace(/\s+/g, "-")}-details.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Form handlers for edit dialog
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddInclusion = () => {
    if (inclusion.trim()) {
      setFormData({
        ...formData,
        inclusions: [...formData.inclusions, inclusion.trim()],
      });
      setInclusion("");
    }
  };

  const handleRemoveInclusion = (index) => {
    const updatedInclusions = [...formData.inclusions];
    updatedInclusions.splice(index, 1);
    setFormData({
      ...formData,
      inclusions: updatedInclusions,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const preview = files.map((file) => URL.createObjectURL(file));
    // handleImageFiles(files);
    setNewImages([...newImages, ...files]);
    setNewPreview([...newPreview, ...preview]);
  };

  const handleImageFiles = (files) => {
    const newImages = files.map((file) => file);

    setFormData({
      ...formData,
      images: [...formData.images, ...newImages],
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    // Revoke the URL to prevent memory leaks
    if (updatedImages[index].preview) {
      URL.revokeObjectURL(updatedImages[index].preview);
    }
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  // Drag and drop handlers
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
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      handleImageFiles(files);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.location.city.trim()) {
      newErrors.city = "City is required";
    }

    if (isNaN(parseFloat(formData.price))) {
      newErrors.price = "Price must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (status) => {
    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", description);
    data.append("price", formData.price);
    data.append("type", formData.eventType);
    data.append("visibility", status === "published" ? "public" : "private");
    data.append(
      "location",
      JSON.stringify({
        city: city,
        state: state,
        country: country,
      })
    );
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    if (formData.inclusions.length > 0) {
      formData.inclusions.forEach((inclusion) => {
        data.append("inclusions", inclusion);
      });
    }
    newImages.map((imageObj) => {
      // Append the actual file object, not the preview object
      data.append("newImages", imageObj);
    });
    formData.images.map((image) => {
      data.append("images", image);
    });
    // data.append("startDate", startDate);
    // data.append("endDate", endDate);
    if (status === "scheduled" && scheduleDate && scheduleTime) {
      const scheduledFor = formatTimestamp(scheduleDate, scheduleTime);
      data.append("scheduledFor", scheduledFor);
    }

    // Here you would typically submit the form data to your API
    console.log("Form submitted with status:", data);
    await updateEvent({
      event: data,
      token: token,
      setEvent: setEvent,
      eventId: id,
    });
    // Close the dialog
    setEditDialogOpen(false);
    // navigate(`/admin/events/${id}`);
    window.location.reload();

    // Show success message
    // alert(
    //   `Event ${
    //     status === "draft"
    //       ? "saved as draft"
    //       : status === "published"
    //       ? "published"
    //       : "scheduled"
    //   } successfully!`
    // );
  };

  const openEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    await deleteEvent({ eventId: id, token: token, navigate: navigate });
  };

  // Mock DatePicker and TimePicker components for the example
  const DatePicker = ({ date, setDate, disabled, label }) => {
    return (
      <Input
        type="date"
        value={date ? format(date, "yyyy-MM-dd") : ""}
        onChange={(e) => setDate(new Date(e.target.value))}
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        disabled={typeof disabled === "function" ? false : disabled}
        aria-label={label}
      />
    );
  };

  const TimePicker = ({ selectedTime, setSelectedTime }) => (
    <Input
      type="time"
      value={selectedTime || ""}
      onChange={(e) => setSelectedTime(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2"
    />
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/events")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <h1 className="text-3xl font-bold flex-1">Event Details</h1>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={openEditDialog}>
                  <PenLine className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Event</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AlertDialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  event "{event.title}" and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
                  <CardDescription className="text-lg">
                    <p
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    ></p>
                  </CardDescription>
                </div>
                <Badge
                  variant={isUpcoming ? "default" : "secondary"}
                  className="text-sm font-medium"
                >
                  {isUpcoming ? "Upcoming" : "Past"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-64 mb-6">
                <img
                  src={event.images[0] || "/api/placeholder/800/400"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="px-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="attendees">Attendees</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Date
                            </p>
                            <p className="font-medium">
                              {format(new Date(event.start_date), "PPP")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Time
                            </p>
                            <p className="font-medium">
                              {format(new Date(event.start_date), "p")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Location
                            </p>
                            <p className="font-medium">
                              {formData?.location?.city},{" "}
                              {formData?.location?.state},{" "}
                              {formData?.location?.country}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {event.organizer && (
                          <>
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-3 rounded-full">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Organizer
                                </p>
                                <p className="font-medium">
                                  {event.organizer?.name
                                    ? event.organizer.name
                                    : "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-3 rounded-full">
                                <Mail className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Contact
                                </p>
                                <p className="font-medium">
                                  {event.organizer?.email
                                    ? event.organizer.email
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Attendees
                            </p>
                            <p className="font-medium">
                              {event.attendees?.length > 0
                                ? event.attendees.length
                                : "0 "}
                              registered
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="attendees">
                    <div className="rounded-md border p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Attendee Management</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            Total:{" "}
                            {event.attendees?.length
                              ? event.attendees.length
                              : "0"}
                          </p>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export List
                          </Button>
                        </div>
                      </div>
                      {event.attendees?.length > 0 ? (
                        <p className="text-muted-foreground">
                          View and manage attendees here. Full list available
                          for export.
                        </p>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            No attendees have registered yet
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="analytics">
                    <div className="rounded-md border p-4">
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-lg font-medium mb-1">
                          Event Analytics
                        </p>
                        <p className="text-muted-foreground">
                          Analytics data will be available after the event
                          starts
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="flex md:flex-row flex-col items-start justify-end gap-2 pt-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadEventDetails}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Details
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download event information</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={copyEventLink}>
                      {copied ? (
                        <>
                          <CheckCheck className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy event link to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button variant="default" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Admin Controls</CardTitle>
              <CardDescription>Manage event settings and tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Quick Actions</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start overflow-x-clip"
                    onClick={openEditDialog}
                  >
                    <PenLine className="h-4 w-4 mr-2 md:mr-0" />
                    <span className="md:hidden lg:inline ml-2">Edit Event</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start overflow-x-clip"
                  >
                    <Users className="h-4 w-4 mr-2 md:mr-0" />
                    <span className="md:hidden lg:inline ml-2">
                      Manage Attendees
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start overflow-x-clip"
                  >
                    <Share2 className="h-4 w-4 mr-2 md:mr-0" />
                    <span className="md:hidden lg:inline ml-2">
                      Send Invites
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start overflow-x-clip"
                  >
                    <Download className="h-4 w-4 mr-2 md:mr-0" />
                    <span className="md:hidden lg:inline ml-2">
                      Export Data
                    </span>
                  </Button>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Event Status</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {isUpcoming ? "Scheduled" : "Completed"}
                  </span>
                  <Badge variant={isUpcoming ? "default" : "secondary"}>
                    {isUpcoming ? "Active" : "Past"}
                  </Badge>
                </div>
                <Separator className="my-4" />
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>
                      {new Date(event.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last updated:</span>
                    <span>
                      {new Date(event.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="text-xs font-mono bg-gray-100 p-1">
                      {event?._id?.slice(0, 4)}...
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These actions cannot be undone
                </p>
                <div className="space-y-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Event
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the event "{event.title}" and all associated
                          data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleDelete}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Event Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Make changes to your event information below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <Editor
              value={description}
              name="description"
              onTextChange={(e) => setDescription(e.htmlValue)}
              style={{ height: "320px" }}
            />

            {/* Event Type */}
            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="day0">Day 0</option>
                <option value="10x">10x</option>
                <option value="100x">100x</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  date={formData.startDate}
                  setDate={(date) =>
                    setFormData({ ...formData, startDate: date })
                  }
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
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <DatePicker
                  date={formData.endDate}
                  setDate={(date) =>
                    setFormData({ ...formData, endDate: date })
                  }
                  label="Select end date"
                  disabled={(date) =>
                    !formData.startDate || date <= new Date(formData.startDate)
                  }
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">
                Starting Price <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`pl-7 ${errors.price ? "border-red-500" : ""}`}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="font-medium">Location</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="location.city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="location.state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="location.country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Organizer Info */}

            {/* Images */}
            <div>
              <Label className="mb-2 block">Uploaded Images</Label>
              {formData.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl} // handles both string and object with `preview`
                        alt={`Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mb-4">
                  No images uploaded yet.
                </p>
              )}
            </div>
            <div>
              <Label>Event Images</Label>
              <div
                className={`border-2 border-dashed rounded-md p-6 mt-2 text-center ${
                  isDragging ? "border-primary bg-primary/5" : "border-gray-300"
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />

                {newPreview.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {newPreview.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={index}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <p className="text-xs mt-1 truncate">{image.name}</p>
                      </div>
                    ))}
                    <div
                      className="flex items-center justify-center h-24 border border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PlusCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer py-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-1">
                      <span className="font-medium">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Inclusions */}
            <div>
              <Label>Inclusions</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={inclusion}
                  onChange={(e) => setInclusion(e.target.value)}
                  placeholder="Add an inclusion item"
                />
                <Button
                  type="button"
                  onClick={handleAddInclusion}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {formData.inclusions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.inclusions.map((item, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="pl-2 pr-1 py-1 flex items-center gap-1"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(index)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Schedule Options */}
            <div className="space-y-4">
              <h3 className="font-medium">Publishing Options</h3>
              <Tabs defaultValue="publish">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="publish">Publish Now</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="draft">Save as Draft</TabsTrigger>
                </TabsList>
                <TabsContent value="publish">
                  <p className="text-sm text-muted-foreground mb-4">
                    Your event will be published immediately and visible to
                    attendees.
                  </p>
                  <Button
                    type="button"
                    onClick={() => handleSubmit("published")}
                    className="w-full"
                  >
                    Publish Event
                  </Button>
                </TabsContent>
                <TabsContent value="schedule">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="scheduleDate">Date</Label>
                        <DatePicker
                          date={scheduleDate}
                          setDate={setScheduleDate}
                          label="Select date"
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="scheduleTime">Time</Label>
                        <TimePicker
                          selectedTime={scheduleTime}
                          setSelectedTime={setScheduleTime}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleSubmit("scheduled")}
                      className="w-full"
                      disabled={!scheduleDate || !scheduleTime}
                    >
                      Schedule Publication
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="draft">
                  <p className="text-sm text-muted-foreground mb-4">
                    Your event will be saved as a draft and won't be visible to
                    attendees until published.
                  </p>
                  <Button
                    type="button"
                    onClick={() => handleSubmit("draft")}
                    variant="outline"
                    className="w-full"
                  >
                    Save as Draft
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => handleSubmit("published")}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
