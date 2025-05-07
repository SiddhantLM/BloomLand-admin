import AddEvent from "../../components/admin/AddEvent";
import EventsList from "../../components/admin/EventList";

export default function EventsPage() {
  return (
    <div className="p-4 md:p-8">
      <AddEvent />
      <EventsList />
    </div>
  );
}
