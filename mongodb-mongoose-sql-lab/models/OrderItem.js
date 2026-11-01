const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    order_id: { type: Number, required: true },
    product_id: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit_price_cents: { type: Number, required: true, min: 0 },
    discount_percent: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: false, versionKey: false },
);

schema.index({ order_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model("OrderItem", schema, "order_items");
