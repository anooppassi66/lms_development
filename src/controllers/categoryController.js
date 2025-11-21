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
    const cats = await Category.find().sort({ category_name: 1 });
    return res.json({ categories: cats });
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
