import { useLoaderData, Form, redirect, Link } from "react-router";
import { getUser, deleteUser } from "../models/user";
import { getSession, commitSession } from "../.server/session";
import { FaTrash, FaArrowLeft } from "react-icons/fa";

// 🧩 Loader: fetch all users
export async function loader() {
  const results = await getUser();

  let users = results.map((user) => ({
    ...user,
    _id: user._id.toString(),
  }));

  return { users };
}

// ⚙️ Action: delete user
export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const userId = formData.get("userId");
  const actionType = formData.get("_action");

  try {
    if (actionType === "delete") {
      await deleteUser(userId);
      session.set(
        "successMessage",
        `User ${userId.slice(-6).toUpperCase()} deleted successfully.`
      );
    }

    return redirect("/admin/users", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    session.set("errorMessage", "Failed to delete user.");
    return redirect("/admin/users", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }
}

// 🧱 Component
export default function AdminUsers() {
  const { users } = useLoaderData();

  if (!users || users.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">No users found yet.</div>
    );
  }

  return (
    <div className="w-full mx-auto px-6 sm:px-10 py-16  bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-green-700 tracking-tight">
            👥 Manage Users
          </h1>
          <p className="text-gray-500 mt-1">
            View, manage, and remove user accounts securely.
          </p>
        </div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 bg-linear-to-r from-green-600 to-green-700 text-white font-medium px-5 py-2.5 rounded-xl shadow hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-300"
        >
          <FaArrowLeft className="text-sm" /> Back to Dashboard
        </Link>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-green-600 text-white text-left uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">User ID</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-green-50 transition-all duration-200"
              >
                <td className="p-4 font-semibold text-gray-800">
                  #{user._id.toString().slice(-6).toUpperCase()}
                </td>
                <td className="p-4 capitalize">{user.name || "N/A"}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <Form method="post" className="inline-flex justify-center">
                    <input type="hidden" name="userId" value={user._id} />
                    <button
                      type="submit"
                      name="_action"
                      value="delete"
                      className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
                      onClick={(e) => {
                        if (
                          !confirm(
                            `Are you sure you want to delete ${
                              user.name || "this user"
                            }?`
                          )
                        )
                          e.preventDefault();
                      }}
                    >
                      <FaTrash className="text-xs" /> Delete
                    </button>
                  </Form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
