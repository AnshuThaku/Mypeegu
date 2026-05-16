const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");

const uri =
  "mongodb+srv://anshthakurcs236_db_user:Wkx6o6JN6iIRKPfG@cluster0.ksxzzbx.mongodb.net/mypeegu?retryWrites=true&w=majority";

const client = new MongoClient(uri);

function convertMongoTypes(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertMongoTypes);
  }

  if (obj && typeof obj === "object") {
    // Convert ObjectId
    if (obj.$oid) {
      return new ObjectId(obj.$oid);
    }

    // Convert ISODate
    if (obj.$date) {
      return new Date(obj.$date);
    }

    const newObj = {};

    for (const key in obj) {
      newObj[key] = convertMongoTypes(obj[key]);
    }

    return newObj;
  }

  return obj;
}

async function run() {
  try {
    await client.connect();

    console.log("Connected to MongoDB Atlas");

    const db = client.db("mypeegu");

    const collection = db.collection("sel-modules");

    // Read JSON
    const rawData = JSON.parse(
      fs.readFileSync("../sel-modules-last10.json", "utf8")
    );

    // Convert Mongo Extended JSON
    const data = convertMongoTypes(rawData);

    // Insert
    const result = await collection.insertMany(data);

    console.log(`${result.insertedCount} records inserted successfully`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();