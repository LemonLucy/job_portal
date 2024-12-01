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
    const { id } = req.params;
    const { title, skills, education, experience } = req.body;

    try {
        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            { title, skills, education, experience, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.status(200).json({ message: 'Resume updated successfully', resume: updatedResume });
    } catch (err) {
        res.status(500).json({ error: 'Error updating resume', details: err.message });
    }
};

// 이력서 삭제
exports.deleteResume = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedResume = await Resume.findByIdAndDelete(id);

        if (!deletedResume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting resume', details: err.message });
    }
};
