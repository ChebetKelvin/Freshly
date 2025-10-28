import { client, ObjectId } from "../.server/mongo";

let db = client.db("grocery");
let collection = db.collection("user");

export async function getUser() {
  return collection.find().toArray();
}

export async function addUser(user) {
  return collection.insertOne(user);
}

export async function getUserByEmail(email) {
  return collection.findOne({ email });
}

export async function getUsersCount() {
  return collection.countDocuments();
}

export async function getUserById(id) {
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function updateUser(id, user) {
  return collection.updateOne({ _id: new ObjectId(id) }, { $set: user });
}
