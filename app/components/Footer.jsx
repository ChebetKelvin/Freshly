import { Link } from "react-router";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaEnvelope,
  FaPhoneAlt,
  FaLeaf,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 border-t border-green-700/50 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8">
          {/* Logo + Intro + Social */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold text-green-400 mb-4 tracking-tight flex items-center">
              <FaLeaf className="mr-2" /> Freshly
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-sm">
              Your trusted online partner — delivering farm-fresh, quality
              produce straight from local growers to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-green-400 hover:bg-green-600 hover:text-white transition duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-green-400 hover:bg-green-600 hover:text-white transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-green-400 hover:bg-green-600 hover:text-white transition duration-300"
                aria-label="Pinterest"
              >
                <FaPinterestP className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 border-b-2 border-green-600/50 pb-2 w-max">
              Company
            </h3>
            <ul className="space-y-4 text-base">
              <li>
                <Link to="/about" className="hover:text-green-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-green-400 transition">
                  Our Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 border-b-2 border-green-600/50 pb-2 w-max">
              Help & Support
            </h3>
            <ul className="space-y-4 text-base">
              <li>
                <Link to="/faq" className="hover:text-green-400 transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-green-400 transition"
                >
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-green-400 transition">
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-5 border-b-2 border-green-600/50 pb-2 w-max">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <a
                href="tel:+254700123456"
                className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition"
              >
                <FaPhoneAlt className="text-green-500" /> +254 792 582 541
              </a>
              <a
                href="mailto:support@freshmart.co.ke"
                className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition"
              >
                <FaEnvelope className="text-green-500" />{" "}
                support@freshmart.co.ke
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p className="text-gray-500">
            © {new Date().getFullYear()} FreshMart. All rights reserved. |{" "}
            <Link to="/privacy" className="hover:text-green-400 transition">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link to="/terms" className="hover:text-green-400 transition">
              Terms of Service
            </Link>
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMPGxi5WoE0uLWHpT-C-km3qDaueN7WpTVlQ&s"
              alt="Mpesa"
              className="h-5 opacity-80"
            />
          </div>
          <p className="pt-2 font-semibold text-gray-200">
            Designed by kelvin chebet
          </p>
        </div>
      </div>
    </footer>
  );
}
