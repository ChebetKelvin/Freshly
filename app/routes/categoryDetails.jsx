import { useLoaderData, Link, Form, useNavigation, data } from "react-router";
import { getProducts } from "../models/products";
import { getSession, commitSession } from "../.server/session";

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let id = formData.get("id");

  let cartItem = { id, quantity: 1 };
  let cartItems = session.get("cartItems") || [];
  // Check if item already in cart
  let existingItem = cartItems.find((item) => item.id === id);
  if (existingItem) {
    // Increment quantity
    existingItem.quantity += 1;
  } else {
    // Add new item
    cartItems.push(cartItem);
  }
  session.set("cartItems", cartItems);
  return data(
    { ok: true },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

// ✅ Loader — runs on the server to get filtered products by category
export async function loader({ params }) {
  let results = await getProducts();

  let products = results.map((item) => {
    return {
      ...item,
      id: item._id.toString(), // Convert ObjectId to string
    };
  });

  // Filter products by category from the URL params
  if (!params.category) {
    throw new Response("Category not specified", { status: 400 });
  }

  const { category } = params;
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );

  if (filteredProducts.length === 0) {
    throw new Response("Category not found", { status: 404 });
  }

  return { category, filteredProducts };
}

// ✅ Page Component
export default function CategoryDetails() {
  const { category, filteredProducts } = useLoaderData();
  const navigation = useNavigation();

  return (
    <section className="py-16 bg-gray-50 min-h-screen ">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-green-700 capitalize">
            {category}
          </h1>
          <Link
            to="/"
            className="text-green-600 hover:text-green-800 font-medium underline"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              navigation={navigation}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ id, name, category, price, image }) {
  const navigation = useNavigation();
  const isAdding =
    navigation.state === "submitting" &&
    navigation.formData?.get("id") === String(id);

  return (
    <article className="flex flex-col gap-10 bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="h-64 w-full object-cover rounded-t-2xl"
        />

        {/* Add to Cart Button */}
        <Form method="post">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            disabled={isAdding}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-full absolute -bottom-5 left-1/2 -translate-x-1/2 active:scale-[.97] transition ease-in-out disabled:opacity-60"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </Form>
      </div>

      {/* Product Details */}
      <div className="px-5 pb-6 flex flex-col items-center text-center">
        <Link to={`/products/${id}`}>
          <h2 className="font-semibold text-lg text-gray-800 hover:underline">
            {name}
          </h2>
        </Link>
        <p className="text-sm text-gray-500">{category}</p>
        <p className="text-green-600 font-semibold mt-1">{price}</p>
      </div>
    </article>
  );
}
