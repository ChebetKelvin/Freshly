import Hero from "../components/Hero";
import CategorySection from "../components/Category";
import { Link, Form, useNavigation, data } from "react-router";

import HowItWorks from "../components/HowItWorks";
import USPSection from "../components/USPSection";
import Testimonials from "../components/Testimonials";
import InspirationSection from "../components/Inspiration";
import { commitSession, getSession } from "../.server/session";
import { getProducts } from "../models/products";

export function meta() {
  return [
    { title: "Freshly Groceries" },
    { name: "description", content: "Fresh groceries delivered to your door" },
  ];
}

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

export async function loader({ request }) {
  let results = await getProducts();

  let products = results.map((item) => {
    return {
      ...item,
      id: item._id.toString(), // Convert ObjectId to string
    };
  });

  return { products };
}

export default function Home({ loaderData }) {
  const { products } = loaderData;
  const trending = products.slice(0, 8);

  return (
    <main className=" w-full">
      <div className="bg-gray-100 min-h-screen">
        <Hero />
        <CategorySection />

        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center text-gray-800">
              🛒 Trending Products
            </h2>

            {/* Product Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {trending.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-8 sm:mt-10">
              <Link
                to="/products"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        <HowItWorks />
        <USPSection />
        <Testimonials />
        <InspirationSection />
      </div>
    </main>
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
        <p className="text-green-600 font-semibold mt-1">Ksh {price}</p>
      </div>
    </article>
  );
}
