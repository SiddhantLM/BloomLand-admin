import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Send,
  Paperclip,
  User,
  Calendar,
  Tag,
  MessageSquare,
  Flag,
  MoreHorizontal,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { close, fetchTicketByID, reply } from "@/services/ticket";
import { useSelector } from "react-redux";

// Ticket status component
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
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
    >
      {config.icon}
      {status}
    </span>
  );
};

// Priority indicator component
// const PriorityIndicator = ({ priority }) => {
//   const priorityConfig = {
//     High: {
//       color: "text-red-500",
//       bgColor: "bg-red-50",
//       label: "High Priority",
//     },
//     Medium: {
//       color: "text-yellow-500",
//       bgColor: "bg-yellow-50",
//       label: "Medium Priority",
//     },
//     Low: {
//       color: "text-green-500",
//       bgColor: "bg-green-50",
//       label: "Low Priority",
//     },
//   };

//   const config = priorityConfig[priority] || priorityConfig["Medium"];

//   return (
//     <div
//       className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}
//     >
//       <Flag size={14} className="mr-1" />
//       {config.label}
//     </div>
//   );
// };

// Message component
// const Message = ({ message, isAdmin }) => {
//   return (
//     <div className={`flex ${isAdmin ? "justify-end" : "justify-start"} mb-4`}>
//       <div
//         className={`flex max-w-md ${isAdmin ? "flex-row-reverse" : "flex-row"}`}
//       >
//         <div
//           className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
//             isAdmin ? "bg-indigo-100 ml-3" : "bg-gray-100 mr-3"
//           }`}
//         >
//           <User
//             size={16}
//             className={isAdmin ? "text-indigo-600" : "text-gray-600"}
//           />
//         </div>
//         <div>
//           <div
//             className={`px-4 py-2 rounded-lg ${
//               isAdmin ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
//             }`}
//           >
//             <p className="text-sm">{message.content}</p>
//           </div>
//           <span className="text-xs text-gray-500 block mt-1">
//             {message.timestamp}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

export default function TicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const { token } = useSelector((state) => state.auth);
  // const { id } = useParams();
  useEffect(() => {
    const getTicketDetails = async () => {
      const ticketResponse = await fetchTicketByID({
        token: token,
        ticketId: id,
      });

      setTicket(ticketResponse);
      // setMessages(mockMessages);
      setLoading(false);
    };
    getTicketDetails();
  }, [id, token]);
  console.log(ticket);
  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await reply({ token: token, ticketId: id, reply: newMessage });

    // setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleResolve = async () => {
    await close({ token: token, ticketId: id }, navigate);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/admin/tickets")}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 group"
        >
          <ArrowLeft
            size={16}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          <span>Back to all tickets</span>
        </button>

        {/* Ticket header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                {ticket.title}
              </h1>
              <div className="flex items-center text-sm text-gray-500 gap-4 flex-wrap">
                <span className="flex items-center">
                  <Tag size={14} className="mr-1" />
                  {ticket.category}
                </span>
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Created: {formatDate(ticket.created_at)}
                </span>
                <span className="flex items-center">
                  <MessageSquare size={14} className="mr-1" />
                  {messages.length}{" "}
                  {messages.length === 1 ? "message" : "messages"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* <PriorityIndicator priority={ticket.priority} /> */}
              <div className="relative">
                <button className="flex items-center">
                  <StatusBadge status={ticket.status} />
                </button>
              </div>
            </div>
          </div>

          {/* User information */}
          <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <User size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-medium">{ticket?.user?.name}</p>
              <p className="text-sm text-gray-500">{ticket.email}</p>
            </div>
          </div>

          {/* Ticket details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Details</h3>
            <p className="text-gray-700 mb-6">{ticket.description}</p>

            {/* Attachments */}
            {ticket.images && ticket.images.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Attachments
                </h3>
                <div className="flex flex-wrap gap-4">
                  {ticket.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer"
                      onClick={() => setShowImageModal(true)}
                    >
                      <div className="h-24 w-32 border border-gray-200 rounded-lg overflow-hidden relative">
                        <img
                          src={image}
                          alt={ticket.category}
                          className="h-full w-full object-cover"
                        />
                        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                          <div className="opacity-0 group-hover:opacity-100 text-white">
                            <ImageIcon size={24} />
                          </div>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Conversation
          </h2>

          {/* Message input */}
          <form
            onSubmit={handleSubmitMessage}
            className="border-t border-gray-200 pt-4"
          >
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-20"
                rows={3}
              />
              <div className="absolute right-2 bottom-2 flex gap-2">
                <button
                  type="submit"
                  className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                  title="Send message"
                  disabled={!newMessage.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mb-12">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            onClick={() => navigate("/admin/tickets")}
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
              onClick={handleResolve}
            >
              Resolve Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Image modal */}
      {showImageModal &&
        ticket.attachments &&
        ticket.attachments.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full bg-white rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-medium">
                  {ticket.attachments[0].filename}
                </h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={ticket.attachments[0].url}
                  alt={ticket.attachments[0].filename}
                  className="w-full h-auto"
                />
              </div>
              <div className="p-4 border-t flex justify-end">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
