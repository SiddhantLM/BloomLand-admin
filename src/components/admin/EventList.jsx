/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useMemo, useEffect } from "react";
import EventCard from "./EventCard";
import { format, isAfter, isBefore } from "date-fns";
import { useSelector } from "react-redux";

const EventsList = () => {
  // const dispatch = useDispatch();
  const { events } = useSelector((state) => state.admin);
  const [locationFilter, setLocationFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [page, setPage] = useState(1);
  const itemsPerPage = 2;
  const today = new Date();

  useEffect(() => {
    console.log(events);
  }, [events]);

  // Filtered by tab
  const filteredByTab = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_date);
      return activeTab === "upcoming"
        ? isAfter(eventDate, today)
        : isBefore(eventDate, today);
    });
  }, [activeTab, events]);

  // Final filtered + searched + paginated list
  const filteredEvents = useMemo(() => {
    return filteredByTab
      .filter((event) => {
        const matchesLocation =
          locationFilter === "All" || event.location.city === locationFilter;
        const matchesDate =
          dateFilter === "All" || event.start_date.startsWith(dateFilter);
        const matchesSearch =
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.description.toLowerCase().includes(search.toLowerCase());

        return matchesLocation && matchesDate && matchesSearch;
      })
      .sort((a, b) =>
        activeTab === "upcoming"
          ? a.start_date.localeCompare(b.start_date)
          : b.start_date.localeCompare(a.start_date)
      );
  }, [filteredByTab, locationFilter, dateFilter, search, activeTab]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const uniqueLocations = [
    "All",
    ...new Set(events.map((e) => e.location?.city)),
  ];
  const uniqueDates = [
    "All",
    ...new Set(events.map((e) => e.start_date.slice(0, 7))),
  ]; // YYYY-MM

  return (
    <section className="p-6 md:p-12 max-w-6xl mx-auto flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {["upcoming", "past"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              activeTab === tab
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab === "upcoming" ? "Upcoming Events" : "Past Events"}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border px-4 py-2 rounded-md w-full md:w-1/2"
        />

        <select
          value={locationFilter}
          onChange={(e) => {
            setLocationFilter(e.target.value);
            setPage(1);
          }}
          className="border px-4 py-2 rounded-md"
        >
          {uniqueLocations.map((loc) => (
            <option key={loc} value={JSON.stringify(loc)}>
              {loc}
            </option>
          ))}
        </select>

        <select
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
          className="border px-4 py-2 rounded-md"
        >
          {uniqueDates.map((d) => (
            <option key={d} value={d}>
              {d === "All"
                ? "All Dates"
                : format(new Date(d + "-01"), "MMMM yyyy")}
            </option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="space-y-6">
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p className="text-gray-500">No events match your filters.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default EventsList;
