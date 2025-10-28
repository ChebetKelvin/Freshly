import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  useNavigate,
} from "react-router";
import {
  getSession,
  commitSession,
  setErrorMessage,
  setSuccessMessage,
} from "../.server/session";
import {
  validateText,
  validatePrice,
  validateStock,
} from "../.server/validation";
import { createProduct } from "../models/products";

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();

  // Collect data
  let name = formData.get("name");
  let category = formData.get("category");
  let price = formData.get("price");
  let stock = formData.get("stock");
  let description = formData.get("description");
  let imageUrl = formData.get("imageUrl");

  // ✅ Validate
  let fieldErrors = {
    name: validateText(name),
    category: validateText(category),
    price: validatePrice(price),
    stock: validateStock(stock),
    description: validateText(description),
    imageUrl: validateText(imageUrl),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors };
  }

  // ✅ Prepare new product data
  let newProduct = {
    name,
    category,
    price: Number(price),
    stock: Number(stock),
    description,
    image: imageUrl,
    createdAt: new Date(),
  };

  // ✅ Try saving to DB
  try {
    let result = await createProduct(newProduct);

    if (result?.acknowledged || result?.insertedId) {
      setSuccessMessage(session, "Product added successfully!");
    } else {
      setErrorMessage(session, "Failed to add product!");
    }
  } catch (err) {
    console.error("addProduct error:", err);
    setErrorMessage(session, "Error adding product!");
  }

  // ✅ Redirect back to admin/products
  return redirect("/admin/products", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function AddProduct() {
  let actionData = useActionData();
  let navigation = useNavigation();
  let navigate = useNavigate();
  let isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <main className="max-w-2xl mx-auto mt-28 mb-20 bg-white shadow-xl rounded-2xl border border-green-200 p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          // Updated style for better visual hierarchy and clear focus
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
          Back to Products
        </button>

        <h1 className="text-3xl font-bold text-green-700 mt-6 mb-8 text-center">
          Add New Product
        </h1>

        {/* Form Container */}
        <Form method="post" className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-800 font-semibold mb-1"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full bg-green-50 text-gray-800 border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
              placeholder="Enter product name"
            />
            {actionData?.fieldErrors?.name && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.fieldErrors.name}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-gray-800 font-semibold mb-1"
            >
              Category
            </label>
            <input
              type="text"
              name="category"
              id="category"
              required
              className="w-full bg-green-50 text-gray-800  border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
              placeholder="Enter category"
            />
            {actionData?.fieldErrors?.category && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.fieldErrors.category}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-gray-800 font-semibold mb-1"
            >
              Price (Ksh)
            </label>
            <input
              type="number"
              name="price"
              id="price"
              required
              min="0"
              step="0.01"
              className="w-full bg-green-50 text-gray-800  border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
              placeholder="Enter price"
            />
            {actionData?.fieldErrors?.price && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.fieldErrors.price}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="stock"
              className="block text-gray-800 font-semibold mb-1"
            >
              Stock
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              required
              min="0"
              className="w-full bg-green-50 text-gray-800  border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
              placeholder="Enter available stock"
            />
            {actionData?.fieldErrors?.stock && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.fieldErrors.stock}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-800 font-semibold mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="3"
              required
              className="w-full bg-green-50 text-gray-800  border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
              placeholder="Write a short description"
            />
            {actionData?.fieldErrors?.description && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.fieldErrors.description}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-gray-800 font-semibold mb-1"
            >
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              required
              className="w-full bg-green-50 text-gray-800  border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
              placeholder="Paste image link (e.g., https://placehold.co/600x400/00FF00/fff?text=New+Product)"
            />
            {actionData?.fieldErrors?.imageUrl && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.fieldErrors.imageUrl}
              </p>
            )}
          </div>

          {/* General Form Error Display (appears if field errors are present) */}
          {actionData?.formError && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl font-medium">
              <span className="font-bold">Error:</span> {actionData.formError}
            </div>
          )}

          {/* Submit Button - Dynamic state handling */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-3 rounded-xl transition transform shadow-lg
                        ${
                          isSubmitting
                            ? "bg-green-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 hover:-translate-y-0.5 shadow-green-400/50"
                        }`}
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </button>
        </Form>
      </main>
    </div>
  );
}
