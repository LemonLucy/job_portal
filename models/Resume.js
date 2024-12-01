const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // 사용자와의 관계
    title: { 
        type: String, 
        required: true 
    }, // 이력서 제목
    skills: [{ 
        type: String 
    }], // 기술 목록
    education: [{ 
        school: String, 
        degree: String, 
        fieldOfStudy: String, 
        startDate: Date, 
        endDate: Date 
    }], // 학력 정보
    experience: [{ 
        company: String, 
        position: String, 
        startDate: Date, 
        endDate: Date, 
        description: String 
    }], // 경력 정보
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Resume', resumeSchema);
