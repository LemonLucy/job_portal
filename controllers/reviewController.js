const Review = require('../models/Review');
const Company = require('../models/Company');

// 리뷰 생성
exports.createReview = async (req, res) => {
    const { company, rating, review } = req.body;

    try {
        const newReview = new Review({
            user: req.user.id, // 로그인된 사용자 ID
            company,
            rating,
            review
        });

        await newReview.save();

        // 회사에 리뷰 추가
        const relatedCompany = await Company.findById(company);
        if (!relatedCompany) {
            return res.status(404).json({ error: 'Company not found' });
        }
        await relatedCompany.save();

        res.status(201).json({ message: 'Review created successfully', review: newReview });
    } catch (err) {
        res.status(500).json({ error: 'Error creating review', details: err.message });
    }
};

// 리뷰 조회
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'email') // 작성자 이메일만 포함
            .populate('company', 'company_name'); // 회사 이름만 포함
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching reviews', details: err.message });
    }
};

// 리뷰 삭제
exports.deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting review', details: err.message });
    }
};
