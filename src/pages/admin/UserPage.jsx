import UserDataTable from "@/components/admin/events/UserTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApproved, getAttendees, getRequests } from "@/services/admin";
import { TabsContent } from "@radix-ui/react-tabs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function UsersPage() {
  const dispatch = useDispatch();

  const { requests, approved, attendees } = useSelector((state) => state.admin);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getRequests({ token }));
    dispatch(getApproved({ token }));
    dispatch(getAttendees({ token }));
  }, [dispatch, token]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <Tabs defaultValue="requests">
        <TabsList className="mb-4">
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <div className="flex flex-col gap-4 w-full bg-white shadow-sm rounded-lg p-4 border-2">
            {requests && requests.length > 0 ? (
              <UserDataTable usersData={requests} title="Requests" />
            ) : (
              "No Requests to show"
            )}
          </div>
        </TabsContent>
        <TabsContent value="approved">
          <div className="flex flex-col gap-4 w-full bg-white shadow-sm rounded-lg p-4 border-2">
            {approved && approved.length > 0 ? (
              <UserDataTable usersData={approved} title="Approved" />
            ) : (
              "No approved users to show"
            )}
          </div>
        </TabsContent>
        <TabsContent value="attendees">
          <div className="flex flex-col gap-4 w-full bg-white shadow-sm rounded-lg p-4 border-2">
            {attendees && attendees.length > 0 ? (
              <UserDataTable usersData={attendees} title="Attendees" />
            ) : (
              "No attendees to show"
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
