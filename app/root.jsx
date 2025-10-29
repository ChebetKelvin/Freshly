import {
  Form,
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  NavLink,
} from "react-router";

import "./app.css";
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import { Toaster, toast } from "react-hot-toast";

import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSearch,
} from "react-icons/fa";
import Footer from "./components/Footer";
import { getSession, commitSession } from "./.server/session";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let cartItems = session.get("cartItems") || [];
  let toastMessage = session.get("toastMessage");
  let user = session.get("user");

  return data(
    { cartItems, toastMessage, user },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export function Layout({ children }) {
  let { cartItems, toastMessage, user } = useLoaderData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    let { message, type } = toastMessage;

    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        throw new Error(`${type} is not handled`);
    }
  }, [toastMessage]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* Navbar Section */}
        <nav className="bg-white/90 backdrop-blur-sm sticky top-0 w-full z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/freshly-logo.png"
                alt="Freshly Logo"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-xl font-bold text-green-600">Freshly</span>
            </Link>

            {/* Desktop Search Bar */}
            <Form
              method="get"
              action="/products"
              className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 w-full max-w-md lg:max-w-lg shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition duration-200"
            >
              <FaSearch className="text-green-500 text-sm md:text-lg" />
              <input
                type="text"
                name="search"
                placeholder="Search groceries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base w-full"
              />
            </Form>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `font-medium ${isActive ? "text-green-600" : "text-gray-700 hover:text-green-500"}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Cart */}
              <Link to="/cart" className="relative text-gray-700">
                <FaShoppingCart size={22} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* User / Login */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 focus:outline-none">
                    <FaUser size={20} className="text-green-600" />
                    <span className="font-medium">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transform transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-xl"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>

                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-gray-700 hover:bg-red-600"
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-gray-700"
                >
                  <FaUser size={20} />
                  <span className="font-medium">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-3">
              <Link to="/cart" className="relative text-gray-700">
                <FaShoppingCart size={22} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 focus:outline-none"
              >
                {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="md:hidden bg-white border-t shadow-md px-4 py-4">
              <div className="flex flex-col gap-4">
                <Form
                  method="get"
                  action="/products"
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 w-full max-w-md mx-auto shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition duration-200"
                >
                  <FaSearch className="text-green-500 text-sm sm:text-base" />

                  <input
                    type="text"
                    name="search" // make sure to match your loader param name
                    placeholder="Search groceries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base w-full"
                  />
                </Form>

                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `font-medium ${isActive ? "text-green-600" : "text-gray-700 hover:text-green-500"}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}

                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-green-500"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="text-gray-700 hover:text-green-500"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Form method="post" action="/logout">
                      <button
                        type="submit"
                        className="text-left w-full text-red-600 hover:text-red-700"
                        onClick={() => setMenuOpen(false)}
                      >
                        Logout
                      </button>
                    </Form>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1 text-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUser size={20} />
                    <span className="font-medium">Login</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>

        {children}
        <Toaster />
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
