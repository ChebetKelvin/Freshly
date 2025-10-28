import { useState } from "react";
import { Form, Link, redirect } from "react-router";
import bcrypt from "bcryptjs";
import {
  getSession,
  commitSession,
  setSuccessMessage,
  setErrorMessage,
} from "../.server/session";
import { addUser } from "../models/user";
import { validateText, validatePassword } from "../.server/validation";
import { Eye, EyeOff } from "lucide-react"; // 👁️ visibility icons

// 🧠 Action
export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const fieldErrors = {
    name: validateText(name),
    email: validateText(email),
    password: validatePassword(password),
  };

  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match";
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { name, email, password: hashedPassword, role: "user" };
  const users = await addUser(user);

  if (users.acknowledged) {
    setSuccessMessage(session, "Successfully registered");
  } else {
    setErrorMessage(session, "Failed registration");
  }

  return redirect("/login", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

// 💫 Component
export default function Signup({ actionData }) {
  const fieldErrors = actionData?.fieldErrors || {};

  // 👇 Local state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/bg-vegetables.jpg')",
      }}
    >
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 mx-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Account 🛒
        </h2>

        <Form method="post" className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-gray-900 font-semibold mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-900 font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-900 font-semibold mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-gray-900 font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </Form>

        <p className="text-center text-gray-900 text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
