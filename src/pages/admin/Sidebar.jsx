"use client";

import AdminSidebar from "../../components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { List, ListCollapse } from "lucide-react";
import clsx from "clsx";
import { getEvents } from "@/store/slices/adminSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false); // 👈

  useEffect(() => {
    setMounted(true); // Wait until client mount
  }, []);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getEvents({ token: token }));
  }, [token, dispatch]);
  const { events } = useSelector((state) => state.admin);

  const items = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: "Home",
    },
    {
      label: "Events",
      href: "/admin/events",
      icon: "Calendar",
      children: events.map((event) => ({
        label: event.title,
        href: `/admin/events/${event._id}`,
        icon: `${event.images[0]}`,
      })),
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: "User",
    },
    {
      label: "Blogs",
      href: "/admin/blogs",
      icon: "Blog",
    },
    {
      label: "Tickets",
      href: "/admin/tickets",
      icon: "Ticket",
    },
    {
      label: "Newsletter",
      href: "/admin/newsletter",
      icon: "Mails",
    },
    {
      label: "Invoices",
      href: "/admin/invoices",
      icon: "Invoice",
    },
  ];

  if (!mounted) return null;

  return (
    <>
      <div className={`flex  h-screen overflow-hidden`}>
        {/* Sidebar */}
        <div
          className={clsx(
            "transition-all duration-300 ease-in-out shadow-2xl",
            sidebarOpen ? "w-78" : "md:w-16 w-0"
          )}
        >
          <div className="relative h-full">
            <AdminSidebar items={items} collapsed={!sidebarOpen} />

            {/* Toggle Button */}
            <div
              className={`
                absolute top-4 z-20
                ${sidebarOpen ? "left-[17.5rem]" : "left-4"}
                md:left-auto md:top-4 md:-right-4
                transition-all duration-300 ease-in-out
              `}
            >
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`
                  bg-white border rounded-md shadow-md p-1 cursor-pointer
                  transition-transform duration-300 ease-in-out
                  ${
                    sidebarOpen
                      ? "translate-x-0"
                      : "translate-x-0 md:translate-x-0"
                  }
                `}
              >
                {sidebarOpen ? <ListCollapse size={25} /> : <List size={25} />}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main
          className={clsx(
            "flex-1 overflow-auto transition-all duration-300",
            sidebarOpen ? "ml-0" : "ml-0"
          )}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </>
  );
}
