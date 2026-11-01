require("dotenv").config();

const mongoose = require("mongoose");
const path = require("node:path");

const seedData = require(path.join(process.cwd(), "seed-data.json"));

const COLLECTIONS = [
  "regions",
  "departments",
  "employees",
  "customers",
  "categories",
  "products",
  "orders",
  "order_items",
];

async function createIndexes(db) {
  const indexes = {
    regions: [
      [{ id: 1 }, { unique: true }],
      [{ region_name: 1 }, { unique: true }],
    ],
    departments: [
      [{ id: 1 }, { unique: true }],
      [{ name: 1 }, { unique: true }],
      [{ region_id: 1 }, {}],
    ],
    employees: [
      [{ id: 1 }, { unique: true }],
      [{ email: 1 }, { unique: true, sparse: true }],
      [{ department_id: 1 }, {}],
      [{ manager_id: 1 }, {}],
    ],
    customers: [
      [{ id: 1 }, { unique: true }],
      [{ email: 1 }, { unique: true, sparse: true }],
      [{ country: 1 }, {}],
      [{ referred_by: 1 }, {}],
    ],
    categories: [
      [{ id: 1 }, { unique: true }],
      [{ name: 1 }, { unique: true }],
      [{ parent_id: 1 }, {}],
    ],
    products: [
      [{ id: 1 }, { unique: true }],
      [{ category_id: 1 }, {}],
    ],
    orders: [
      [{ id: 1 }, { unique: true }],
      [{ customer_id: 1 }, {}],
      [{ order_date: 1 }, {}],
    ],
    order_items: [
      [{ id: 1 }, { unique: true }],
      [{ order_id: 1, product_id: 1 }, { unique: true }],
      [{ order_id: 1 }, {}],
    ],
  };

  for (const [collectionName, collectionIndexes] of Object.entries(indexes)) {
    const collection = db.collection(collectionName);

    for (const [keys, options] of collectionIndexes) {
      await collection.createIndex(keys, options);
    }
  }
}

async function seedMaster() {
  const uri = process.env.MONGO_DB_URL;

  if (!uri) {
    throw new Error("MONGO_DB_URL is not defined");
  }

  await mongoose.connect(uri);

  try {
    const db = mongoose.connection.db;

    // Clear only the lab collections; do not drop unrelated collections.
    for (const collectionName of COLLECTIONS) {
      await db.collection(collectionName).deleteMany({});
    }

    for (const collectionName of COLLECTIONS) {
      const documents = seedData[collectionName];

      if (!Array.isArray(documents)) {
        throw new Error(`Missing seed data for collection: ${collectionName}`);
      }

      if (documents.length > 0) {
        await db.collection(collectionName).insertMany(documents);
      }

      console.log(`${collectionName}: inserted ${documents.length} documents`);
    }

    await createIndexes(db);

    console.log("MongoDB master database initialized successfully.");
  } finally {
    await mongoose.disconnect();
  }
}

seedMaster().catch((error) => {
  console.error("MongoDB master initialization failed:", error);
  process.exitCode = 1;
});
