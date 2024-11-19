//사용자 모델(스키마)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // 로그인 이력
    loginHistory: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            ipAddress: {
                type: String,
                default: ""
            }
        }
    ]
});

// 비밀번호 암호화
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10); // 솔트 생성
        this.password = await bcrypt.hash(this.password, salt); // 비밀번호 해싱
        next();
    } catch (err) {
        next(err); // 에러 처리
    }
});

module.exports = mongoose.model('User', userSchema);
