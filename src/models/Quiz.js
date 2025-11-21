const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String }],
  correctIndex: { type: Number, required: true },
  marks: { type: Number, default: 1 }
});

const QuizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // optional for public quiz
  title: { type: String, required: true },
  questions: [QuestionSchema],
  totalMarks: { type: Number },
  passMarks: { type: Number, required: true },
  durationMinutes: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

QuizSchema.pre('save', function (next) {
  if (!this.totalMarks) {
    this.totalMarks = (this.questions || []).reduce((s, q) => s + (q.marks || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Quiz', QuizSchema);
