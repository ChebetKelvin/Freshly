import { motion } from "framer-motion";
import { FaTruck, FaLeaf, FaUsers } from "react-icons/fa";

const deliverySteps = [
  {
    icon: <FaTruck />,
    title: "Fast Delivery",
    description:
      "We ensure your groceries arrive fresh and on time, every time.",
  },
  {
    icon: <FaLeaf />,
    title: "Fresh Products",
    description:
      "Only the highest quality fruits, vegetables, and groceries make it to your doorstep.",
  },
  {
    icon: <FaUsers />,
    title: "Customer Satisfaction",
    description:
      "Your happiness is our priority. We listen and improve with every order.",
  },
];

export default function AboutPage() {
  return (
    <section className="bg-white text-gray-900 pb-10">
      {/* Hero Section */}
      <div className="bg-green-500 text-white py-24 px-6 md:px-12 text-center rounded-b-3xl shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          About <span className="text-white/90">Freshly</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Freshly brings the best groceries to your doorstep with speed,
          quality, and care. From farm to table, we deliver freshness you can
          trust.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-6xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg">
            To make fresh, high-quality groceries accessible to every home,
            ensuring convenience, health, and sustainability.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">Our Vision</h2>
          <p className="text-gray-700 text-lg">
            To be the leading online grocery service in Kenya, known for
            freshness, reliability, and exceptional customer service.
          </p>
        </motion.div>
      </div>

      {/* Delivery Process */}
      <div className="bg-green-50 py-16 px-6 rounded-3xl border border-green-200 shadow-lg mt-10 mx-6 md:mx-12">
        <h2 className="text-4xl font-bold text-center text-green-700 mb-12">
          How <span className="text-green-600">Freshly</span> Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {deliverySteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md border border-green-200 hover:shadow-lg transition"
            >
              <div className="text-green-500 text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-700">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div
        className="relative bg-fixed bg-center bg-cover text-white py-24 px-6 text-center rounded-t-3xl shadow-lg mx-6 md:mx-12"
        style={{
          backgroundImage:
            "url('https://media.gettyimages.com/id/1497187128/photo/fresh-vegetables-in-the-refrigerated-section-of-the-supermarket.jpg?s=612x612&w=0&k=20&c=0a_SHH3iaRhQclKmupbx2biuQKqVgGTl7lnaHAQrMsw=')",
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-green-600/60 rounded-t-3xl"></div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Fresh?
          </h2>
          <p className="mb-6 text-lg md:text-xl">
            Browse our products and experience the freshest groceries delivered
            to your home.
          </p>
          <a
            href="/products"
            className="bg-white text-green-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-green-50 transition"
          >
            Browse Products
          </a>
        </div>
      </div>
    </section>
  );
}
