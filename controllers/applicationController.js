const Application = require('../models/Application');
const Job = require('../models/jobModel');
const User = require('../models/User'); // User 모델 가져오기

// 지원 생성
exports.createApplication = async (req, res) => {
    const { id: jobId } = req.params; // URL에서 Job ID 추출
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
            status: 'applied', // 기본 상태
        });
        await application.save();

        // 사용자 모델에 지원 정보 추가
        const user = await User.findById(userId);
        user.applications = user.applications || [];
        user.applications.push(application._id); // User 모델에 Application ID 추가
        await user.save();

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
    const { userId } = req.params; // URL에서 사용자 ID 추출
    const { status, sort = 'desc' } = req.query;

    try {
        // 필터 조건
        let filter = {};
        if (userId) {
            filter.user = userId; // 특정 사용자에 대한 지원 목록
        } else {
            filter.user = req.user.id; // 현재 로그인된 사용자의 지원 목록
        }

        if (status) {
            filter.status = status; // 상태별 필터링
        }

        // 정렬 조건
        const sortOption = sort === 'asc' ? 1 : -1;

        // 데이터 조회
        const applications = await Application.find(filter)
            .populate('job', 'title company location deadline') // 필요한 Job 정보만 포함
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

// 지원 취소
exports.cancelApplication = async (req, res) => {
    const { id } = req.params;

    try {
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

        // 사용자 모델에서 지원 내역 제거
        const user = await User.findById(req.user.id);
        user.applications = user.applications.filter(
            (appId) => appId.toString() !== application._id.toString()
        );
        await user.save();

        await application.deleteOne();
        
        res.status(200).json({ message: 'Application cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling application:', err.message);
        res.status(500).json({ error: 'Error cancelling application', details: err.message });
    }
};
