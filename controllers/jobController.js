const Job = require('../models/jobModel');

// 모든 채용 공고 조회
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date: -1 }); // 최신 공고가 먼저 오도록 정렬
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
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
