import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our products, add your favorite items to the cart, and proceed to checkout. You can pay via M-Pesa or choose cash on delivery.",
    },
    {
      question: "Do you offer home delivery?",
      answer:
        "Yes! We deliver across major towns in Kenya. Delivery times vary depending on your location, but most orders arrive within 24 hours.",
    },
    {
      question: "Can I return or exchange products?",
      answer:
        "If you receive a damaged or wrong item, please contact us within 24 hours of delivery for a replacement or refund.",
    },
    {
      question: "Do you have same-day delivery?",
      answer:
        "Yes, we offer same-day delivery for selected items within Nairobi and nearby areas if you place your order before 2 PM.",
    },
    {
      question: "Is there a minimum order amount?",
      answer:
        "No minimum order is required. However, free delivery is available for orders above KSh 2,000.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach us through the Contact page, call our hotline, or chat with our support team via WhatsApp or email.",
    },
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6 md:px-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Have questions about shopping with{" "}
          <span className="font-semibold text-green-600">Freshly Grocery</span>?
          We’ve answered the most common ones below.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="p-5">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center text-left"
            >
              <h2 className="text-lg font-medium text-gray-800">
                {faq.question}
              </h2>
              {openIndex === index ? (
                <ChevronUp className="text-green-600 w-5 h-5" />
              ) : (
                <ChevronDown className="text-green-600 w-5 h-5" />
              )}
            </button>
            {openIndex === index && (
              <p className="mt-3 text-gray-600 text-sm sm:text-base">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Still have questions?
        </h3>
        <p className="text-gray-600 mb-4">
          Reach out to our support team — we’re always happy to help!
        </p>
        <a
          href="/contact"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
}
