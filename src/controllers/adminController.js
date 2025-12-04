const User = require('../models/User');
const Quiz = require('../models/Quiz');

// List employees with pagination
exports.listEmployees = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '10'));
    const skip = (page - 1) * limit;

    const filter = { role: 'employee' };
    // optionally filter by active status
    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    }

    const [total, employees] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    return res.json({ meta: { total, page, limit }, employees });
  } catch (err) {
    next(err);
  }
};

// Deactivate employee account
exports.deactivateEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const user = await User.findById(employeeId);
    if (!user) return res.status(404).json({ message: 'employee not found' });
    if (user.role !== 'employee') return res.status(400).json({ message: 'user is not an employee' });
    if (!user.isActive) return res.status(400).json({ message: 'employee already deactivated' });

    user.isActive = false;
    user.deactivatedAt = new Date();
    await user.save();

    return res.json({ message: 'employee deactivated', user: { id: user._id, email: user.email, isActive: user.isActive } });
  } catch (err) {
    next(err);
  }
};

// Deactivate quiz (soft delete)
exports.deactivateQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'quiz not found' });
    if (!quiz.isActive) return res.status(400).json({ message: 'quiz already deactivated' });

    quiz.isActive = false;
    await quiz.save();

    return res.json({ message: 'quiz deactivated', quiz: { id: quiz._id, title: quiz.title, isActive: quiz.isActive } });
  } catch (err) {
    next(err);
  }
};
