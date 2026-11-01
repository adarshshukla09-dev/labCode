const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  { id: { type: Number, required: true, unique: true }, name: { type: String, required: true, unique: true }, region_id: Number, budget_cents: { type: Number, required: true, min: 0, default: 0 } },
  { timestamps: false, versionKey: false }
);

module.exports = mongoose.model('Department', schema, 'departments');
