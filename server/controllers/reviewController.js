const Groq = require('groq-sdk');
const pool = require('../config/db');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateReview = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const project = projectResult.rows[0];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a senior software engineer performing a professional code review. Analyze the given code and provide: 1) A brief overall summary (2-3 sentences), 2) Bugs or potential issues, 3) Code quality/style suggestions, 4) Performance improvements, 5) Security concerns if any. Be specific and reference line numbers where possible. Keep it concise and actionable.',
        },
        {
          role: 'user',
          content: `Review this ${project.language} code:\n\n${project.code_content}`,
        },
      ],
    });

    const fullReview = completion.choices[0].message.content;
    const overallSummary = fullReview.substring(0, 200) + '...';

    const savedReview = await pool.query(
      'INSERT INTO reviews (project_id, overall_summary, full_review) VALUES ($1, $2, $3) RETURNING *',
      [projectId, overallSummary, fullReview]
    );

    res.status(201).json({
      message: 'Review generated successfully',
      review: savedReview.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error while generating review' });
  }
};

const getReviewsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const reviews = await pool.query(
      'SELECT * FROM reviews WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );

    res.status(200).json(reviews.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { generateReview, getReviewsForProject };