const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resume: { type: String }, // Changed to store URL as a string
  status: { type: String, enum: ['applied', 'cancelled'], default: 'applied' },
}, { timestamps: true });

applicationSchema.index({ user: 1, job: 1 }, { unique: true }); // Unique Index to prevent duplicate applications

module.exports = mongoose.model('Application', applicationSchema);
