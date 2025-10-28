import { Form, useLoaderData, useActionData, redirect } from "react-router";
import { useState } from "react";
import { getSession, commitSession, setErrorMessage } from "../.server/session";
import { getProducts } from "../models/products";
import { createOrder } from "../models/order";
import { getOrdersByUser } from "../models/order";

// ---------- ACTION ----------
export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const user = session.get("user");

  if (!user) return redirect("/login");

  const name = formData.get("name")?.trim();
  const email = formData.get("email")?.trim();
  const address = formData.get("address")?.trim();
  const city = formData.get("city")?.trim();
  const postalCode = formData.get("postalCode")?.trim();
  const country = formData.get("country")?.trim();
  const paymentMethod = formData.get("paymentMethod");
  const phoneNumber = formData.get("phoneNumber")?.trim();

  const errors = {};
  if (!name) errors.name = "Name is required.";
  if (!email) errors.email = "Email is required.";
  if (!address) errors.address = "Address is required.";
  if (!city) errors.city = "City is required.";
  if (!postalCode) errors.postalCode = "Postal code is required.";
  if (!country) errors.country = "Country is required.";
  if (!paymentMethod) errors.paymentMethod = "Select a payment method.";

  const cartProducts = session.get("cartProducts") || [];
  const total = session.get("total") || 0;

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  if (cartProducts.length === 0) {
    setErrorMessage(session, "Your cart is empty.");
    return redirect("/cart", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  // Create order (no payment integration yet)
  const orderData = {
    user: user.id,
    items: cartProducts.map((p) => ({
      product: p._id,
      name: p.name,
      quantity: p.quantity,
      price: p.price,
      subtotal: p.price * p.quantity,
      imageUrl: p.imageUrl || null,
    })),
    totalPrice: total,
    status: "pending",
    paymentMethod,
    shippingAddress: {
      name,
      email,
      address,
      city,
      postalCode,
      country,
      phoneNumber,
    },
    createdAt: new Date(),
  };

  const result = await createOrder(orderData);

  if (!result.acknowledged) {
    setErrorMessage(session, "Failed to create order.");
    return redirect("/checkout", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  session.set("cartItems", []);
  session.unset("total");

  return redirect("/my-orders", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

// ---------- LOADER ----------
export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  if (!user) return redirect("/login");

  const cartItems = session.get("cartItems") || [];
  const products = await getProducts();

  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p._id.toString() === item.id);
      if (!product) return null;
      return {
        ...product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    })
    .filter(Boolean);

  const total = cartProducts.reduce((sum, i) => sum + i.subtotal, 0);

  const orders = await getOrdersByUser(user.id);
  const lastAddress =
    orders.length > 0
      ? orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
          .shippingAddress
      : null;

  console.log({ cartProducts });

  return { user, cartProducts, total, lastAddress };
}

// ---------- COMPONENT ----------
export default function CheckoutPage() {
  const { user, cartProducts, total, lastAddress } = useLoaderData();
  const actionData = useActionData();
  const [method, setMethod] = useState("mobile");

  return (
    <section className="min-h-screen bg-gray-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 text-center mb-12 tracking-tight">
          Secure Checkout 🔒
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Billing Form (Two-thirds width on large screens) */}
          <Form
            method="post"
            className="lg:col-span-2 bg-white shadow-2xl rounded-xl p-6 sm:p-10 border border-gray-100"
          >
            <h2 className="text-3xl font-bold text-green-700 mb-8 border-b pb-3">
              Shipping & Payment Details
            </h2>

            {/* Shipping Information */}
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  id="name"
                  defaultValue={user.name}
                  // CLEAN DESIGN: Standard padded input with rounded corners and focus ring
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                />
                {actionData?.errors?.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  id="email"
                  defaultValue={user.email}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                />
                {actionData?.errors?.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="w-full mt-6">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street Address
              </label>
              <input
                name="address"
                type="text"
                id="address"
                defaultValue={lastAddress?.address || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
              />
              {actionData?.errors?.address && (
                <p className="text-red-500 text-sm mt-1">
                  {actionData.errors.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* City */}
              <div className="w-full">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <input
                  name="city"
                  type="text"
                  id="city"
                  defaultValue={lastAddress?.city || ""}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                />
                {actionData?.errors?.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errors.city}
                  </p>
                )}
              </div>
              {/* Postal Code */}
              <div className="w-full">
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Postal Code
                </label>
                <input
                  name="postalCode"
                  type="text"
                  id="postalCode"
                  defaultValue={lastAddress?.postalCode || ""}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                />
                {actionData?.errors?.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errors.postalCode}
                  </p>
                )}
              </div>
              {/* Country */}
              <div className="w-full">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <input
                  name="country"
                  type="text"
                  id="country"
                  defaultValue={lastAddress?.country || ""}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                />
                {actionData?.errors?.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {actionData.errors.country}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4 border-t pt-6">
              Payment Method
            </h3>
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg shadow-sm hover:bg-green-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobile"
                  checked={method === "mobile"}
                  onChange={() => setMethod("mobile")}
                  className="form-radio h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="text-gray-800 font-medium">
                  M-Pesa (Mobile Payment)
                </span>
              </label>
              {/* You can add more payment methods here */}
            </div>

            {method === "mobile" && (
              <div className="w-full mt-6">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number (e.g. 2547XXXXXXXX)
                </label>
                <input
                  name="phoneNumber"
                  type="tel"
                  id="phoneNumber"
                  defaultValue={lastAddress?.phoneNumber || ""}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
                />
              </div>
            )}

            <button
              type="submit"
              className="mt-10 w-full bg-green-600 text-white text-lg py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg hover:bg-green-700 transition-all focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            >
              Place Order Now
            </button>
          </Form>

          {/* Order Summary (One-third width on large screens) */}
          <div className="lg:col-span-1 bg-white shadow-2xl rounded-xl p-6 sm:p-8 border border-gray-100 h-fit sticky top-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
              Your Order 🛒
            </h2>

            <ul className="divide-y divide-gray-100 mb-6 max-h-[300px] lg:max-h-[500px] overflow-y-auto pr-2">
              {cartProducts.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-start py-4 group hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 text-base">
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-sm mt-0.5">
                        ksh{item.price} each
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-700 font-medium">
                      x{item.quantity}
                    </p>
                    <p className="text-green-700 font-bold text-lg mt-0.5">
                      ksh{item.subtotal}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <hr className="border-t border-gray-200 my-4" />

            <div className="flex justify-between text-2xl font-extrabold text-gray-800 pt-2">
              <span>Total</span>
              <span className="text-green-600">ksh {total}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
