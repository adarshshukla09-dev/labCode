# SQL Lab Master Database — MongoDB + Mongoose

This project mirrors the uploaded SQLite database in MongoDB. It contains all 8 collections and all 139 original rows.

## Collections

`regions`, `departments`, `employees`, `customers`, `categories`, `products`, `orders`, `order_items`

## Important design notes

- Original SQL `id` values are retained as numeric `id` fields. MongoDB also creates its normal `_id` ObjectId.
- Foreign keys are represented by numeric reference fields (`region_id`, `department_id`, `manager_id`, etc.). MongoDB does not enforce foreign keys automatically.
- ISO dates remain strings (`YYYY-MM-DD`) to preserve the original SQL values and avoid timezone shifts.
- Prices and salaries remain integer cents, exactly as in the SQLite source.
- SQL `NULL` email values are omitted during seeding so sparse unique email indexes work correctly.
- `order_items` has a unique compound index on `(order_id, product_id)`.

## Run it

1. Start MongoDB locally or create a MongoDB Atlas database.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set your connection string:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/sql_lab
   ```

4. Insert the complete dataset:

   ```bash
   npm run seed
   ```

5. Run the seed-and-verify test:

   ```bash
   npm test
   ```

**Warning:** `npm run seed` and `npm test` clear the eight target collections before inserting the dataset. Use a dedicated practice database; do not point this at production data.

## Example query

```js
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const Order = require('./models/Order');

await mongoose.connect(process.env.MONGODB_URI);

const puneCustomers = await Customer.find({ city: 'Pune' });
const deliveredOrders = await Order.find({ status: 'Delivered' });

await mongoose.disconnect();
```
