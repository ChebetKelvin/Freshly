import { client, ObjectId } from "../.server/mongo";

let db = client.db("grocery");
let collection = db.collection("order");

// Fetch all orders
export async function getOrders() {
  return collection.find().toArray();
}

export async function createOrder(orderData) {
  return collection.insertOne(orderData);
}

// Fetch a single order by ID
export async function getOrderById(id) {
  return collection.findOne({ _id: new ObjectId(id) });
}

// Get total count of orders
export async function getOrdersCount() {
  return collection.countDocuments();
}

// Get orders by user
export async function getOrdersByUser(userId) {
  // Correct field is `user`, not `userId`
  return collection.find({ user: userId }).toArray();
}

// Optionally, get orders by status (pending, shipped, delivered, etc.)
export async function getOrdersByStatus(status) {
  return collection.find({ status }).toArray();
}

export async function updateOrderStatus(orderId, status) {
  return collection.updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { status } }
  );
}

export async function getLastOrderAddress(userId) {
  let orders = await collection
    .find({ user: userId })
    .sort({ createdAt: -1 }) // most recent first
    .limit(1)
    .toArray();

  if (!orders || orders.length === 0) return null;

  return orders[0].shippingAddress; // adjust field name to your schema
}
export async function updateOrderPayment(checkoutRequestId, update) {
  const orders = db.collection("orders");

  return await orders.updateOne(
    { checkoutRequestId },
    {
      $set: {
        status: update.status,
        receipt: update.receipt,
        phone: update.phone,
        paidAt: new Date(),
      },
    }
  );
}

export async function saveCheckoutRequestId(orderId, checkoutRequestId) {
  return collection.updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { checkoutRequestId } }
  );
}

export async function deleteOrder(id) {
  return collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
}
