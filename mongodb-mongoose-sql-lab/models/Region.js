const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  { id: { type: Number, required: true, unique: true }, region_name: { type: String, required: true, unique: true } },
  { timestamps: false, versionKey: false }
);

module.exports = mongoose.model('Region', schema, 'regions');
