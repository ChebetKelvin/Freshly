import { getSession, commitSession } from "../.server/session";
import { redirect, useLoaderData, Form, useNavigate } from "react-router";
import { getOrders, updateOrderStatus, deleteOrder } from "../models/order";
import { getUserById } from "../models/user";
import { EmptyIcon } from "../components/Icon";

// --- ACTION ---
export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();

  let orderId = formData.get("orderId");
  let status = formData.get("status");
  let action = formData.get("_action");

  if (!orderId) {
    session.set("errorMessage", "Invalid order ID.");
    return redirect("/admin/orders", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  try {
    if (action === "delete") {
      // --- DELETE ORDER ---
      await deleteOrder(orderId);
      session.set(
        "successMessage",
        `Order ${orderId.slice(-6).toUpperCase()} deleted successfully.`
      );
    } else if (status) {
      // --- UPDATE STATUS ---
      await updateOrderStatus(orderId, status);
      session.set(
        "successMessage",
        `Order ${orderId.slice(-6).toUpperCase()} updated to ${status}.`
      );
    } else {
      session.set("errorMessage", "Missing status or action type.");
    }
  } catch (error) {
    console.error("Order action failed:", error);
    session.set("errorMessage", "Something went wrong. Please try again.");
  }

  return redirect("/admin/orders", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

// --- LOADER ---
export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let orders = await getOrders();

  // Format orders for display
  let formattedOrders = await Promise.all(
    orders.map(async (o) => {
      let orderUser = await getUserById(o.user);
      return {
        ...o,
        _id: o._id.toString(),
        totalPrice: Number(o.totalPrice),
        userName: orderUser?.name || "Unknown",
        userEmail: orderUser?.email || "Unknown",
        items: o.items.map((i) => ({
          ...i,
          price: Number(i.price),
        })),
      };
    })
  );

  let successMessage = session.get("successMessage");
  let errorMessage = session.get("errorMessage");
  if (successMessage) session.unset("successMessage");
  if (errorMessage) session.unset("errorMessage");

  return {
    orders: formattedOrders,
    successMessage,
    errorMessage,
    cookie: await commitSession(session),
  };
}

// --- STATUS COLORS ---
let statusColors = {
  pending: "bg-yellow-200 text-yellow-800",
  shipped: "bg-blue-200 text-blue-800",
  completed: "bg-green-200 text-green-800",
  canceled: "bg-red-200 text-red-800",
};

// --- COMPONENT ---
export default function AdminOrdersPage() {
  let { orders = [], successMessage } = useLoaderData();
  let navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gray-50 text-gray-800 py-12 sm:py-24 px-4 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-green-700 font-medium px-4 py-2 rounded-xl transition hover:bg-green-50 active:bg-green-100 border border-green-300 shadow-sm"
        >
          {/* SVG for Left Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-12 mt-8 text-center">
          All Customer Orders
        </h1>

        {successMessage && (
          <div className="bg-green-600 text-white p-4 rounded-xl mb-6 text-center font-semibold shadow-lg">
            {successMessage}
          </div>
        )}

        {/* No orders */}
        {(!orders || orders.length === 0) && (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-inner border border-gray-100 p-8">
            <EmptyIcon className="w-40 h-40 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">
              No orders found.
            </p>
          </div>
        )}

        {/* --- DESKTOP TABLE (md breakpoint and up) --- */}
        {orders && orders.length > 0 && (
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-lg border border-green-100">
            <table className="w-full">
              <thead className="bg-green-100 text-green-800 rounded-t-xl">
                <tr>
                  <th className="p-3 text-left rounded-tl-xl">Order ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Items</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-green-100 hover:bg-green-50 transition"
                  >
                    <td className="p-3 font-medium text-gray-700">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="p-3">{order.userName}</td>
                    <td className="p-3 text-sm">{order.userEmail}</td>
                    <td className="p-3 text-sm">
                      {order.items.map((i, index) => (
                        <div key={index} className="text-gray-600">
                          {i.name} × {i.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-3 font-bold text-green-600">
                      Ksh {order.totalPrice.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      {/* Ship */}
                      <Form method="post">
                        <input type="hidden" name="orderId" value={order._id} />
                        <input type="hidden" name="status" value="shipped" />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition shadow-sm"
                        >
                          Ship
                        </button>
                      </Form>
                      {/* Complete */}
                      <Form method="post">
                        <input type="hidden" name="orderId" value={order._id} />
                        <input type="hidden" name="status" value="completed" />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm transition shadow-sm"
                        >
                          Complete
                        </button>
                      </Form>
                      {/* Cancel */}
                      <Form method="post">
                        <input type="hidden" name="orderId" value={order._id} />
                        <input type="hidden" name="status" value="canceled" />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white text-sm transition shadow-sm"
                        >
                          Cancel
                        </button>
                      </Form>
                      {/* Delete */}
                      <Form method="post">
                        <input type="hidden" name="orderId" value={order._id} />
                        <button
                          type="submit"
                          name="_action"
                          value="delete"
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition shadow-sm"
                        >
                          Delete
                        </button>
                      </Form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- MOBILE CARDS (Hidden above md breakpoint) --- */}
        {orders && orders.length > 0 && (
          <div className="md:hidden flex flex-col gap-6 mt-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-green-200 p-6 rounded-2xl shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-green-700">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                      statusColors[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                <p className="text-gray-700 mb-2 font-medium">
                  Customer: {order.userName}
                </p>
                <p className="text-gray-500 mb-4 text-sm">
                  Email: {order.userEmail}
                </p>

                <h3 className="font-semibold text-gray-800 border-t border-b border-green-100 py-2 mb-2">
                  Items Ordered
                </h3>
                <ul className="divide-y divide-green-100 mb-4 text-gray-700">
                  {order.items.map((i, index) => (
                    <li
                      key={index}
                      className="flex justify-between py-2 text-sm"
                    >
                      <span>
                        {i.name} × {i.quantity}
                      </span>
                      <span>Ksh {(i.price * i.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between items-center font-bold text-xl text-green-700 pt-3 border-t-2 border-green-300 mb-5">
                  <span>Total</span>
                  <span>Ksh {order.totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex flex-wrap gap-2 justify-between">
                  {/* Action buttons */}
                  {["shipped", "completed", "canceled"].map((status) => (
                    <Form
                      key={status}
                      method="post"
                      className="flex-1 min-w-[30%]"
                    >
                      <input type="hidden" name="orderId" value={order._id} />
                      <input type="hidden" name="status" value={status} />
                      <button
                        type="submit"
                        className={`w-full px-3 py-2 rounded-lg text-white text-sm transition font-medium shadow-md
                          ${
                            status === "shipped"
                              ? "bg-blue-500 hover:bg-blue-600"
                              : status === "completed"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-yellow-500 hover:bg-yellow-600"
                          }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    </Form>
                  ))}
                  {/* Delete */}
                  <Form method="post" className="flex-1 min-w-[30%]">
                    <input type="hidden" name="orderId" value={order._id} />
                    <button
                      type="submit"
                      name="_action"
                      value="delete"
                      className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition font-medium shadow-md"
                    >
                      Delete
                    </button>
                  </Form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
