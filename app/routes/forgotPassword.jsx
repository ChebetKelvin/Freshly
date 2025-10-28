import { Form, useActionData } from "react-router";
import { useState } from "react";

export default function ForgotPassword() {
  const data = useActionData();
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md bg-green-50 border border-green-200 rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-green-700 mb-2 text-center">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your registered email and we’ll send you a password reset link.
        </p>

        <Form method="post" className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
            />
          </div>

          {data?.error && (
            <p className="text-red-600 text-sm text-center">{data.error}</p>
          )}
          {data?.success && (
            <p className="text-green-600 text-sm text-center">{data.success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Send Reset Link
          </button>
        </Form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-green-600 hover:underline text-sm font-medium"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
