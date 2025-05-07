import { Calendar, MapPin } from "lucide-react";
// import Image from "next/image";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const EventCard = ({ event, className }) => {
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState(null);
  useEffect(() => {
    console.log(event);
    setHtmlContent(event.description);
  }, [event]);
  return (
    <div
      onClick={() => navigate(`/admin/events/${event._id}`)}
      className={clsx(
        "flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-xl",
        className
      )}
    >
      <div className="relative w-full md:w-1/3 h-48 md:h-40">
        <img
          src={event.images[0]}
          alt={event.title}
          className="object-cover w-full h-full" // added w-full and h-full to mimic 'fill' behavior
        />
      </div>
      <div className="p-6 flex flex-col justify-between w-full md:w-2/3">
        <div>
          <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
          <p
            className="text-gray-600 mb-4"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          ></p>
        </div>
        <div className="flex gap-4 text-sm text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <Calendar size={16} />{" "}
            {new Date(event.start_date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} />{" "}
            {event?.location?.city +
              ", " +
              event?.location?.state +
              ", " +
              event?.location?.country}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
