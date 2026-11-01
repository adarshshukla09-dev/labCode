const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  { id: { type: Number, required: true, unique: true }, name: { type: String, required: true, unique: true }, parent_id: Number, description: String },
  { timestamps: false, versionKey: false }
);

module.exports = mongoose.model('Category', schema, 'categories');
