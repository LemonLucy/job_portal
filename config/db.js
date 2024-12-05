const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://113.198.66.75:13122/job_portal'); // 옵션 제거
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
