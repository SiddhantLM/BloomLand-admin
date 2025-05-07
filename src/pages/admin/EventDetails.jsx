import EventTabs from "@/components/admin/events/EventTabs";

const event = {
  id: "1",
  title: "Tech Conference 2025",
  date: "2025-04-15",
  location: "Ahmedabad",
  description: "A gathering of tech enthusiasts and innovators.",
  imageUrl: "https://picsum.photos/200/300",
};

export default function EventPage() {
  return (
    <div className="md:px-10 mx-auto">
      <EventTabs event={event} />
    </div>
  );
}
