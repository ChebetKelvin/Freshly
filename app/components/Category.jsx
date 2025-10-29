import { motion } from "framer-motion";

// --- MOCK REACT-ROUTER and UTILITY COMPONENTS/FUNCTIONS ---
// These mocks ensure the file is self-contained and runnable.
const Link = ({ to, className, children }) => (
  <a href={to} className={className}>
    {children}
  </a>
);

// Mock products data structure for category extraction
const products = [
  { category: "Fruits" },
  { category: "Vegetables" },
  { category: "Dairy" },
  { category: "Bakery" },
  { category: "Beverages" },
  { category: "Spices" },
  { category: "Meat" },
];

export default function CategorySection() {
  // Extract unique categories
  const categories = [...new Set(products.map((p) => p.category))];

  // Representative images for each category
  const categoryImages = {
    // FIX: Replaced local path with a stable placeholder for reliability
    Fruits: "/friuts.jpg",
    Vegetables:
      "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=400&h=300",
    Dairy:
      "https://media.istockphoto.com/id/2178111666/photo/variety-of-dairy-products-on-the-table-outdoors.webp?a=1&b=1&s=612x612&w=0&k=20&c=2-bpx_tB6xK-XZQ5u4cBNtHD7AMb0enZvv0iQM5AXLw=",
    Bakery:
      "https://images.unsplash.com/photo-1623246123320-0d6636755796?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=400&h=300",
    Beverages:
      "https://images.unsplash.com/photo-1581006855389-c17d881f3baf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=400&h=300",
    Spices:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=400&h=300",
    Meat: "https://images.unsplash.com/photo-1603052875000-2c8f1b3d4c5e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=400&h=300",
    Default:
      "https://images.unsplash.com/photo-1723893905879-0e309c2a8e06?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWVhdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Shop by <span className="text-green-600">Category</span>
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Fresh choices for every lifestyle, delivered fast.
          </p>
        </div>

        {/* Category Grid (Mobile First Layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category}
              to={`/category/${encodeURIComponent(category)}`}
              className="group" // Add group class for hover effects on children
              aria-label={`Shop the ${category} category`}
            >
              {/* Framer Motion Card */}
              <motion.div
                // ENHANCEMENT: Scroll-in animation
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                // ENHANCEMENT: Updated hover effect (scale + green shadow)
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(16, 185, 129, 0.4)", // Green shadow
                }}
                className="relative flex flex-col items-center bg-gray-50 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 transform hover:z-10"
              >
                {/* Image Container */}
                <div className="w-full h-32 sm:h-36 md:h-40 overflow-hidden">
                  <img
                    src={categoryImages[category] || categoryImages.Default}
                    alt={category}
                    // ENHANCEMENT: Image hover scale and brightness
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-90"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = categoryImages.Default;
                    }}
                  />
                </div>

                {/* Text Detail */}
                <div className="w-full py-3 px-4 text-center">
                  <h3 className="text-gray-800 font-bold text-base sm:text-lg capitalize transition-colors duration-300 group-hover:text-green-600">
                    {category}
                  </h3>
                </div>

                {/* Subtle visual element on hover (Green border/ring) */}
                <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-green-500/50 transition duration-300"></div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
