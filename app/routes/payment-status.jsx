import { useLoaderData } from "react-router";
import { data } from "react-router";
import { getPaymentByCheckoutId } from "../models/payment.js";
import { getSession } from "../.server/session.js";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let checkoutId = session.get("checkoutId");

  if (!checkoutId) {
    return data({ error: "Missing checkoutId" }, { status: 400 });
  }

  let payment = await getPaymentByCheckoutId(checkoutId);
  return data(payment || { status: "pending" });
}

// ✅ Add this part
export default function PaymentStatusPage() {
  const payment = useLoaderData();

  return (
    <div className="p-6 text-gray-800">
      {payment.error ? (
        <p className="text-red-500">{payment.error}</p>
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-2">Payment Status</h1>
          <p>Status: {payment.status || "unknown"}</p>
          {payment.resultDesc && <p>Message: {payment.resultDesc}</p>}
        </>
      )}
    </div>
  );
}
