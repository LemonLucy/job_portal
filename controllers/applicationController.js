const Application = require('../models/Application');
const Job = require('../models/jobModel');

exports.createApplication = async (req, res) => {
    try {
        const { jobId, resume } = req.body;

        // 사용자가 지원한 Job이 존재하는지 확인
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // 중복 지원 체크
        const existingApplication = await Application.findOne({ user: req.user.id, job: jobId });
        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        // 지원 정보 저장
        const application = new Application({
            user: req.user.id,
            job: jobId,
            resume: resume || null,
            status: 'applied',
        });

        await application.save();
        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (err) {
        res.status(500).json({ error: 'Error creating application', details: err.message });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const { status, sort = 'desc' } = req.query;

        // 필터 조건
        let filter = { user: req.user.id };
        if (status) {
            filter.status = status; // 상태별 필터링
        }

        // 정렬 조건
        const sortOption = sort === 'asc' ? 1 : -1;

        // 데이터 조회
        const applications = await Application.find(filter)
            .populate('job', 'title company location') // 관련 Job 정보 포함
            .sort({ createdAt: sortOption });

        res.status(200).json({ applications });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching applications', details: err.message });
    }
};

exports.cancelApplication = async (req, res) => {
    try {
        const { id } = req.params;

        // 지원 정보 확인
        const application = await Application.findOne({ _id: id, user: req.user.id });
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // 취소 가능 여부 확인
        if (application.status !== 'applied') {
            return res.status(400).json({ error: 'Only applications with "applied" status can be cancelled' });
        }

        // 상태 업데이트
        application.status = 'cancelled';
        await application.save();

        res.status(200).json({ message: 'Application cancelled successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error cancelling application', details: err.message });
    }
};

