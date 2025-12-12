const Category = require('../models/Category');
const Course = require('../models/Course');

exports.createCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    if (!category_name) return res.status(400).json({ message: 'category_name is required' });
    const exists = await Category.findOne({ category_name });
    if (exists) return res.status(400).json({ message: 'category already exists' });
    const cat = await Category.create({ category_name });
    return res.status(201).json({ category: cat });
  } catch (err) {
    next(err);
  }
};

exports.listCategories = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.q) {
      const q = String(req.query.q).trim();
      filter.category_name = { $regex: q, $options: 'i' };
    }
    const hasSkip = req.query.skip !== undefined;
    const limit = Math.min(100, parseInt(req.query.limit || '10'));
    const page = hasSkip ? Math.floor(parseInt(req.query.skip || '0') / limit) + 1 : Math.max(1, parseInt(req.query.page || '1'));
    const skip = hasSkip ? Math.max(0, parseInt(req.query.skip || '0')) : (page - 1) * limit;

    const [total, cats] = await Promise.all([
      Category.countDocuments(filter),
      Category.find(filter).sort({ category_name: 1 }).skip(skip).limit(limit)
    ]);
    return res.json({ meta: { total, page, limit, skip }, categories: cats });
  } catch (err) {
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'category not found' });
    return res.json({ category: cat });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'category not found' });
    if (category_name) cat.category_name = category_name;
    await cat.save();
    return res.json({ category: cat });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const catId = req.params.id;
    const cat = await Category.findById(catId);
    if (!cat) return res.status(404).json({ message: 'category not found' });

    const used = await Course.exists({ category: catId });
    if (used) return res.status(400).json({ message: 'cannot delete category in use by a course' });

    await Category.findByIdAndDelete(catId);
    return res.json({ message: 'category deleted' });
  } catch (err) {
    next(err);
  }
};
