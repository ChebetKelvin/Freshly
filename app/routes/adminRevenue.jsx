import { useLoaderData, useNavigate } from "react-router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getOrders } from "../models/order";

// Helper to generate last N dates
function getLastNDates(n) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

// Loader function
export async function loader() {
  const results = await getOrders(); // fetch orders from DB

  const last30Days = getLastNDates(30);
  const revenueMap = {};
  last30Days.forEach((date) => (revenueMap[date] = 0));

  // Aggregate daily revenue
  results.forEach((order) => {
    const date = new Date(order.createdAt).toISOString().split("T")[0];
    if (revenueMap[date] !== undefined) {
      revenueMap[date] += order.totalPrice || 0;
    }
  });

  // Prepare data for chart
  const revenueData = Object.entries(revenueMap).map(([date, amount]) => ({
    date,
    amount,
  }));

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.amount, 0);
  const averageRevenue = revenueData.length
    ? totalRevenue / revenueData.length
    : 0;
  const maxRevenue = Math.max(...revenueData.map((r) => r.amount), 0);

  return { revenueData, totalRevenue, averageRevenue, maxRevenue };
}

// Component
export default function AdminRevenue() {
  const { revenueData, totalRevenue, averageRevenue, maxRevenue } =
    useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-900 mt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-green-700">
          Revenue - Last 30 Days
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center hover:shadow-lg transition">
          <h3 className="text-gray-500 font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-700 mt-2">
            Ksh {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center hover:shadow-lg transition">
          <h3 className="text-gray-500 font-semibold">Average Daily Revenue</h3>
          <p className="text-2xl font-bold text-green-700 mt-2">
            Ksh {averageRevenue.toFixed(0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center hover:shadow-lg transition">
          <h3 className="text-gray-500 font-semibold">Highest Revenue Day</h3>
          <p className="text-2xl font-bold text-green-700 mt-2">
            Ksh {maxRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          Revenue Trend (Last 30 Days)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={revenueData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#16a34a"
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis stroke="#16a34a" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#14532d" }}
              formatter={(value) => [
                `Ksh ${value.toLocaleString()}`,
                "Revenue",
              ]}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
