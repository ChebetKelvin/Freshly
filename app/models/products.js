import { client, ObjectId } from "../.server/mongo";

let db = client.db("grocery");
let collection = db.collection("products");

export async function getProducts() {
  return collection.find().toArray();
}

export async function getProductsCount() {
  return collection.countDocuments();
}

export async function getProductById(id) {
  return collection.findOne({ _id: ObjectId.createFromHexString(id) });
}

export async function createProduct(product) {
  let result = await collection.insertOne(product);
  return result;
}

export async function updateProduct(id, updatedData) {
  return collection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: updatedData }
  );
}

export async function deleteProduct(id) {
  return collection.deleteOne({
    _id: ObjectId.createFromHexString(id),
  });
}
