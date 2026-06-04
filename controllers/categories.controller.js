
const mongoose = require('mongoose');
const Category = require('../models/categories');

// Helper to standardize responses
const sendResponse = (res, statusCode, success, message, data = null) => {
	return res.status(statusCode).json({ success, message, data });
};

exports.createCategory = async (req, res) => {
	try {
		const { name, note } = req.body;
		if (!name || !name.trim()) {
			return sendResponse(res, 400, false, 'Name is required');
		}

		const category = await Category.create({ name: name.trim(), note });
		return sendResponse(res, 201, true, 'Category created', category);
	} catch (error) {
		return sendResponse(res, 500, false, 'Server error', { error: error.message });
	}
};

exports.updateCategory = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return sendResponse(res, 400, false, 'Invalid category id');
		}

		const updates = req.body;
		if (updates.name && typeof updates.name === 'string') updates.name = updates.name.trim();

		const updated = await Category.findByIdAndUpdate(id, updates, { new: true });
		if (!updated) return sendResponse(res, 404, false, 'Category not found');

		return sendResponse(res, 200, true, 'Category updated', updated);
	} catch (error) {
		return sendResponse(res, 500, false, 'Server error', { error: error.message });
	}
};

exports.deleteCategory = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return sendResponse(res, 400, false, 'Invalid category id');
		}

		const deleted = await Category.findByIdAndDelete(id);
		if (!deleted) return sendResponse(res, 404, false, 'Category not found');

		return sendResponse(res, 200, true, 'Category deleted', deleted);
	} catch (error) {
		return sendResponse(res, 500, false, 'Server error', { error: error.message });
	}
};

exports.getAllCategories = async (req, res) => {
	try {
		const page = Math.max(1, parseInt(req.query.page, 10) || 1);
		const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
		const skip = (page - 1) * limit;

		const filter = {};
		const sort = { createdAt: -1 };

		const [total, categories] = await Promise.all([
			Category.countDocuments(filter),
			Category.find(filter).sort(sort).skip(skip).limit(limit)
		]);

		const totalPages = Math.ceil(total / limit) || 1;

		return sendResponse(res, 200, true, 'Categories retrieved', {
			total,
			page,
			limit,
			totalPages,
			categories
		});
	} catch (error) {
		return sendResponse(res, 500, false, 'Server error', { error: error.message });
	}
};

exports.getCategoryById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return sendResponse(res, 400, false, 'Invalid category id');
		}

		const category = await Category.findById(id);
		if (!category) return sendResponse(res, 404, false, 'Category not found');

		return sendResponse(res, 200, true, 'Category retrieved', category);
	} catch (error) {
		return sendResponse(res, 500, false, 'Server error', { error: error.message });
	}
};

exports.searchCategories = async (req, res) => {
	try {
		const { keyword } = req.body || {};
		const page = Math.max(1, parseInt(req.body.page, 10) || 1);
		const limit = Math.max(1, parseInt(req.body.limit, 10) || 10);
		const skip = (page - 1) * limit;

		let filter = {};
		if (keyword && typeof keyword === 'string' && keyword.trim()) {
			filter = { $text: { $search: keyword.trim() } };
		}

		const sort = { createdAt: -1 };

		const [total, categories] = await Promise.all([
			Category.countDocuments(filter),
			Category.find(filter).sort(sort).skip(skip).limit(limit)
		]);

		const totalPages = Math.ceil(total / limit) || 1;

		return sendResponse(res, 200, true, 'Search results', {
			total,
			page,
			limit,
			totalPages,
			categories
		});
	} catch (error) {
		return sendResponse(res, 500, false, 'Server error', { error: error.message });
	}
};

