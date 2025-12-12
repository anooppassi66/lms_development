const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const certificateController = require('./certificateController');

exports.createQuiz = async (req, res, next) => {
  try {
    const { course, title, questions, passMarks, durationMinutes, isPublic } = req.body;
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) return res.status(400).json({ message: 'title and questions required' });
    const quiz = await Quiz.create({ course, title, questions, passMarks, durationMinutes, isPublic });
    return res.status(201).json({ quiz });
  } catch (err) {
    next(err);
  }
};

exports.attemptQuiz = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const quizId = req.params.quizId;
    const { answers } = req.body; // [{ questionId, answerIndex }]
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'quiz not found' });
    if (!quiz.isActive) return res.status(404).json({ message: 'quiz not available' });

    // if quiz is tied to a course, ensure user is enrolled and readyForQuiz
    let enrollment = null;
    if (quiz.course) {
      enrollment = await Enrollment.findOne({ user: userId, course: quiz.course });
      if (!enrollment) return res.status(403).json({ message: 'not enrolled for this course' });
      if (!enrollment.readyForQuiz) return res.status(400).json({ message: 'complete lessons before taking the quiz' });
    }

    // grade
    const qMap = {};
    quiz.questions.forEach(q => qMap[q._id] = q);
    let score = 0;
    (answers || []).forEach(ans => {
      const q = qMap[ans.questionId];
      if (!q) return;
      if (ans.answerIndex === q.correctIndex) score += (q.marks || 0);
    });

    const passed = score >= quiz.passMarks;

      let certObj = null;
    if (passed && quiz.course) {
      // mark enrollment completed and generate certificate
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
      await enrollment.save();
        certObj = await certificateController.generateCertificate(userId, quiz.course, quiz._id);
    }

      return res.json({ score, total: quiz.totalMarks, passed, certificate: certObj });
  } catch (err) {
    next(err);
  }
};

exports.listQuizzes = async (req, res, next) => {
  try {
    const filter = {};
    if (!(req.query.include_inactive === 'true' && req.user && req.user.role === 'admin')) {
      filter.isActive = true;
    }
    if (req.query.course) filter.course = req.query.course;

    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '10'));
    const skip = (page - 1) * limit;

    const [total, quizzes] = await Promise.all([
      Quiz.countDocuments(filter),
      Quiz.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ]);

    return res.json({ meta: { total, page, limit }, quizzes });
  } catch (err) {
    next(err);
  }
};

exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'quiz not found' });
    if (!quiz.isActive && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'quiz not available' });
    }
    return res.json({ questions: quiz.questions, quiz });
  } catch (err) {
    next(err);
  }
};
