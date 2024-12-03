const Application = require('../models/Application');
const Job = require('../models/jobModel');
const User = require('../models/User');

// 지원 생성
exports.createApplication = async (req, res) => {
    const { jobId, resume } = req.body; // Extract data from request body
    const userId = req.user.id;

    try {
        // Job ID 확인
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // 중복 지원 체크
        const existingApplication = await Application.findOne({ user: userId, job: jobId });
        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        // 지원 정보 저장
        const application = new Application({
            user: userId,
            job: jobId,
            resume,
        });
        await application.save();

        res.status(201).json({
            message: 'Application submitted successfully',
            application,
        });
    } catch (err) {
        console.error('Error creating application:', err.message);
        res.status(500).json({
            error: 'Error creating application',
            details: err.message,
        });
    }
};

// 지원 목록 조회
exports.getApplications = async (req, res) => {
    const { status, sort = 'desc' } = req.query;

    try {
        // 필터 조건
        const filter = { user: req.user.id }; // Only fetch the logged-in user's applications
        if (status) {
            filter.status = status; // 상태별 필터링
        }

        // 정렬 조건
        const sortOption = sort === 'asc' ? 1 : -1;

        // 데이터 조회
        const applications = await Application.find(filter)
            .populate('job', 'title company location deadline') // Include relevant Job details
            .sort({ createdAt: sortOption });

        res.status(200).json({ applications });
    } catch (err) {
        console.error('Error fetching applications:', err.message);
        res.status(500).json({
            error: 'Error fetching applications',
            details: err.message,
        });
    }
};

// 특정 사용자 지원 목록 조회
exports.getUserApplications = async (req, res) => {
    const { userId } = req.params;
    const { status, sort = 'desc' } = req.query;

    try {
        // 필터 조건
        const filter = { user: userId }; // Fetch applications for a specific user
        if (status) {
            filter.status = status;
        }

        // 정렬 조건
        const sortOption = sort === 'asc' ? 1 : -1;

        // 데이터 조회
        const applications = await Application.find(filter)
            .populate('job', 'title company location deadline') // Include relevant Job details
            .sort({ createdAt: sortOption });

        res.status(200).json({ applications });
    } catch (err) {
        console.error('Error fetching user applications:', err.message);
        res.status(500).json({
            error: 'Error fetching user applications',
            details: err.message,
        });
    }
};

// 지원 취소
exports.cancelApplication = async (req, res) => {
    const { id } = req.params;

    try {
        // 지원 정보 확인
        const application = await Application.findOneAndDelete({ _id: id, user: req.user.id });
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // 취소 가능 여부 확인
        // if (application.status !== 'applied') {
        //     return res.status(400).json({ error: 'Only applications with "applied" status can be cancelled' });
        // }

        // // 상태 업데이트
        // application.status = 'cancelled';
        // await application.save();

        res.status(200).json({ message: 'Application cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling application:', err.message);
        res.status(500).json({ error: 'Error cancelling application', details: err.message });
    }
};
