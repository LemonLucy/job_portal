const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 지원자
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },  // 지원한 Job
    status: { type: String, enum: ['applied', 'cancelled'], default: 'applied' }, // 지원 상태
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
