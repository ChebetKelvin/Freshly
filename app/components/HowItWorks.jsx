// components/HowItWorks.jsx
import { FaSearch, FaShoppingCart, FaTruck } from "react-icons/fa";
import deliveryImage from "/delivery2.jpg"; // Replace with your image path

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Browse & Select",
      desc: "Discover our wide variety of farm-fresh vegetables and add your favorites to the cart.",
      icon: <FaSearch />,
    },
    {
      step: 2,
      title: "Secure Checkout",
      desc: "Choose your preferred delivery time slot and complete your payment securely online.",
      icon: <FaShoppingCart />,
    },
    {
      step: 3,
      title: "Delivered Fresh",
      desc: "Your order is delivered right to your doorstep, maintaining peak freshness and quality.",
      icon: <FaTruck />,
    },
  ];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          How It <span className="text-green-700">Works</span>
        </h2>
        <p className="text-lg text-gray-600 mx-auto max-w-2xl">
          Getting farm-fresh produce is seamless. Just follow our simple 3-step
          process and enjoy effortless, healthy shopping every time.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left - Image */}
        <div className="order-2 lg:order-1">
          <img
            src={deliveryImage}
            alt="A vibrant collage of fresh vegetables and a delivery box"
            className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Right - Steps */}
        <div className="order-1 lg:order-2">
          <div className="space-y-8">
            {steps.map((step) => (
              <div
                key={step.title}
                className="flex items-start p-6 rounded-2xl bg-white shadow-xl border border-gray-100 hover:ring-4 hover:ring-green-100 transition duration-300"
              >
                <div className="shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-extrabold text-xl mr-5 shadow-md">
                  {step.icon}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
