const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  { id: { type: Number, required: true, unique: true }, first_name: { type: String, required: true }, last_name: { type: String, required: true }, email: { type: String, unique: true, sparse: true }, department_id: Number, manager_id: Number, job_title: { type: String, required: true }, salary_cents: { type: Number, required: true, min: 0 }, commission_cents: { type: Number, default: null }, hire_date: { type: String, required: true }, birth_date: String, employment_status: { type: String, enum: ['Active', 'On Leave', 'Terminated'], default: 'Active' } },
  { timestamps: false, versionKey: false }
);

module.exports = mongoose.model('Employee', schema, 'employees');
