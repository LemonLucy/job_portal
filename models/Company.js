const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true
    }, // 회사 이름
    establishment_date: {
        type: String,
        required: true
    }, // 설립일
    ceo_name: {
        type: String,
        required: true
    }, // 대표 이름
    industry: {
        type: String,
        required: true
    }, // 산업
    address: {
        type: String,
        required: true
    }, // 주소
    date: {
        type: Date,
        default: Date.now
    }, 
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review' // 리뷰 모델 참조
        }
    ]
});

module.exports = mongoose.model('Company', companySchema);
