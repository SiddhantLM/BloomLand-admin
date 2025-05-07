import UserDetailsCard from "@/components/admin/users/UserDetailsCard";
import { fetchUserById } from "@/services/admin";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";

// You can fetch user details via params or context here.
// const mockUser = {
//   firstName: "Jane",
//   lastName: "Doe",
//   gender: "Female",
//   city: "Mumbai",
//   dob: "1995-06-15",
//   designation: "Marketing Manager",
//   field: "Marketing",
//   category: "B2B",
//   revenue: "5L+",
//   intention: "Networking",
//   reasons: "Build community",
//   growth_areas: "Leadership",
//   insta_id: "@janedoe",
//   linkedin_url: "https://linkedin.com/in/janedoe",
//   website: "https://janedoe.me",
//   country_code: "91",
//   number: "9876543210",
//   emailId: "jane@example.com",
//   referral_code: "REF123",
//   updates: "Email",
//   howHeard: "Instagram",
// };

export default function UserPage() {
  const [user, setUser] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const getDetails = async () => {
      const response = await fetchUserById({ userId: id, token: token });
      setUser(response);
    };
    getDetails();
  }, [id, token]);

  if (!user) {
    return (
      <div className="min-h-screen gap-5 w-full flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">User Not Found</h1>
        <button
          onClick={() => navigate(location.state?.from || "/admin")}
          className="bg-black rounded-lg px-4 py-2 text-white"
        >
          Return
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <p
        onClick={() => navigate(-1)}
        className="md:px-10 px-2 bg-black w-fit text-white py-2 rounded-lg hover:scale-105 duration-200 font-medium"
      >
        {"<"}
      </p>
      <UserDetailsCard user={user} />
    </div>
  );
}
