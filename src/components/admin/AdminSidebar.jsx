"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Home,
  Calendar,
  User,
  Dot,
  Ticket,
  Pencil,
  Mails,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router";
import clsx from "clsx";
import { NavUser } from "../NavUser";
import { SidebarProvider } from "../ui/sidebar";

const iconMap = {
  Home: <Home size={18} />,
  Calendar: <Calendar size={18} />,
  User: <User size={18} />,
  Ticket: <Ticket size={18} />,
  Blog: <Pencil size={18} />,
  Mails: <Mails size={18} />,
  Invoice: <IndianRupee size={18} />,
};

export default function AdminSidebar({ items, collapsed }) {
  const [openSections, setOpenSections] = useState({});
  const navigate = useNavigate();
  const toggleSection = (label) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <SidebarProvider>
      <aside
        className={clsx(
          "h-full bg-white shadow-sm transition-all duration-300",
          collapsed ? "md:w-16 w-0" : "w-78"
        )}
      >
        <div className="p-4">
          {!collapsed && (
            <h2 className="text-xl font-semibold mb-4">One Life Experience</h2>
          )}
          <ul className={`space-y-1 ${collapsed && "pt-10"}`}>
            {items.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openSections[item.label];

              return (
                <li key={item.label}>
                  <div
                    className={clsx(
                      "flex items-center w-full py-2 rounded-md hover:bg-gray-100 transition cursor-pointer",
                      collapsed && "justify-center",
                      !collapsed && "gap-3 px-3"
                    )}
                  >
                    <a
                      onClick={() => navigate(item.href)}
                      className={clsx(
                        "flex items-center",
                        collapsed ? "justify-center w-full" : "flex-1 gap-3"
                      )}
                    >
                      {item.icon && iconMap[item.icon]}
                      {!collapsed && <span>{item.label}</span>}
                    </a>

                    {/* Dropdown toggle */}
                    {!collapsed && hasChildren && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(item.label);
                        }}
                        className="ml-auto p-1 rounded-md cursor-pointer transition-colors"
                      >
                        {isOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Submenu */}
                  <div
                    className={clsx(
                      "ml-6 overflow-auto thin-scrollbar transition-all duration-200",
                      !collapsed && hasChildren
                        ? isOpen
                          ? "max-h-40 mt-1"
                          : "max-h-0"
                        : ""
                    )}
                  >
                    {!collapsed && hasChildren && (
                      <ul className="space-y-1">
                        {item.children?.map((child) => (
                          <li
                            key={child.label}
                            className="flex items-center gap-0"
                          >
                            <Dot size={32} />
                            <a
                              onClick={() => navigate(child.href)}
                              className="block text-sm rounded cursor-pointer transition"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          {!collapsed && (
            <div className="absolute bottom-2 inset-x-0 p-3">
              <NavUser />
            </div>
          )}
        </div>
      </aside>
    </SidebarProvider>
  );
}
