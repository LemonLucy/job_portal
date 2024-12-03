const FilterHistory = require('../models/filterHistory');

// 필터 기록 저장
exports.saveFilterHistory = async (req, res) => {
    const { filters } = req.body;

    try {
        const newFilterHistory = new FilterHistory({
            user: req.user.id,
            filters
        });

        await newFilterHistory.save();
        res.status(201).json({ message: 'Filter history saved successfully', filterHistory: newFilterHistory });
    } catch (err) {
        res.status(500).json({ error: 'Error saving filter history', details: err.message });
    }
};

// 특정 사용자 필터 기록 조회
exports.getUserFilterHistory = async (req, res) => {
    try {
        const filterHistory = await FilterHistory.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(filterHistory);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching filter history', details: err.message });
    }
};

// 필터 기록 삭제
exports.deleteFilterHistory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedHistory = await FilterHistory.findByIdAndDelete(id);

        if (!deletedHistory) {
            return res.status(404).json({ error: 'Filter history not found' });
        }

        res.status(200).json({ message: 'Filter history deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting filter history', details: err.message });
    }
};
