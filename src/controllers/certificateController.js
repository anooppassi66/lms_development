const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');

exports.generateCertificate = async (userId, courseId, quizId) => {
  // helper used by quizController — returns certificate metadata
  const user = await User.findById(userId);
  const course = await Course.findById(courseId);
  if (!user || !course) throw new Error('user or course not found');

  const fileName = `${user.first_name || 'user'}_${user._id}_${course.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  const filePath = path.join(__dirname, '../../certificates', fileName);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text('Certificate of Completion', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`This certifies that ${user.first_name || ''} ${user.last_name || ''}` , { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Has successfully completed the course: ${course.title}`, { align: 'center' });
  doc.moveDown();
  doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  const cert = await Certificate.create({ user: userId, course: courseId, quiz: quizId, filePath: `/certificates/${fileName}` });
  return cert;
};

exports.listCertificates = async (req, res, next) => {
  try {
    // admin can view all, employees view their own
    if (req.user.role === 'admin') {
      const certs = await Certificate.find().populate('user course');
      return res.json({ certificates: certs });
    } else {
      const certs = await Certificate.find({ user: req.user.id }).populate('course');
      return res.json({ certificates: certs });
    }
  } catch (err) {
    next(err);
  }
};
