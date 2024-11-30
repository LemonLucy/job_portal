const Bookmark = require('../models/Bookmarks');
const Job = require('../models/jobModel');

exports.toggleBookmark = async (req, res) => {
  try {
    const { jobId } = req.params; // URL 경로에서 jobId 추출
    const userId = req.user.id; // 인증된 사용자 ID

    // 해당 공고가 실제로 존재하는지 확인
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // 북마크 존재 여부 확인
    const existingBookmark = await Bookmark.findOne({ user: userId, job: jobId });

    if (existingBookmark) {
      // 북마크 삭제
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      return res.status(200).json({ message: 'Bookmark removed' });
    }

    // 북마크 추가
    const newBookmark = new Bookmark({ user: userId, job: jobId });
    await newBookmark.save();

    res.status(201).json({ message: 'Bookmark added', bookmark: newBookmark });
  } catch (error) {
    res.status(500).json({ error: 'Error toggling bookmark', details: error.message });
  }
};

exports.getBookmarks = async (req, res) => {
    try {
      const userId = req.user.id; // 인증된 사용자 ID
      const { page = 1, limit = 10, sort = 'recent' } = req.query; // 페이지네이션 쿼리
  
      // Define sort options
      const sortOptions = {
        recent: { createdAt: -1 }, // Default: Newest first
        company: { 'job.company': 1 }, // Alphabetical by company name
        position: { 'job.title': 1 } // Alphabetical by job title
      };
  
      // Validate and use the provided sort option, or default to 'recent'
      const sortOrder = sortOptions[sort] || sortOptions.recent;

      
      const bookmarks = await Bookmark.find({ user: userId })
        .populate('job') // Job 데이터를 함께 조회
        .sort(sortOrder) // 최신순 정렬
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      res.status(200).json({ bookmarks });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching bookmarks', details: error.message });
    }
  };
  exports.filterBookmarks = async (req, res) => {
    try {
      const userId = req.user.id; // 인증된 사용자 ID
      const { location, experience, salary, stack } = req.query; // 필터링 조건
  
      const query = { user: userId };
      if (location) query['job.location'] = location;
      if (experience) query['job.experience'] = experience;
      if (salary) query['job.salary'] = { $gte: parseInt(salary) }; // 급여 조건
      if (stack) query['job.stack'] = stack; // 기술 스택 조건
  
      const bookmarks = await Bookmark.find(query).populate('job');
  
      res.status(200).json({ bookmarks });
    } catch (error) {
      res.status(500).json({ error: 'Error filtering bookmarks', details: error.message });
    }
  };
  exports.searchBookmarks = async (req, res) => {
    try {
      const userId = req.user.id; // 인증된 사용자 ID
      const { keyword } = req.query; // 검색 키워드
  
      const bookmarks = await Bookmark.find({ user: userId })
        .populate({
          path: 'job',
          match: {
            $or: [
              { title: { $regex: keyword, $options: 'i' } }, // 포지션 검색
              { company: { $regex: keyword, $options: 'i' } } // 회사명 검색
            ]
          }
        });
  
      // 검색 결과 중 job이 null인 경우 제거
      const filteredBookmarks = bookmarks.filter((bookmark) => bookmark.job !== null);
  
      res.status(200).json({ bookmarks: filteredBookmarks });
    } catch (error) {
      res.status(500).json({ error: 'Error searching bookmarks', details: error.message });
    }
  };
  exports.getJobDetails = async (req, res) => {
    try {
      const { id } = req.params;
  
      const job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      // 조회수 증가
      job.views = (job.views || 0) + 1;
      await job.save();
  
      res.status(200).json({ job });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching job details', details: error.message });
    }
  };

// 북마크된 Job을 기반으로 관련 공고 추천
exports.getRelatedJobsFromJobId = async (req, res) => {
    try {
      const { jobId } = req.params; // Job ID 추출
  
      // 공고가 실제로 존재하는지 확인
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      // 유사 공고 검색
      const relatedJobs = await Job.find({
        _id: { $ne: jobId }, // 자기 자신 제외
        location: job.location, // 동일한 위치
        jobtype: job.jobtype // 동일한 고용 형태
      }).limit(5); // 최대 5개 반환
  
      res.status(200).json({ relatedJobs });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching related jobs', details: error.message });
    }
  };