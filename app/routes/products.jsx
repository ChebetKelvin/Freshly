import { useLoaderData, Link, Form, useNavigation } from "react-router";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { getProducts } from "../models/products";
import { getSession, commitSession } from "../.server/session";

// 🧱 Action - Add to Cart
export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let id = formData.get("id");

  let cartItem = { id, quantity: 1 };
  let cartItems = session.get("cartItems") || [];

  let existingItem = cartItems.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push(cartItem);
  }

  session.set("cartItems", cartItems);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

// 🧩 Loader – fetch products and filter by query param
export async function loader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.toLowerCase() || "";
  const results = await getProducts();

  let products = results.map((item) => ({
    ...item,
    id: item._id.toString(),
  }));

  if (search) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
    );
  }

  return { products, search };
}

// 🧱 Product Card
function ProductCard({ id, name, category, price, image }) {
  const navigation = useNavigation();
  const isAdding =
    navigation.state === "submitting" &&
    navigation.formData?.get("id") === String(id);

  return (
    <article className="flex flex-col bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="h-64 w-full object-cover rounded-t-2xl"
        />
        <Form method="post">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            disabled={isAdding}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-2 rounded-full absolute -bottom-5 left-1/2 -translate-x-1/2 active:scale-[.97] transition ease-in-out disabled:opacity-60"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </Form>
      </div>

      <div className="px-5 pb-6 flex flex-col items-center text-center">
        <Link to={`/products/${id}`}>
          <h2 className="font-semibold mt-8 text-lg text-gray-800 hover:underline">
            {name}
          </h2>
        </Link>
        <p className="text-sm text-gray-500">{category}</p>
        <p className="text-green-600 font-semibold mt-1">Ksh {price}</p>
      </div>
    </article>
  );
}

// 🛒 Products Page
export default function Products() {
  const { products, search } = useLoaderData();
  const [query, setQuery] = useState(search);

  // Local search filter (optional refinement)
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-gray-50 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto pt-20 pb-5">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700">
            Our Fresh Products
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Browse and shop fresh groceries, beverages, and daily essentials
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-white shadow-sm rounded-full px-4 py-2 w-full sm:w-96 focus-within:ring-2 focus-within:ring-green-500 transition">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none px-3 w-full text-gray-700 placeholder-gray-400 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-base sm:text-lg mt-10">
            No products found matching “{query || search}”.
          </p>
        )}
      </div>
    </section>
  );
}
