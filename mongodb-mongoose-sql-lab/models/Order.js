const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  { id: { type: Number, required: true, unique: true }, customer_id: { type: Number, required: true }, employee_id: Number, order_date: { type: String, required: true }, shipped_date: String, status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], required: true }, ship_city: String, ship_country: String, notes: String },
  { timestamps: false, versionKey: false }
);

module.exports = mongoose.model('Order', schema, 'orders');
