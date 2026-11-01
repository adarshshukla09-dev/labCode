require('dotenv').config();
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const seedDatabase = require('../seed');

const expectedCounts = {
  regions: 4,
  departments: 9,
  employees: 28,
  customers: 21,
  categories: 9,
  products: 20,
  orders: 25,
  order_items: 43,
};

async function run() {
  const uri = process.env.MONGODB_URI;
  assert.ok(uri, 'MONGODB_URI is required. Add it to .env before running this test.');

  await seedDatabase({ uri, clear: true });
  await mongoose.connect(uri);

  try {
    for (const [collection, expected] of Object.entries(expectedCounts)) {
      const actual = await mongoose.connection.db.collection(collection).countDocuments();
      assert.equal(actual, expected, `${collection} document count`);
      console.log(`PASS ${collection}: ${actual}`);
    }

    // A few relationship/data integrity checks using the original numeric IDs.
    const orphanOrders = await mongoose.connection.db.collection('orders').aggregate([
      { $lookup: { from: 'customers', localField: 'customer_id', foreignField: 'id', as: 'customer' } },
      { $match: { customer: { $size: 0 } } },
      { $count: 'count' },
    ]).toArray();

    assert.equal(orphanOrders[0]?.count || 0, 0, 'Every order should reference an existing customer');
    console.log('PASS order -> customer references');
    console.log('All MongoDB seed tests passed.');
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
  mongoose.disconnect().catch(() => {});
});
