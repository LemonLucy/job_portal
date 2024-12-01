const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // 리뷰 작성자
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }, // 회사와의 관계
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }, // 평점 (1~5)
    review: {
        type: String,
        maxlength: 500
    }, // 리뷰 내용
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);
