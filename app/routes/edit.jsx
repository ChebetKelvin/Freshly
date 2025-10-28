import {
  Form,
  useLoaderData,
  useNavigation,
  useNavigate,
  redirect,
} from "react-router";
import { getProductById } from "../models/products";
import { updateProduct, deleteProduct } from "../models/products";
import {
  getSession,
  commitSession,
  setErrorMessage,
  setSuccessMessage,
} from "../.server/session";

export async function action({ request, params }) {
  let { id } = params;

  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let action = formData.get("_action");

  switch (action) {
    case "edit": {
      // Collect form data
      let name = formData.get("name");
      let category = formData.get("category");
      let price = formData.get("price");
      let stock = formData.get("stock");
      let description = formData.get("description");
      let imageUrl = formData.get("imageUrl");

      // ✅ Prepare updated data
      let updatedData = {
        name,
        category,
        price: price,
        stock: stock,
        description,
        image: imageUrl,
      };

      console.log("Updated Data:", updatedData);

      // ✅ Update product in DB
      let result;
      try {
        result = await updateProduct(id, updatedData);
      } catch (err) {
        console.error("updateProduct error:", err);
        setErrorMessage(session, "Failed to update product!");
        return redirect("/admin/products", {
          headers: { "Set-Cookie": await commitSession(session) },
        });
      }

      // ✅ Handle session messages
      if (result?.acknowledged) {
        setSuccessMessage(session, "Product updated successfully!");
      } else {
        setErrorMessage(session, "Failed to update product!");
      }
      // ✅ Redirect back to admin product list
      return redirect("/admin/products", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    case "delete": {
      let result;
      try {
        result = await deleteProduct(id);
      } catch (err) {
        console.error("deleteProduct error:", err);
        setErrorMessage(session, "Failed to delete product!");
        return redirect("/admin/products", {
          headers: { "Set-Cookie": await commitSession(session) },
        });
      }

      if (result?.acknowledged) {
        setSuccessMessage(session, "Product deleted successfully!");
      } else {
        setErrorMessage(session, "Failed to delete product!");
      }
      return redirect("/admin/products", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    default:
      return null;
  }
}

export async function loader({ params }) {
  let { id } = params;
  let product = await getProductById(id);

  return { product };
}

export default function EditProduct() {
  let { product } = useLoaderData();
  let navigation = useNavigation();
  let navigate = useNavigate();
  let isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <main className="max-w-xl mx-auto bg-white shadow-2xl rounded-3xl p-8 md:p-10 border border-gray-100">
        {/* Back Button - Softer, less intrusive design */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition duration-150 font-medium text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Products</span>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8 text-center">
          Edit Product Details
        </h1>

        {/* Product Image Preview - More prominent and centered */}
        {product.image && (
          <div className="flex justify-center mb-10">
            <img
              src={product.image}
              alt={product.name}
              // Increased size, rounded corners, prominent shadow, and a subtle ring effect
              className="w-56 h-56 object-cover rounded-2xl shadow-xl transition duration-300 hover:shadow-2xl ring-4 ring-green-100/50"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/224x224/F5F5F5/4B5563?text=No+Image";
              }}
            />
          </div>
        )}

        {/* Edit Form */}
        <Form method="post" className="space-y-6">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={product.name}
              required
              // Modern input style: white background, subtle border, strong focus ring
              className="w-full border border-gray-300 bg-white text-gray-800 rounded-xl px-4 py-2.5 transition duration-150 shadow-sm
                       focus:border-green-500 focus:ring-2 focus:ring-green-500/50"
              placeholder="Enter product name"
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price (Ksh)
            </label>
            <input
              type="number"
              name="price"
              id="price"
              defaultValue={product.price}
              required
              min="0"
              step="0.01"
              className="w-full border border-gray-300 bg-white text-gray-800 rounded-xl px-4 py-2.5 transition duration-150 shadow-sm
                       focus:border-green-500 focus:ring-2 focus:ring-green-500/50"
              placeholder="Enter product price"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <input
              type="text"
              name="category"
              id="category"
              defaultValue={product.category}
              required
              className="w-full border border-gray-300 bg-white text-gray-800 rounded-xl px-4 py-2.5 transition duration-150 shadow-sm
                       focus:border-green-500 focus:ring-2 focus:ring-green-500/50"
              placeholder="Enter category"
            />
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              defaultValue={product.image}
              required
              className="w-full border border-gray-300 bg-white text-gray-800 rounded-xl px-4 py-2.5 transition duration-150 shadow-sm
                       focus:border-green-500 focus:ring-2 focus:ring-green-500/50"
              placeholder="Paste image link"
            />
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              defaultValue={product.stock}
              required
              min="0"
              className="w-full border border-gray-300 bg-white text-gray-800 rounded-xl px-4 py-2.5 transition duration-150 shadow-sm
                       focus:border-green-500 focus:ring-2 focus:ring-green-500/50"
              placeholder="Enter stock quantity"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows="3"
              defaultValue={product.description}
              required
              className="w-full border border-gray-300 bg-white text-gray-800 rounded-xl px-4 py-2.5 transition duration-150 shadow-sm
                       focus:border-green-500 focus:ring-2 focus:ring-green-500/50"
              placeholder="Write a short description"
            />
          </div>

          {/* Save Button - Primary action with subtle lift effect and shadow */}
          <div className="pt-2">
            <button
              type="submit"
              name="_action"
              value="edit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-400/50 transition transform hover:-translate-y-0.5 hover:bg-green-700 disabled:opacity-75 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </Form>

        {/* Delete Section - Visually separated Danger Zone */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Permanently delete this product from the inventory. This action
            cannot be undone.
          </p>

          <Form method="post">
            <button
              type="submit"
              name="_action"
              value="delete"
              disabled={isSubmitting}
              className="w-full bg-red-500 text-white font-bold py-3 rounded-xl shadow-md shadow-red-300/50 hover:bg-red-600 transition disabled:opacity-75"
            >
              Delete Product
            </button>
          </Form>
        </div>
      </main>
    </div>
  );
}
