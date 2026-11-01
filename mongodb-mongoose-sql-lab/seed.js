const mongoose = require("mongoose");
const seedData = require("./data/seed-data_recreated.json");

const modelFiles = [
  ["Region", "./models/Region"],
  ["Department", "./models/Department"],
  ["Employee", "./models/Employee"],
  ["Customer", "./models/Customer"],
  ["Category", "./models/Category"],
  ["Product", "./models/Product"],
  ["Order", "./models/Order"],
  ["OrderItem", "./models/OrderItem"],
];

async function seedDatabase({
  uri = process.env.MONGO_DB_URL ||
    "mongodb://root:YourMongoSecurePassword@localhost:27017/mongo_lab_master?authSource=admin",

  clear = true,
} = {}) {
  if (!uri)
    throw new Error("Set MONGODB_URI in your environment or .env file.");
  await mongoose.connect(uri);

  try {
    const models = modelFiles.map(([name, path]) => [name, require(path)]);
    // Delete in reverse dependency order when resetting an existing seed database.
    if (clear) {
      for (const [, Model] of [...models].reverse()) await Model.deleteMany({});
    }

    for (const [name, Model] of models) {
      const docs = seedData[Model.collection.collectionName].map((row) => {
        const copy = { ...row };
        // Sparse unique email indexes should not store SQL NULL as MongoDB null.
        if (copy.email === null) delete copy.email;
        return copy;
      });
      await Model.insertMany(docs, { ordered: true });
      console.log(`Inserted ${docs.length} ${name} documents`);
    }
    console.log("MongoDB seed completed successfully.");
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  require("dotenv").config();
  seedDatabase().catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  });
}

module.exports = seedDatabase;
