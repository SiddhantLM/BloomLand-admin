import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import EventsPage from "./EventPage";
import DashboardPage from "@/components/admin/dashboard/Page";
import EventDetails from "./EventDetails";
import UsersPage from "./UserPage";
import UserDetails from "./UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getEvents } from "@/store/slices/adminSlice";
import ErrorPage from "@/components/ErrorPage";
import BlogsAdmin from "./BlogPage";
import BlogDetails from "./BlogDetails";
import AdminTicketsPage from "./TicketPage";
import TicketPage from "./TicketDetails";
import Newsletter from "./Newsletter";
import Invoices from "./Invoices";
const AdminPage = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    // dispatch(getUsers());
    dispatch(getEvents());
  }, [token, navigate, dispatch]);

  return (
    <div className="flex md:h-screen">
      <div className="flex-1  flex flex-col overflow-y-auto">
        <Sidebar>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/blogs" element={<BlogsAdmin />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/tickets" element={<AdminTicketsPage />} />
            <Route path="/tickets/:id" element={<TicketPage />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Sidebar>
      </div>
    </div>
  );
};

export default AdminPage;
