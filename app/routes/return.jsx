export default function Returns() {
  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6 md:px-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
          Return & Refund Policy
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          At{" "}
          <span className="font-semibold text-green-600">Freshly Grocery</span>,
          your satisfaction is our top priority. We strive to ensure every order
          meets the highest standards of freshness and quality.
        </p>
      </div>

      {/* Policy Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-8">
        {/* Eligibility */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Eligibility for Returns
          </h2>
          <p className="text-gray-600 mb-3">
            Due to the perishable nature of most grocery items, returns are
            handled on a case-by-case basis. We accept returns or replacements
            only if:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>The wrong item was delivered.</li>
            <li>
              The product arrived damaged, spoiled, or past its expiry date.
            </li>
            <li>The product packaging was tampered with during delivery.</li>
          </ul>
        </div>

        {/* Timeframe */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Return Timeframe
          </h2>
          <p className="text-gray-600">
            Customers must report any issue within
            <span className="font-semibold text-green-600"> 24 hours </span>
            of delivery. After this period, we may not be able to process
            replacements or refunds due to product freshness.
          </p>
        </div>

        {/* Refund Process */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Refund Process
          </h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>
              Contact our support team at{" "}
              <strong>support@freshlygrocery.co.ke</strong> or via WhatsApp.
            </li>
            <li>
              Provide your order number, contact details, and a clear photo of
              the product in question.
            </li>
            <li>
              Once verified, you’ll receive a replacement or refund within 2–3
              business days.
            </li>
          </ol>
        </div>

        {/* Non-returnable Items */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Non-returnable Items
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              Perishable goods (e.g., fruits, vegetables, meat, dairy) unless
              damaged or incorrect.
            </li>
            <li>Opened or partially used products.</li>
            <li>Items sold on clearance or special offers.</li>
          </ul>
        </div>

        {/* Refund Method */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Refund Method
          </h2>
          <p className="text-gray-600">
            Refunds are issued through your original payment method —
            <span className="font-semibold">
              {" "}
              M-Pesa, Card, or Cash on Delivery{" "}
            </span>
            — depending on how you paid for your order.
          </p>
        </div>

        {/* Customer Support */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Need Assistance?
          </h3>
          <p className="text-gray-600 mb-3">
            If you’re unsure whether your order qualifies for a return or
            refund, please contact our friendly support team.
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
