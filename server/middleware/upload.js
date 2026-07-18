const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.js', '.py', '.java', '.cpp', '.c', '.jsx', '.ts', '.tsx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only code files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });
module.exports = upload;