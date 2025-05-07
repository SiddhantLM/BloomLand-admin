import { useNavigate } from "react-router";

export default function UserTable({ users, title }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow p-6 border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50"
                onClick={() => navigate(`/admin/users/${user.id}`)}
              >
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.status || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
