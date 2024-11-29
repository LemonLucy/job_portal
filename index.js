const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerOptions');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터베이스 연결
connectDB();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 미들웨어
app.use(express.json());

// 라우트
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
