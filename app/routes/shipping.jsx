export default function Shipping() {
  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6 md:px-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
          Shipping & Delivery Information
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          At{" "}
          <span className="font-semibold text-green-600">Freshly Grocery</span>,
          we’re committed to delivering your groceries fresh and on time — right
          to your doorstep.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-8">
        {/* Delivery Coverage */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Delivery Coverage
          </h2>
          <p className="text-gray-600">
            We currently deliver across major towns in Kenya including Nairobi,
            Meru, Nakuru, Eldoret, Kisumu, and Mombasa. If you’re outside our
            standard delivery areas, contact our support team for special
            arrangements.
          </p>
        </div>

        {/* Delivery Time */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Delivery Time
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>Same-day delivery</strong> for orders placed before 2 PM
              within Nairobi and nearby towns.
            </li>
            <li>
              <strong>Next-day delivery</strong> for other regions across Kenya.
            </li>
            <li>
              We’ll notify you by SMS or WhatsApp once your order is on the way.
            </li>
          </ul>
        </div>

        {/* Delivery Fees */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Delivery Fees
          </h2>
          <p className="text-gray-600 mb-3">
            Delivery fees vary by location and order value. We offer free
            delivery for orders above
            <span className="font-semibold text-green-600"> KSh 2,000</span>.
          </p>
          <table className="w-full text-gray-700 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-green-100">
              <tr>
                <th className="text-left px-4 py-2">Region</th>
                <th className="text-left px-4 py-2">Delivery Fee</th>
                <th className="text-left px-4 py-2">Estimated Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">Nairobi & Environs</td>
                <td className="px-4 py-2">KSh 150</td>
                <td className="px-4 py-2">Same day (before 2 PM)</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">Meru, Embu, Thika</td>
                <td className="px-4 py-2">KSh 200</td>
                <td className="px-4 py-2">Next day</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-2">Other Towns (Kenya)</td>
                <td className="px-4 py-2">KSh 250</td>
                <td className="px-4 py-2">1–2 days</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Packaging & Handling */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Packaging & Handling
          </h2>
          <p className="text-gray-600">
            All perishable items are packed with care to maintain freshness and
            hygiene. We use eco-friendly packaging and temperature-controlled
            storage during delivery.
          </p>
        </div>

        {/* Contact Support */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-3">
            For delivery-related issues or inquiries, please reach out to our
            support team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
