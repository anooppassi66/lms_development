const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  filePath: { type: String, required: true },
  marks: { type: Number, default: 0 },
  outOf: { type: Number, default: 0 },
  awardedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', CertificateSchema);
