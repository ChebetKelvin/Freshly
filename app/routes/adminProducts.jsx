import { useLoaderData, Form, Link } from "react-router";
import { getProducts } from "../models/products";
import { Plus, Edit3, ChevronLeft } from "lucide-react";

export async function loader() {
  let results = await getProducts();

  let products = results.map((item) => {
    return {
      ...item,
      id: item._id.toString(),
    };
  });

  return { products };
}

export default function AdminProducts() {
  const { products } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <main className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header and Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Manage Products
            </h2>
            {/* Action Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Back Button (Secondary Style) */}
              <Link
                to="/admin"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-xl transition hover:bg-gray-100 hover:border-gray-400 shadow-sm text-base"
              >
                <ChevronLeft size={20} /> Back to Admin
              </Link>

              {/* Add Product Button (Primary Style) */}
              <Link
                to="/admin/products/new"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition transform hover:-translate-y-0.5 shadow-lg shadow-green-400/50 text-base"
              >
                <Plus size={20} /> Add New Product
              </Link>
            </div>
          </div>

          {/* Product Table - Modern Card Design */}
          <div className="overflow-x-auto bg-white shadow-2xl rounded-2xl border border-gray-100">
            <table className="min-w-full text-sm text-left">
              {/* Table Header - Clean and distinct background */}
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Price (Ksh)</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 transition-colors hover:bg-green-50/50"
                    >
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-green-700 font-bold text-right">
                        Ksh {product.price}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold
                          ${
                            product.stock > 50
                              ? "bg-green-100 text-green-800"
                              : product.stock > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      {/* Actions Column - Centered and clean icon link */}
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="text-green-600 hover:text-green-800 transition p-2 rounded-full hover:bg-green-100/70"
                          title="Edit Product"
                        >
                          <Edit3 size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-500 text-base italic"
                    >
                      No products found. Click 'Add New Product' to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
