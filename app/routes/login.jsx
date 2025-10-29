import { Form, Link, redirect, useActionData } from "react-router";
import bcrypt from "bcryptjs";
import {
  getSession,
  commitSession,
  setSuccessMessage,
  setErrorMessage,
} from "../.server/session";
import { getUserByEmail } from "../models/user";
import { validateText } from "../.server/validation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  // ✅ Validate input fields
  const fieldErrors = {
    email: validateText(email),
    password: validateText(password),
  };

  // If any field is invalid, return fieldErrors directly
  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors };
  }

  // ✅ Check if user exists
  const user = await getUserByEmail(email);
  if (!user) {
    setErrorMessage(session, "Invalid credentials. Try again.");
    return redirect("/login", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  // ✅ Compare password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    setErrorMessage(session, "Invalid credentials. Try again.");
    return redirect("/login", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  // ✅ Store ONLY essential user data in session (reduced size)
  session.set("userId", user._id.toString()); // Store only ID as string
  session.set("userRole", user.role);
  // Remove name and email from session to save space
  // You can fetch these from database when needed

  setSuccessMessage(session, `Welcome back, ${user.name}!`);

  // ✅ Redirect based on role
  const redirectTo = user.role === "admin" ? "/admin" : "/";
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

// Rest of your component remains the same...
export default function Login() {
  const actionData = useActionData();
  const fieldErrors = actionData?.fieldErrors || {};
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/organic-food-farm.jpg')",
      }}
    >
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 mx-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        <Form method="post" className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-900 font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-green-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
          >
            Log In
          </button>
        </Form>

        <p className="text-center text-gray-900 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
