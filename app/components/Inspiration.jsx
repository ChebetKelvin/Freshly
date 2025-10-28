import { Link } from "react-router";
import { FaLeaf, FaUtensils, FaSeedling } from "react-icons/fa";

export default function InspirationSection() {
  const articles = [
    {
      icon: <FaUtensils className="w-6 h-6" />,
      title: "Top 5 Ways to Cook Potatoes",
      desc: "Discover creative, delicious recipes using fresh potatoes straight from our farms.",
      link: "https://www.bbcgoodfood.com/howto/guide/ways-potatoes",
      image:
        "https://images.unsplash.com/photo-1694393779439-11ff6dbad2a4?auto=format&fit=crop&q=60&w=600",
    },
    {
      icon: <FaLeaf className="w-6 h-6" />,
      title: "Meet Our Farmers: The Roots of Freshness",
      desc: "Get to know the passionate growers who bring fresh produce to your table every day.",
      link: "https://thetrustees.org/program/meet-our-farmers/",
      image:
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    },
    {
      icon: <FaSeedling className="w-6 h-6" />,
      title: "Effortless Healthy Meal Kits",
      desc: "Enjoy convenient, chef-designed kits for balanced and nutritious home-cooked meals.",
      link: "https://sunbasket.com/",
      image:
        "https://images.unsplash.com/photo-1666819691666-4be36926335e?auto=format&fit=crop&q=80&w=1170",
    },
  ];

  return (
    <section className="py-24 bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Get Inspired with <span className="text-green-700">Fresh Ideas</span>
        </h2>
        <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
          Discover easy recipes, learn about sustainable eating, and meet the
          dedicated local farmers who grow your food.
        </p>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((a) => (
            <Link
              key={a.title}
              to={a.link}
              className="group relative overflow-hidden rounded-3xl shadow-xl transition duration-500 hover:shadow-2xl hover:scale-[1.01] cursor-pointer block"
            >
              {/* Image */}
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-left transition-all duration-300">
                <div className="p-2 mb-3 w-max rounded-lg bg-green-500/90 text-white transform group-hover:-translate-y-1 transition duration-300">
                  {a.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 leading-snug">
                  {a.title}
                </h3>
                <p className="text-gray-200 mb-4 line-clamp-2">{a.desc}</p>

                <span className="inline-flex items-center text-sm font-semibold text-green-300 group-hover:text-green-200 transition duration-300">
                  Explore & Learn
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
