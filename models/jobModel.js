const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true }, // 공고 제목
  company: { type: String, required: true }, // 회사 이름
  location: { type: String, required: true }, // 근무 위치
  experience: { type: String }, // 경력 요건
  requirement: { type: String }, // 학력 요건
  jobtype: { type: String }, // 고용 형태
  url: { type: String, required: true, unique: true }, // 공고 URL
  deadline: { type: Date }, // 지원 마감일
  date: { type: Date }, // 공고 게시일
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review' // Review 모델 참조
    }
  ] // 리뷰 참조
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
