//회원 관리 API 비즈니스 로직
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');require('dotenv').config();
const { addToBlacklist } = require('../utils/blacklist');

// 회원가입
exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ error: 'Invalid email format' });
        }

        // 이메일 중복 체크
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // 새 사용자 생성 (비밀번호 암호화는 userSchema.pre('save')에서 처리)
        const newUser = new User({ email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error registering user', details: err.message });
    }
};

// 로그인
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        console.log("Stored hashed password:", user.password);
        console.log("Provided password for login:", password);

        // 비밀번호 비교
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Password mismatch:', { provided: password, stored: user.password });
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('Password match:', { provided: password, stored: user.password });

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = crypto.randomBytes(40).toString('hex');

        // 로그인 이력 저장
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        user.loginHistory.push({ ipAddress });

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ error: 'Error logging in', details: err });
    }
};

// 비밀번호 업데이트 및 자동 로그아웃
exports.updateProfile = async (req, res) => {
    const { name, email, oldPassword, newPassword } = req.body;

    try {
        // 현재 사용자 찾기
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 비밀번호 변경 요청 처리
        if (oldPassword && newPassword) {
            console.log("Processing password update...");

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Old password is incorrect' });
            }

            // 현재 Access Token 블랙리스트 추가
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                addToBlacklist(token);
                console.log("Token added to blacklist:", token);
            }

            // 새로운 비밀번호 저장
            user.password = newPassword

            // Refresh Token 무효화
            user.refreshToken = null;
            console.log("Password updated successfully.");
        }

        // 프로필 정보 업데이트 처리
        if (name) {
            console.log("Updating name:", name);
            user.name = name;
        }
        if (email) {
            console.log("Updating email:", email);
            user.email = email;
        }

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (err) {
        console.error("Error updating profile:", err.message);
        res.status(500).json({ error: 'Error updating profile', details: err.message });
    }
};

// 프로필 조회
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving profile', details: err.message });
    }
};

// 계정 삭제
exports.deleteAccount = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.id);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting account', details: err.message });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
    }

    try {
        console.log("Received Refresh Token:", refreshToken);
        const user = await User.findOne({ refreshToken });

        if (!user) {
            console.log("Invalid Refresh Token:", refreshToken);
            return res.status(404).json({ error: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Generated new Access Token:", newAccessToken);

        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(500).json({ error: 'Error refreshing token', details: err });
    }
};