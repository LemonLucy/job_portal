const mongoose = require('mongoose');

const filterHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // 사용자 ID
    filters: {
        type: Map,
        of: String
    }, // 필터 조건 (예: { location: 'Seoul', experience: '2 years' })
    createdAt: {
        type: Date,
        default: Date.now
    } // 필터 사용 시점
});

module.exports = mongoose.model('FilterHistory', filterHistorySchema);
