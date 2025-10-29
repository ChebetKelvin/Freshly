import { Link } from "react-router";
import { Leaf, Clock } from "lucide-react";

export const meta = () => [
  { title: "Grocery Blog | Fresh Tips & Recipes" },
  {
    name: "description",
    content:
      "Explore healthy eating tips, recipes, and grocery shopping guides.",
  },
];

const blogPosts = [
  {
    id: 1,
    title: "10 Easy Kenyan Recipes Using Fresh Groceries",
    excerpt:
      "From sukuma wiki to beef stew — discover simple, delicious meals you can make with everyday market ingredients.",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVsaWNpb3VzJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    date: "October 20, 2025",
    category: "Recipes",
  },
  {
    id: 2,
    title: "How to Store Fruits & Vegetables to Keep Them Fresh Longer",
    excerpt:
      "Learn simple storage hacks to reduce waste and make your groceries last longer — straight from the fridge to your table.",
    image:
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJ1aXRzJTIwYW5kJTIwdmVnZXRhYmxlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    date: "October 18, 2025",
    category: "Tips",
  },
  {
    id: 3,
    title: "Understanding Organic vs. Non-Organic Foods in Kenya",
    excerpt:
      "Is organic really better? Here’s a guide to choosing the healthiest options at your local grocery store.",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/versus6-1-1559152957.jpg?resize=640:*",
    date: "October 14, 2025",
    category: "Health",
  },
  {
    id: 4,
    title: "Best Kenyan Beverages to Cool Off This Season",
    excerpt:
      "From fresh fruit juices to popular soda brands, here are refreshing drink ideas for every occasion.",
    image:
      "https://assets.isu.pub/document-structure/230201095625-3594d906d33949eefa21c0fc351abedd/v1/f3ead93cd508cd5f8b58715569002cae.jpeg?width=720&quality=85%2C50",
    date: "October 10, 2025",
    category: "Drinks",
  },
];

export default function Blog() {
  return (
    <section className="min-h-screen bg-white py-16 px-6 md:px-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-green-600 flex justify-center items-center gap-2">
          <Leaf className="w-7 h-7 text-green-500" /> Fresh Blog
        </h1>
        <p className="text-gray-600 mt-2">
          Your source for fresh grocery tips, recipes, and healthy living.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <span className="text-sm text-green-600 font-semibold">
                {post.category}
              </span>
              <h2 className="text-lg font-bold text-gray-800 mt-2 mb-3">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>

              <div className="flex justify-between items-center text-gray-400 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
