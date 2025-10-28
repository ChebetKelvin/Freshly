import { useState, useEffect, useRef } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Mail, Phone, MapPin, Send, Sun, Moon } from "lucide-react";

export default function ContactPage() {
  let actionData = useActionData();
  let navigation = useNavigation();
  let isSubmitting = navigation.state !== "idle";
  let formRef = useRef();

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!isSubmitting && actionData?.success) {
      formRef.current.reset();
    }
  }, [isSubmitting, actionData]);

  const primary = "#41a539"; // bright green
  const lightBg = "#ffffff";
  const darkBg = "#1f1f1f";
  const lightText = "#111111";
  const darkText = "#f5f5f5";

  return (
    <section
      className="min-h-screen py-16 px-4 sm:px-6 transition-colors duration-500"
      style={{
        backgroundColor: darkMode ? darkBg : lightBg,
        color: darkMode ? darkText : lightText,
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Toggle Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition duration-300"
            style={{
              borderColor: primary,
              color: darkMode ? primary : "#111",
              backgroundColor: darkMode ? "#111" : "#fff",
            }}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Header */}
        <h1
          className="text-4xl sm:text-5xl font-extrabold text-center mb-4"
          style={{ color: primary }}
        >
          Get in{" "}
          <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
            Touch
          </span>
        </h1>
        <p
          className={`text-center mb-12 text-lg sm:text-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Have questions about our products or delivery? Drop us a message and
          we'll get back to you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              {
                icon: <Mail className="w-6 h-6" style={{ color: primary }} />,
                title: "Email",
                value: "support@freshgrocer.com",
              },
              {
                icon: <Phone className="w-6 h-6" style={{ color: primary }} />,
                title: "Phone",
                value: "+254 700 000 000",
              },
              {
                icon: <MapPin className="w-6 h-6" style={{ color: primary }} />,
                title: "Address",
                value: "Meru, Kenya",
              },
            ].map((info, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-4 rounded-2xl shadow border transition-colors duration-300`}
                style={{
                  backgroundColor: darkMode ? "#2c2c2c" : "#fff",
                  borderColor: darkMode ? "#333" : "#e5e5e5",
                }}
              >
                {info.icon}
                <div>
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: primary }}
                  >
                    {info.title}
                  </h2>
                  <p>{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <Form
            ref={formRef}
            method="post"
            className="p-8 rounded-3xl shadow-lg flex flex-col gap-4 border transition-colors duration-300"
            style={{
              backgroundColor: darkMode ? "#2c2c2c" : "#fff",
              borderColor: darkMode ? "#333" : "#e5e5e5",
            }}
          >
            {actionData?.success && (
              <p className="text-green-500 font-semibold text-center mb-4">
                Thank you! We received your message.
              </p>
            )}

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition"
              style={{
                backgroundColor: darkMode ? "#1f1f1f" : "#fff",
                borderColor: primary,
                color: darkMode ? darkText : lightText,
              }}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition"
              style={{
                backgroundColor: darkMode ? "#1f1f1f" : "#fff",
                borderColor: primary,
                color: darkMode ? darkText : lightText,
              }}
            />
            <textarea
              name="message"
              rows="5"
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition"
              style={{
                backgroundColor: darkMode ? "#1f1f1f" : "#fff",
                borderColor: primary,
                color: darkMode ? darkText : lightText,
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all mt-2 shadow-md"
              style={{ backgroundColor: primary }}
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </Form>
        </div>
      </div>
    </section>
  );
}
