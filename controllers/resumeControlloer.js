const Resume = require('../models/Resume');

// 이력서 생성
exports.createResume = async (req, res) => {
    const { title, skills, education, experience } = req.body;

    try {
        const newResume = new Resume({
            user: req.user.id, // 현재 로그인한 사용자
            title,
            skills,
            education,
            experience
        });

        await newResume.save();
        res.status(201).json({ message: 'Resume created successfully', resume: newResume });
    } catch (err) {
        res.status(500).json({ error: 'Error creating resume', details: err.message });
    }
};

// 이력서 조회
exports.getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id }); // 현재 사용자 이력서 조회
        res.status(200).json(resumes);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching resumes', details: err.message });
    }
};

// 이력서 수정
exports.updateResume = async (req, res) => {
    const { title, skills, education, experience } = req.body; // 요청 본문에서 업데이트할 데이터 추출

    try {
        const updatedResume = await Resume.findOneAndUpdate(
            { user: req.user.id }, // 로그인한 사용자의 이력서
            { title, skills, education, experience, updatedAt: Date.now() }, // 업데이트할 데이터
            { new: true } // 업데이트된 데이터 반환
        );

        if (!updatedResume) {
            return res.status(404).json({ error: 'Resume not found for the user' });
        }

        res.status(200).json({ message: 'Resume updated successfully', resume: updatedResume });
    } catch (err) {
        res.status(500).json({ error: 'Error updating resume', details: err.message });
    }
};


// 이력서 삭제
exports.deleteResume = async (req, res) => {
    try {
        const deletedResume = await Resume.findOneAndDelete({ user: req.user.id }); // 사용자와 연관된 이력서 삭제

        if (!deletedResume) {
            return res.status(404).json({ error: 'Resume not found for the user' });
        }

        res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting resume', details: err.message });
    }
};
