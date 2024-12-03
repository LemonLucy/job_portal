const Bookmark = require('../models/Bookmarks');
const Job = require('../models/jobModel');

// 북마크 추가/제거 (토글)
exports.toggleBookmark = async (req, res) => {
  try {
    const { jobId } = req.body; // Extract jobId from body
    const userId = req.user.id; // Get authenticated user ID

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if bookmark exists
    const existingBookmark = await Bookmark.findOne({ user: userId, job: jobId });

    if (existingBookmark) {
      // Remove bookmark
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      return res.status(200).json({ message: 'Bookmark removed' });
    }

    // Add bookmark
    const newBookmark = new Bookmark({ user: userId, job: jobId });
    await newBookmark.save();

    res.status(201).json({ message: 'Bookmark added', bookmark: newBookmark });
  } catch (error) {
    res.status(500).json({ error: 'Error toggling bookmark', details: error.message });
  }
};

// 북마크 목록 조회
exports.getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, sort = 'recent' } = req.query;

    const sortOptions = {
      recent: { createdAt: -1 },
      company: { 'job.company': 1 },
      position: { 'job.title': 1 },
    };

    const sortOrder = sortOptions[sort] || sortOptions.recent;

    const bookmarks = await Bookmark.find({ user: userId })
      .populate('job', 'title company location')
      .sort(sortOrder)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ bookmarks });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookmarks', details: error.message });
  }
};

// 북마크 필터링
exports.filterBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { location, experience, salary, stack } = req.query;

    const query = { user: userId };
    if (location) query['job.location'] = location;
    if (experience) query['job.experience'] = experience;
    if (salary) query['job.salary'] = { $gte: parseInt(salary) };
    if (stack) query['job.stack'] = { $in: stack.split(',') };

    const bookmarks = await Bookmark.find(query).populate('job');
    res.status(200).json({ bookmarks });
  } catch (error) {
    res.status(500).json({ error: 'Error filtering bookmarks', details: error.message });
  }
};

// 북마크 검색
exports.searchBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { keyword } = req.query;

    const bookmarks = await Bookmark.find({ user: userId }).populate({
      path: 'job',
      match: {
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { company: { $regex: keyword, $options: 'i' } },
        ],
      },
    });

    const filteredBookmarks = bookmarks.filter((bookmark) => bookmark.job !== null);
    res.status(200).json({ bookmarks: filteredBookmarks });
  } catch (error) {
    res.status(500).json({ error: 'Error searching bookmarks', details: error.message });
  }
};

// 특정 Job ID 기반 관련 공고 추천
exports.getRelatedJobsFromJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const relatedJobs = await Job.find({
      _id: { $ne: jobId },
      location: job.location,
      jobtype: job.jobtype,
    }).limit(5);

    res.status(200).json({ relatedJobs });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching related jobs', details: error.message });
  }
};
