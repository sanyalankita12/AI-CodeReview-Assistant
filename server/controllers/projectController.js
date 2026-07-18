const pool = require('../config/db');
const fs = require('fs');

const submitCode = async (req, res) => {
  try {
    const { project_name, code_content, language } = req.body;
    const userId = req.user.id;

    const newProject = await pool.query(
      'INSERT INTO projects (user_id, project_name, code_content, language) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, project_name, code_content, language]
    );

    res.status(201).json({ message: 'Code submitted successfully', project: newProject.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitCodeFromFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const projectName = req.body.project_name || req.file.originalname;
    const language = req.body.language || 'javascript';
    const codeContent = fs.readFileSync(req.file.path, 'utf-8');
    fs.unlinkSync(req.file.path);

    if (!codeContent || codeContent.trim().length < 10) {
      return res.status(400).json({ message: 'File appears to be empty or invalid' });
    }

    const newProject = await pool.query(
      'INSERT INTO projects (user_id, project_name, code_content, language) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, projectName, codeContent, language]
    );

    res.status(201).json({ message: 'File uploaded successfully', project: newProject.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error while processing file' });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await pool.query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.status(200).json(projects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitCode, submitCodeFromFile, getMyProjects };