const Job = require('../models/jobModel');

// 모든 채용 공고 조회 및 필터링/정렬
exports.getAllJobs = async (req, res) => {
    try {
        const { location, experience, requirement, sort, page = "1", limit = "10" } = req.query;

        // `page`와 `limit` 값을 숫자로 변환
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        // 필터링 조건 생성
        let filter = {};
        if (location) filter.location = { $regex: `.*${location}.*`, $options: 'i' }; // 부분 일치로 지역 필터링
        if (experience) filter.experience = { $regex: experience, $options: 'i' }; // 경력 필터링
        if (requirement) filter.requirement = { $regex: requirement, $options: 'i' }; // 학력 필터링

        console.log("Generated Filter:", filter);

        // 정렬 옵션 생성
        let sortOption = {};
        if (sort === 'date') sortOption.date = -1; // 날짜 최신순
        else if (sort === 'deadline') sortOption.deadline = 1; // 마감 임박순

        // 페이지네이션 계산
        const skip = (page - 1) * limit;
        const jobs = await Job.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        // 총 데이터 개수
        const totalItems = await Job.countDocuments(filter);

        res.status(200).json({
            status: 'success',
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            data: jobs,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching jobs',
            details: err.message,
        });
    }
};

// 특정 채용 공고 조회
exports.getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job', details: error.message });
  }
};

// 채용 공고 등록
exports.createJob = async (req, res) => {
  const { title, company, location, experience, requirement, jobtype, url, deadline, date } = req.body;

  try {
    const newJob = new Job({ title, company, location, experience, requirement, jobtype, url, deadline, date });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job', details: error.message });
  }
};

// 채용 공고 삭제
exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job', details: error.message });
  }
};

// 채용 공고 수정
exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedJob = await Job.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job', details: error.message });
  }
};
