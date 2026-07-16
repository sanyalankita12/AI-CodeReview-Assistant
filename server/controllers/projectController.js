const pool = require('../config/db');

// SUBMIT CODE (Create new project/snippet)
const submitCode = async (req, res) => {
  try {
    const { project_name, code_content, language } = req.body;
    const userId = req.user.id; // JWT middleware se aaya

    const newProject = await pool.query(
      'INSERT INTO projects (user_id, project_name, code_content, language) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, project_name, code_content, language]
    );

    res.status(201).json({
      message: 'Code submitted successfully',
      project: newProject.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL PROJECTS (for logged-in user)
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

module.exports = { submitCode, getMyProjects };