const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  { id: { type: Number, required: true, unique: true }, first_name: { type: String, required: true }, last_name: { type: String, required: true }, email: { type: String, unique: true, sparse: true }, city: String, country: { type: String, required: true }, signup_date: { type: String, required: true }, referred_by: Number },
  { timestamps: false, versionKey: false }
);

module.exports = mongoose.model('Customer', schema, 'customers');
