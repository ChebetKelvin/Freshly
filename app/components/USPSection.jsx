import { FaLeaf, FaTruck, FaHandsHelping, FaRecycle } from "react-icons/fa";

export default function USPSection() {
  const features = [
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: "Farm-to-Table Freshness",
      desc: "We guarantee the freshest produce, delivered straight from trusted local farms every morning.",
    },
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Flexible, Zero-Contact Delivery",
      desc: "Enjoy flexible delivery slots and real-time tracking, prioritized for safety and convenience.",
    },
    {
      icon: <FaHandsHelping className="w-8 h-8" />,
      title: "Direct Local Farmer Support",
      desc: "Every purchase directly supports smallholder family farmers in our community.",
    },
    {
      icon: <FaRecycle className="w-8 h-8" />,
      title: "100% Sustainable Packaging",
      desc: "We use only recyclable and compostable materials for all our packaging and operations.",
    },
  ];

  return (
    <section className="py-24 bg-gray-100 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Why Choose <span className="text-green-700">Freshly?</span>
        </h2>
        <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
          We’re your dedicated source for the highest quality produce, committed
          to freshness, sustainability, and supporting our local community.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-200 
                         transition-all duration-300 hover:shadow-2xl hover:border-green-400"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className="p-4 mb-4 rounded-full bg-green-100 text-green-600 
                             group-hover:bg-green-600 group-hover:text-white 
                             transform group-hover:scale-105 transition duration-300"
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-base leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
