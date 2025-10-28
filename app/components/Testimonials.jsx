import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar } from "react-icons/fa";
// Import required Swiper styles and modules
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules"; // Added Pagination module

export default function Testimonials() {
  const testimonials = [
    // Data structure remains the same
    {
      name: "Sarah K.",
      review:
        "The fruits were unbelievably fresh, and the delivery was right on time! My go-to grocery service now. Absolutely recommend!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "James M.",
      review:
        "I love how easy it is to order. Supporting local farmers while getting quality produce is a win-win. Everything arrived perfectly chilled.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/35.jpg",
    },
    {
      name: "Grace W.",
      review:
        "Customer service is top-notch. Even when I made a mistake in my order, they fixed it right away! Highly professional.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Daniel N.",
      review:
        "Best online grocery experience! The packaging was eco-friendly and everything arrived super fresh. I'm a customer for life.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    // Increased padding and used a slightly darker background for better card contrast
    <section className="py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading - Improved typography */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          viewport={{ once: true }}
          // Stronger title styling
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight"
        >
          What Our <span className="text-green-700">Customers Say</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          // Better text size and width
          className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto"
        >
          Thousands of happy customers trust us with their fresh produce every
          week. Read their authentic reviews below.
        </motion.p>

        {/* Overall Rating - Moved up for immediate social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-10 inline-flex flex-col items-center p-4 rounded-xl border border-gray-200 bg-white shadow-sm" // Highlighted Trust Badge
        >
          <div className="flex justify-center items-center gap-2 text-yellow-500 mb-2 text-xl">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="w-5 h-5" /> // Larger stars
            ))}
          </div>
          <p className="text-gray-700 text-sm font-medium">
            Rated <span className="font-bold text-gray-900">4.8/5</span> based
            on 5,000+ verified reviews
          </p>
        </motion.div>

        {/* Swiper Carousel - Added pagination and refined classes */}
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop
          autoplay={{ delay: 4500, disableOnInteraction: false }} // Slightly slower autoplay
          pagination={{ clickable: true }} // Added clickable pagination dots
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3, spaceBetween: 40 }, // Increased space on desktop
          }}
          modules={[Autoplay, Pagination]} // Included Pagination module
          className="pb-16" // Increased padding bottom for pagination dots
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                // Enhanced Card Styling: Shadow-xl, rounded-3xl, flex-col with space-between
                className="h-full flex flex-col justify-between bg-white p-6 rounded-3xl shadow-xl border border-gray-100 transition duration-300 hover:shadow-2xl text-left"
              >
                {/* Review Content */}
                <div>
                  {/* Stars - Slightly larger */}
                  <div className="flex items-center mb-4 text-sm text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${i >= t.rating ? "text-gray-300" : ""}`}
                      /> // Faded stars for non-5 ratings
                    ))}
                  </div>

                  {/* Review Text - Prominent quotes and slightly larger font */}
                  <p className="text-gray-800 text-lg italic mb-6 leading-relaxed">
                    <span className="text-green-500 font-serif text-3xl mr-1 leading-none">
                      “
                    </span>
                    {t.review}
                  </p>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img
                    src={t.image}
                    alt={t.name}
                    // Larger, more prominent image
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-green-500 ring-offset-2"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {t.name}
                    </h4>
                    <p className="text-sm text-green-600 font-medium">
                      Verified Customer
                    </p>{" "}
                    {/* Color-coded verified status */}
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
