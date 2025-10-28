// src/routes/profile.jsx
import { redirect, Form, useLoaderData, useNavigate } from "react-router";
import bcrypt from "bcryptjs";
import {
  getSession,
  commitSession,
  setSuccessMessage,
  setErrorMessage,
} from "../.server/session";
import { getUserById, updateUser } from "../models/user";
import { User, Camera, ArrowLeft } from "lucide-react";

// Loader fetches user and flashes success messages
export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  if (!user) return redirect("/login");

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    setErrorMessage(session, "User not found");
    return redirect("/login", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } else {
    setSuccessMessage(session, "Welcome back, " + dbUser.name + "!");
  }
  if (!dbUser) return redirect("/login");

  return {
    user: {
      id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
    },
    headers: { "Set-Cookie": await commitSession(session) },
  };
}

// Action handles profile updates
export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) return redirect("/login");

  const formData = await request.formData();
  const name = formData.get("name")?.trim();
  const email = formData.get("email")?.trim();
  const password = formData.get("password")?.trim();

  if (!name || !email) {
    return new Response("Name and email are required", { status: 400 });
  }

  const updateFields = { name, email };
  if (password) {
    if (password.length < 6) {
      return new Response("Password must be at least 6 characters", {
        status: 400,
      });
    }
    updateFields.password = await bcrypt.hash(password, 10);
  }

  await updateUser(user.id, updateFields);
  const updatedUser = await getUserById(user.id);

  // Update session
  session.set("user", {
    id: updatedUser._id.toString(),
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });

  setSuccessMessage(session, "Profile updated successfully!");

  return redirect("/profile", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

// ProfilePage component
export default function ProfilePage() {
  const { user } = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 px-4 bg-neutral-950 text-white flex justify-center pb-20">
      <div className="w-full max-w-xl bg-neutral-900 p-8 md:p-10 rounded-3xl shadow-2xl border border-green-700/30 backdrop-blur-sm">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Go back
          className="flex items-center text-green-400 font-semibold mb-6 hover:text-green-300 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Header */}
        <h1 className="text-3xl font-extrabold text-green-400 mb-8 text-center tracking-wide">
          Your Profile Settings ⚙️
        </h1>

        {/* Profile Picture */}
        <div className="relative w-36 h-36 mx-auto mb-10 group cursor-pointer">
          <div className="w-full h-full bg-green-700/80 rounded-full flex justify-center items-center text-white border-4 border-green-500/50 shadow-xl overflow-hidden">
            <User className="w-24 h-24 text-green-100" />
          </div>
          <div className="absolute inset-0 bg-black/50 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera className="w-8 h-8 text-white" />
            <span className="sr-only">Change Profile Picture</span>
          </div>
        </div>

        {/* Form */}
        <Form method="post" className="flex flex-col gap-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              defaultValue={user.name}
              className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 focus:ring-3 focus:ring-green-600 focus:border-green-600 transition duration-150 shadow-inner"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              Email (Read-Only)
            </label>
            <input
              id="email"
              type="email"
              name="email"
              defaultValue={user.email}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-gray-500 cursor-not-allowed shadow-inner"
            />
          </div>

          {/* Password */}
          <div className="pt-2 border-t border-neutral-800">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 focus:ring-3 focus:ring-green-600 focus:border-green-600 transition duration-150 shadow-inner"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-white uppercase tracking-wider transition duration-300 ease-in-out shadow-lg shadow-green-900/50 focus:outline-none focus:ring-4 focus:ring-green-500/50"
          >
            Save Changes
          </button>
        </Form>
      </div>
    </div>
  );
}
