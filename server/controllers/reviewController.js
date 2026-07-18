const Groq = require('groq-sdk');
const pool = require('../config/db');
const { ESLint } = require('eslint');
const fs = require('fs');
const path = require('path');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const runStaticAnalysis = async (code, language) => {
  if (language !== 'javascript') {
    return null; // Only JS supported for real static analysis right now
  }

  try {
    const eslint = new ESLint({
  useEslintrc: true,
  cwd: path.join(__dirname, '..'),
  overrideConfigFile: path.join(__dirname, '..', '.eslintrc.json'),
});

    const results = await eslint.lintText(code);
    const messages = results[0].messages;

    if (messages.length === 0) {
      return 'No syntax errors, unused variables, or style violations detected.';
    }

    const formatted = messages
      .map((m) => `- Line ${m.line}: ${m.message} (${m.ruleId || 'syntax'})`)
      .join('\n');

    return formatted;
  } catch (err) {
    console.error('ESLint error:', err.message);
    return 'Static analysis could not be completed for this code.';
  }
};

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

    // Stage 1: Static Analysis (real ESLint for JS, AI-based for others)
    const staticAnalysisResult = await runStaticAnalysis(project.code_content, project.language);

    const staticSection = staticAnalysisResult
      ? `## Static Analysis (ESLint)\n${staticAnalysisResult}\n\n`
      : '';

    const systemPrompt = staticAnalysisResult
      ? `You are a senior software engineer performing a code review. Static analysis has already been run separately (shown above). Focus only on the AI Code Review section below.

## AI Code Review
Provide: 1) A brief overall summary (2-3 sentences), 2) Bug reports, 3) Optimization suggestions, 4) Code smell analysis, 5) Performance improvements, 6) Security recommendations, 7) Best practice recommendations.

Be specific and reference line numbers where possible. Do not repeat static analysis findings like unused variables or syntax errors — focus on deeper logic, design, and quality issues.`
      : `You are a senior software engineer performing a professional two-stage code review. Structure your response in exactly these two sections using markdown headers:

## Static Analysis
Identify and list: syntax errors, unused variables, missing imports, duplicate code, poor formatting, and code style violations. If none are found in a category, state "None found."

## AI Code Review
Provide: 1) A brief overall summary (2-3 sentences), 2) Bug reports, 3) Optimization suggestions, 4) Code smell analysis, 5) Performance improvements, 6) Security recommendations, 7) Best practice recommendations.

Be specific and reference line numbers where possible. Keep both sections concise and actionable.`;

    // Stage 2: AI Review
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Review this ${project.language} code:\n\n${project.code_content}` },
      ],
    });

    const aiSection = completion.choices[0].message.content;
    const fullReview = staticSection + aiSection;
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