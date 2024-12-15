const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const applyRoutes=require('./routes/applications')
const bookmarkRoutes=require('./routes/bookmark')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerOptions');
const resumeRoutes = require('./routes/resume');
const companyRoutes=require('./routes/company')
const reviewRoutes=require('./routes/review')
const filterRoutes=require('./routes/filterHistory')
require('dotenv').config();

const app = express();
<<<<<<< HEAD
const PORT = process.env.PORT || 443;
=======
const PORT = 443;
>>>>>>> develop

// 데이터베이스 연결
connectDB();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 미들웨어
app.use(express.json());

// 라우트
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);
app.use('/applications',applyRoutes);
app.use('/bookmarks', bookmarkRoutes);
app.use('/resumes', resumeRoutes);
app.use('/companies',companyRoutes);
app.use('/reviews',reviewRoutes);
app.use('/history', filterRoutes)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
