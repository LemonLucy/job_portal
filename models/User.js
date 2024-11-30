const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'] 
    }, // 이메일 형식 체크
    password: { 
        type: String, 
        required: true, 
        minlength: [8, 'Password must be at least 8 characters'] 
    }, // 비밀번호 최소 길이
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
    ],
    refreshToken: {
        type: String,
        default: ""
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application' // Application 모델과의 참조
        }
    ]
});

// 비밀번호 암호화
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);
