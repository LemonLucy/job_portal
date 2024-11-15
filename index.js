const express = require('express');
const connectDB = require('./config/db');
const app = express();
const PORT = 3000;

// 데이터베이스 연결
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, JCloud!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
