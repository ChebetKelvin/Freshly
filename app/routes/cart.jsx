import { X } from "lucide-react";
import { Form, Link, data } from "react-router";
import { commitSession, getSession } from "../.server/session";
import { EmptyIcon } from "../components/Icon";
import { getProducts } from "../models/products";
import { FaMinus, FaPlus } from "react-icons/fa";

// Loader
export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const cartItems = session.get("cartItems") || [];
  const results = await getProducts(); // Fetch grocery products

  const products = results.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  const cartProducts = cartItems
    .map((item) => {
      const matched = products.find((p) => p._id === item.id);
      if (!matched) return null;

      const numericPrice = Number(matched.price); // ensure numeric
      return {
        ...matched,
        quantity: item.quantity,
        subtotal: item.quantity * numericPrice,
      };
    })
    .filter(Boolean);

  // Calculate total
  let total = cartProducts.reduce((sum, item) => sum + item.subtotal, 0);

  // Save to session
  session.set("cartProducts", cartProducts);
  session.set("total", total);

  // Return data with updated session cookie
  return data(
    { cartProducts, total },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

// Actions
export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const id = formData.get("id");
  const actionType = formData.get("_action");
  let cartItems = session.get("cartItems") || [];

  if (actionType === "alter_quantity") {
    const quantity = Number(formData.get("quantity"));
    if (quantity <= 0) {
      cartItems = cartItems.filter((item) => item.id !== id);
    } else {
      const idx = cartItems.findIndex((item) => item.id === id);
      if (idx !== -1) cartItems[idx].quantity = quantity;
      else cartItems.push({ id, quantity });
    }
  }

  if (actionType === "remove_item") {
    cartItems = cartItems.filter((item) => item.id !== id);
  }

  session.set("cartItems", cartItems);

  return data(
    { ok: true },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

// Cart Page
export default function Cart({ loaderData }) {
  const { cartProducts, total } = loaderData;

  return (
    <main className="px-4 py-8 rounded-2xl mb-12 bg-white shadow-xl sm:px-6 lg:px-8 max-w-7xl mx-auto mt-20">
      {/* Page Header - Enhanced styling */}
      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 mb-10 border-b pb-4 border-gray-200">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Shopping Cart
        </h1>
        <span className="text-xl text-gray-500 font-medium">
          {cartProducts.length} {cartProducts.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Empty Cart - Remains similar, but with updated styling for consistency */}
      {cartProducts.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-6 p-10 bg-gray-50 rounded-xl">
          <EmptyIcon className="w-36 h-36 text-[#e32225]/50" />
          <p className="text-gray-600 text-center text-lg max-w-md">
            Your cart is empty. Start exploring our fresh products and add them
            to your cart!
          </p>
          <Link
            to="/"
            className="mt-6 bg-[#e32225] hover:bg-[#c01f20] text-white font-bold px-8 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105 uppercase tracking-wider"
          >
            Browse Products
          </Link>
        </div>
      )}

      {/* Cart Items and Summary - Two-Column Layout for modern design */}
      {cartProducts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Cart Items (Takes 2/3 of the space on large screens) */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">
              Review Your Order
            </h2>
            <ul className="flex flex-col gap-6 divide-y divide-gray-100">
              {/* The CartItem component (list item) should be robust and styled for this new section */}
              {cartProducts.map((item) => (
                <li key={item._id} className="pt-6 first:pt-0">
                  <CartItem {...item} />
                </li>
              ))}
            </ul>

            {/* Continue Shopping Button - Added for better user flow */}
            <div className="mt-8 flex justify-start">
              <Link
                to="/products"
                className="text-[#e32225] hover:text-[#c01f20] font-medium transition duration-300 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </section>

          {/* Right Column: Order Summary (Takes 1/3 of the space on large screens) */}
          <aside className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-28">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
              Order Summary
            </h2>

            {/* Subtotal/Total Details */}
            <div className="space-y-4">
              <div className="flex justify-between text-lg text-gray-600">
                <span>Subtotal ({cartProducts.length} items)</span>
                <span>Ksh {total.toFixed(2)}</span>{" "}
                {/* Assuming 'total' here acts as a subtotal */}
              </div>
              <div className="flex justify-between text-lg text-gray-600">
                <span>Shipping Estimate</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-lg text-gray-600">
                <span>Tax Estimate</span>
                <span>Ksh 0.00</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-3xl font-extrabold text-gray-900">Total</p>
              <p className="text-3xl font-extrabold text-[#e32225]">
                Ksh {total.toFixed(2)}
              </p>
            </div>

            {/* Checkout Button */}
            <Link to="/checkout" className="block mt-8">
              <button className="w-full bg-[#e32225] hover:bg-[#c01f20] text-white font-bold px-6 py-4 rounded-xl shadow-xl transition duration-300 transform hover:scale-[1.01] text-lg uppercase tracking-wider">
                Proceed to Checkout
              </button>
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

// Cart Item Component
function CartItem({ name, image, quantity, _id, price, subtotal }) {
  const imageSrc = image; // adjust to match your product field

  return (
    <div className="flex flex-col gap-4 py-6 border-b border-gray-100 last:border-b-0 sm:flex-row sm:gap-6 sm:items-start sm:justify-between">
      {/* Section 1: Product Image and Details (ALWAYS TOP LEFT) */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Product Image - Adjusted size for better mobile fit */}
        <img
          src={imageSrc}
          alt={`Image of ${name}`}
          className="rounded-lg w-24 h-24 object-cover shadow-md sm:w-28 sm:h-28"
        />

        {/* Product Name and Price */}
        <div className="flex flex-col pt-1">
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 sm:text-xl">
            {name}
          </h2>
          <p className="text-gray-500 text-sm mt-0.5 sm:text-base">
            Unit Price:{" "}
            <span className="font-bold text-gray-700">Ksh{price}</span>
          </p>
        </div>
      </div>

      {/* NEW Section 2: Controls and Subtotal (STACKS BELOW DETAILS ON MOBILE) */}
      {/* On mobile, this div is full width and contains controls and total. */}
      {/* On sm+, it's a sibling of Section 1, allowing for horizontal layout. */}
      <div className="flex w-full justify-between items-center pl-28 sm:pl-0 sm:w-auto sm:flex-row sm:items-center sm:gap-12 sm:mt-0">
        {/* Quantity Controls (Left side of new mobile row) */}
        <div className="min-w-[120px]">
          <Form
            method="post"
            className="flex items-center gap-1.5 border border-gray-300 rounded-full p-0.5"
          >
            <input type="hidden" name="id" value={_id} />
            <input type="hidden" name="_action" value="alter_quantity" />

            {/* Decrement Button */}
            <button
              name="quantity"
              value={Math.max(Number(quantity) - 1, 0)}
              className="bg-white text-gray-700 hover:bg-[#e32225] hover:text-white active:scale-95 transition w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm"
            >
              <FaMinus className="w-3 h-3" />
            </button>

            {/* Quantity Display */}
            <span className="text-gray-900 font-bold w-6 text-center">
              {quantity}
            </span>

            {/* Increment Button */}
            <button
              name="quantity"
              value={Number(quantity) + 1}
              className="bg-white text-gray-700 hover:bg-[#41a539] hover:text-white active:scale-95 transition w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </Form>
        </div>

        {/* Subtotal and Remove Button (Right side of new mobile row) */}
        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
          {/* Item Subtotal */}
          <p className="text-xl font-bold text-gray-900 min-w-[100px] text-right">
            Ksh{subtotal.toFixed(2)}
          </p>

          {/* Remove Button */}
          <Form method="post">
            <input type="hidden" name="_action" value="remove_item" />
            <input type="hidden" name="id" value={_id} />
            <button
              title="Remove Item"
              className="text-gray-400 hover:text-[#e32225] p-1.5 rounded-full transition duration-200"
            >
              <X size={20} />
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
