"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventDetails from "@/components/admin/events/EventDetails";
import UsersTabs from "@/components/admin/events/UserTabs";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getEventById } from "@/services/event";
import { useState } from "react";
import UserTable from "../users/UserTable";
import UserDataTable from "./UserTable";

export default function EventTabs() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  useEffect(() => {
    const fetchEvent = async () => {
      const response = await getEventById(id);
      console.log(response);
      setEvent(response);
    };
    fetchEvent();
  }, [id]);

  return (
    <Tabs defaultValue="details" className="w-full mt-14 md:mt-0">
      <TabsList className="gap-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <EventDetails event={event} setEvent={setEvent} />
      </TabsContent>
      <TabsContent value="users">
        <Tabs defaultValue="requests" className="w-full mt-4">
          <TabsList className="gap-4">
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <UserDataTable usersData={event?.requests} />
          </TabsContent>
          <TabsContent value="approved">
            <UserDataTable usersData={event?.approved} />
          </TabsContent>
          <TabsContent value="attendees">
            <UserDataTable usersData={event?.attendees} />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
