const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터베이스 연결
connectDB();

// 미들웨어
app.use(express.json());

// 라우트
app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
