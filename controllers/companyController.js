const Company = require('../models/Company');
const Review = require('../models/Review');

// 회사 추가
exports.createCompany = async (req, res) => {
    try {
        const { company_name, establishment_date, ceo_name, industry, address } = req.body;

        const newCompany = new Company({
            company_name,
            establishment_date,
            ceo_name,
            industry,
            address
        });

        await newCompany.save();
        res.status(201).json({ message: 'Company created successfully', company: newCompany });
    } catch (err) {
        res.status(500).json({ error: 'Error creating company', details: err.message });
    }
};

// 모든 회사 조회
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching companies', details: err.message });
    }
};

// 특정 회사 조회
exports.getCompanyById = async (req, res) => {
    const { id } = req.params;

    try {
        const company = await Company.findById(id).populate({
            path: 'reviews',
            populate: { path: 'user', select: 'email' } // 리뷰 작성자의 이메일 포함
        });

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.status(200).json(company);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching company', details: err.message });
    }
};

// 회사에 리뷰 추가
exports.addReviewToCompany = async (req, res) => {
    const { id } = req.params; // 회사 ID
    const { rating, review } = req.body;

    try {
        // 새로운 리뷰 생성
        const newReview = new Review({
            user: req.user.id, // 로그인된 사용자 ID
            company: id, // 회사 ID
            rating,
            review,
        });

        await newReview.save();

        // 회사에 리뷰 추가
        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        company.reviews.push(newReview._id); // 리뷰 ID 추가
        await company.save();

        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (err) {
        res.status(500).json({ error: 'Error adding review to company', details: err.message });
    }
};