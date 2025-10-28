import { useLoaderData, Form, Link, data } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import { getProducts } from "../models/products";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
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

// 🧩 Loader – fetch product by ID
export async function loader({ params }) {
  const products = await getProducts();

  // Find main product
  const productData = products.find((p) => p._id.toString() === params.id);
  if (!productData) throw new Response("Product not found", { status: 404 });

  // Add `id` property to the main product
  const product = { ...productData, id: productData._id.toString() };

  // Related products: same category, exclude current
  const relatedProducts = products
    .filter(
      (p) => p.category === product.category && p._id.toString() !== params.id
    )
    .slice(0, 5)
    .map((p) => ({ ...p, id: p._id.toString() })); // Add id consistently

  return { ...product, relatedProducts };
}

export default function ProductDetails() {
  const product = useLoaderData();
  const [currentImage, setCurrentImage] = useState(product.image); // Main image

  return (
    <section className="min-h-screen bg-linear-to-b from-gray-100 to-gray-50 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Product Images */}
        <div className="flex-1 flex flex-col items-center bg-white rounded-3xl shadow-xl p-6">
          <img
            src={currentImage}
            alt={product.name}
            className="rounded-2xl w-full max-w-md object-cover shadow-md mb-6 hover:scale-105 transition-transform duration-300"
          />

          {/* Carousel / Thumbnails */}
          <Swiper
            spaceBetween={12}
            slidesPerView={4}
            className="w-full max-w-md"
          >
            {[product.image, ...(product.images || [])].map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  alt={`${product.name} ${i}`}
                  className="cursor-pointer rounded-lg object-cover h-24 w-full border-2 border-gray-200 hover:border-green-500 transition"
                  onClick={() => setCurrentImage(img)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between bg-white rounded-3xl shadow-xl p-8">
          {/* Back Link */}
          <Link
            to={"/products"}
            className="text-green-600 hover:text-green-700 flex items-center gap-2 font-medium mb-6"
          >
            <FaArrowLeft /> Back to products
          </Link>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-500 text-sm uppercase tracking-wide">
              {product.category}
            </p>
            <p className="text-green-600 font-bold text-2xl">{product.price}</p>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
            <p className="text-gray-700 font-medium">
              Stock available: {product.stock}
            </p>
          </div>

          {/* Add to Cart */}
          <Form method="post" className="mt-8">
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
            >
              Add to Cart
            </button>
          </Form>
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts.length > 0 && (
        <div className="mt-20 max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {product.relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="flex flex-col gap-3 bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-44 w-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="px-4 pb-4 flex flex-col items-center text-center">
                  <h3 className="font-semibold text-gray-900 hover:text-green-600 transition">
                    {p.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{p.category}</p>
                  <p className="text-green-600 font-semibold mt-1">{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
