import { useParams, Link } from "react-router";
import { ArrowLeft, Clock, Leaf } from "lucide-react";

const blogPosts = [
  {
    id: "1",
    title: "10 Easy Kenyan Recipes Using Fresh Groceries",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVsaWNpb3VzJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    date: "October 20, 2025",
    category: "Recipes",
    content: `
Kenyan cuisine is full of rich flavors that come from fresh local produce. Here are ten easy recipes you can try at home:
1. **Sukuma Wiki** – sautéed collard greens with onions and tomatoes.  
2. **Beef Stew** – tender beef cooked slowly in a tomato-onion gravy.  
3. **Githeri** – a classic mix of maize and beans.  
4. **Chapati** – soft layered flatbread that pairs perfectly with stews.  
5. **Ugali & Fried Fish** – a coastal favorite full of flavor.  
6. **Matoke** – green bananas simmered in coconut milk.  
7. **Mokimo** – mashed potatoes with maize and pumpkin leaves.  
8. **Kachumbari** – fresh tomato-onion salad for every meal.  
9. **Mandazi** – sweet, fluffy fried dough.  
10. **Fried Rice with Veggies** – colorful and quick to prepare.

With fresh ingredients from **Freshly Grocery**, you can make all of these dishes easily and affordably!
    `,
  },
  {
    id: "2",
    title: "How to Store Fruits & Vegetables to Keep Them Fresh Longer",
    image:
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJ1aXRzJTIwYW5kJTIwdmVnZXRhYmxlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    date: "October 18, 2025",
    category: "Tips",
    content: `
Proper storage helps you reduce food waste and save money.  
- **Keep bananas, tomatoes, and avocados out of the fridge** – they ripen better at room temperature.  
- **Store leafy greens in sealed containers** with a paper towel to absorb moisture.  
- **Keep onions and potatoes apart** – they make each other spoil faster.  
- **Freeze chopped herbs and fruits** to use later in smoothies and sauces.

Follow these hacks and enjoy your groceries longer while staying fresh and nutritious!
    `,
  },
  {
    id: "3",
    title: "Understanding Organic vs. Non-Organic Foods in Kenya",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/versus6-1-1559152957.jpg?resize=640:*",
    date: "October 14, 2025",
    category: "Health",
    content: `
Organic foods are grown without synthetic fertilizers or pesticides.  
They tend to have higher nutrient levels and are better for the environment.  
However, non-organic foods are also safe and affordable if sourced from trusted farmers.

In Kenya, look for certified organic labels from organizations like **KEBS** or **KOFSA** when shopping.  
Whether organic or not, always **wash produce thoroughly** and buy from reputable grocery stores like Freshly Grocery.
    `,
  },
  {
    id: "4",
    title: "Best Kenyan Beverages to Cool Off This Season",
    image:
      "https://assets.isu.pub/document-structure/230201095625-3594d906d33949eefa21c0fc351abedd/v1/f3ead93cd508cd5f8b58715569002cae.jpeg?width=720&quality=85%2C50",
    date: "October 10, 2025",
    category: "Drinks",
    content: `
Stay refreshed with these Kenyan favorites:
- **Fresh sugarcane juice** from local vendors.  
- **Tamarind juice (ukwaju)** – sweet, sour, and perfect for hot weather.  
- **Soda brands like Coca-Cola, Fanta, and Krest** – Kenyan classics.  
- **Mala (fermented milk)** – a healthy probiotic drink.  
- **Iced tea with lemon and mint** – great for afternoons.  

Visit our beverages section for water, juices, and soft drinks available countrywide!
    `,
  },
];

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <section className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Post not found.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white py-10 px-6 md:px-16">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <article className="max-w-4xl mx-auto">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-md mb-6"
        />
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <Leaf className="w-4 h-4 text-green-500" />
          <span className="font-semibold text-green-600">{post.category}</span>
          <Clock className="w-4 h-4 ml-4" />
          <span>{post.date}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {post.title}
        </h1>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>
    </section>
  );
}
