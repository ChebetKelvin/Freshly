import { Link, Outlet, useLoaderData, redirect } from "react-router";
import {
  Leaf,
  Package,
  ShoppingBag,
  Users,
  Menu,
  X,
  CreditCard,
} from "lucide-react";
import { getProductsCount } from "../models/products";
import { getUsersCount } from "../models/user";
import { getOrdersCount } from "../models/order";
import { getSession } from "../.server/session";
import { useState } from "react";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  if (!user || user.role !== "admin") {
    throw redirect("/login");
  }

  const ordersCount = await getOrdersCount();
  const productsCount = await getProductsCount();
  const usersCount = await getUsersCount();

  return { user, ordersCount, productsCount, usersCount };
}

export default function AdminDashboard() {
  const { user, ordersCount, productsCount, usersCount } = useLoaderData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed  top-14 bottom-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 p-6 bg-green-700 text-white shadow-lg transition-transform duration-300 z-50`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-300" /> GroceryAdmin
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-green-200"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-3">
          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            <Package className="w-5 h-5 text-green-100" /> Products
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            <ShoppingBag className="w-5 h-5 text-green-100" /> Orders
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            <Users className="w-5 h-5 text-green-100" /> Users
          </Link>
          <Link
            to="/logout"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-200 hover:bg-red-500 transition"
          >
            Logout
          </Link>
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-20 right-4 z-50 p-2 bg-green-600/90 rounded-lg text-white shadow-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 pb-20">
        {/* Header */}
        <header className="sticky top-0 bg-green-100 shadow-sm p-4 flex justify-between items-center z-40">
          <h1 className="text-xl font-bold text-green-800">
            Welcome, {user.name}
          </h1>
        </header>

        {/* Dashboard Cards */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Products */}
            <div className="p-6 bg-white border border-green-200 shadow-sm rounded-xl hover:shadow-md transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <Package /> Products
              </h3>
              <p className="text-gray-500 mt-2">
                {productsCount} total products
              </p>
              <Link
                to="/admin/products"
                className="mt-4 inline-block text-sm text-green-600 hover:underline"
              >
                Manage Products →
              </Link>
            </div>

            {/* Orders */}
            <div className="p-6 bg-white border border-green-200 shadow-sm rounded-xl hover:shadow-md transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <ShoppingBag /> Orders
              </h3>
              <p className="text-gray-500 mt-2">{ordersCount} total orders</p>
              <Link
                to="/admin/orders"
                className="mt-4 inline-block text-sm text-green-600 hover:underline"
              >
                View Orders →
              </Link>
            </div>

            {/* Users */}
            <div className="p-6 bg-white border border-green-200 shadow-sm rounded-xl hover:shadow-md transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <Users /> Users
              </h3>
              <p className="text-gray-500 mt-2">{usersCount} total users</p>
              <Link
                to="/admin/users"
                className="mt-4 inline-block text-sm text-green-600 hover:underline"
              >
                Manage Users →
              </Link>
            </div>

            {/* Revenue */}
            <div className="p-6 bg-white border border-green-200 shadow-sm rounded-xl hover:shadow-md transition-transform hover:-translate-y-1">
              <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <CreditCard /> Revenue
              </h3>
              <p className="text-gray-500 mt-2">total revenue</p>
              <Link
                to="/admin/revenue"
                className="mt-4 inline-block text-sm text-green-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>

          {/* Sub-route Outlet */}
          <div className="bg-white border border-green-200 rounded-xl shadow-sm p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
