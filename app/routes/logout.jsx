// app/routes/logout.jsx
import { redirect } from "react-router";
import {
  getSession,
  destroySession,
  setSuccessMessage,
} from "../.server/session";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));

  setSuccessMessage(session, "Logged out successfully!");

  // Destroy session
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function LogoutPage() {
  return null; // This page won't actually render
}
