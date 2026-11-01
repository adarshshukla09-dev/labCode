const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    product_name: { type: String, required: true },
    category_id: Number,
    unit_price_cents: { type: Number, required: true, min: 0 },
    stock_quantity: { type: Number, required: true, min: 0, default: 0 },
    discontinued: { type: Number, enum: [0, 1], default: 0 },
    created_date: { type: String, required: true },
  },
  { timestamps: false, versionKey: false },
);

module.exports = mongoose.model("Product", schema, "products");
