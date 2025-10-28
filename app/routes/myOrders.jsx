import { getSession, commitSession } from "../.server/session";
import { redirect, useLoaderData, Form, Link } from "react-router";
import { useState } from "react";
import { getOrdersByUser, updateOrderStatus } from "../models/order";

// 🧠 Loader: fetch user orders
export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  if (!user) return redirect("/login");

  try {
    const ordersDb = await getOrdersByUser(user.id);
    const orders = Array.isArray(ordersDb)
      ? ordersDb.map((order) => ({
          ...order,
          _id: order._id.toString(),
        }))
      : [];

    console.log(orders);

    return { orders };
  } catch (err) {
    console.error("Error fetching orders:", err);
    return { orders: [] };
  }
}

// ⚙️ Action: cancel order
export async function action({ request }) {
  const formData = await request.formData();
  const orderId = formData.get("orderId");
  const actionType = formData.get("_action");

  const session = await getSession(request.headers.get("Cookie"));

  if (actionType === "cancel" && orderId) {
    try {
      await updateOrderStatus(orderId, "canceled");
      session.set("successMessage", `Order #${orderId.slice(-6)} canceled.`);
    } catch (err) {
      console.error("Error cancelling order:", err);
      session.set("errorMessage", "Failed to cancel order. Please try again.");
    }
  }

  return redirect("/my-orders", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

// 🧾 Component
export default function MyOrdersPage() {
  const data = useLoaderData();
  const orders = data?.orders || [];
  const [openOrderId, setOpenOrderId] = useState(null);

  if (orders.length === 0) {
    return (
      <section className="min-h-screen bg-white text-gray-700 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-6">My Orders</h1>
          <p className="text-gray-500 mb-4">
            You haven’t placed any orders yet.
          </p>
          <Link
            to="/products"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  const statusColors = {
    pending: "bg-yellow-400 text-black",
    completed: "bg-green-500 text-white",
    shipped: "bg-blue-500 text-white",
    canceled: "bg-red-500 text-white",
  };

  return (
    <section className="min-h-screen bg-white text-gray-800 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-600 mb-12 text-center">
          My Orders
        </h1>

        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const isOpen = openOrderId === order._id;
            return (
              <div
                key={order._id}
                className="bg-green-50 border border-green-200 rounded-2xl shadow-md overflow-hidden"
              >
                {/* Order Header */}
                <button
                  className="flex justify-between items-center w-full px-6 py-4 hover:bg-green-100 transition"
                  onClick={() => setOpenOrderId(isOpen ? null : order._id)}
                >
                  <div>
                    <h2 className="text-xl font-semibold text-green-700">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Placed: {new Date(order.createdAt).toLocaleDateString()}{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      statusColors[order.status] || "bg-gray-500 text-white"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="px-6 py-4 border-t border-green-200">
                    <ul className="divide-y divide-green-100 mb-4">
                      {(order.items || []).map((product) => (
                        <li
                          key={product.product}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="flex items-center gap-4">
                            {product.imageUrl && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-xl border border-green-100"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800">
                                {product.name}
                              </p>
                              <p className="text-gray-500 text-sm">
                                Ksh {product.price.toFixed(2)} each
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
                              x{product.quantity}
                            </span>
                            <span className="font-semibold text-green-700">
                              Ksh{" "}
                              {(product.price * product.quantity).toFixed(2)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Total */}
                    <div className="flex justify-between text-xl font-bold text-green-700 mb-2">
                      <span>Total</span>
                      <span>ksh {order.totalPrice.toFixed(2)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-4">
                      <Link
                        to={`/track-order/${order._id}`}
                        className="text-sm text-green-600 hover:text-green-500 font-medium underline"
                      >
                        Track Order
                      </Link>

                      {/* Cancel Order Button */}
                      {order.status === "pending" && (
                        <Form method="post">
                          <input
                            type="hidden"
                            name="orderId"
                            value={order._id}
                          />
                          <button
                            type="submit"
                            name="_action"
                            value="cancel"
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            onClick={(e) => {
                              if (
                                !confirm(
                                  `Are you sure you want to cancel order #${order._id
                                    .slice(-6)
                                    .toUpperCase()}?`
                                )
                              )
                                e.preventDefault();
                            }}
                          >
                            Cancel Order
                          </button>
                        </Form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
