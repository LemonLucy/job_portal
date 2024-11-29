const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true }, // 공고 제목
  company: { type: String, required: true }, // 회사 이름
  location: { type: String, required: true }, // 근무 위치
  experience: { type: String }, // 경력 요건
  requirement: { type: String }, // 학력 요건
  jobtype: { type: String }, // 고용 형태
  url: { type: String, required: true }, // 공고 URL
  deadline: { type: String }, // 지원 마감일
  date: { type: String }, // 공고 게시일
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
