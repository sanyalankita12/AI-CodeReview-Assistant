# AI Code Review Assistant

A full-stack web application that helps developers improve their JavaScript code quality using automated static analysis and AI-powered code review.

##  Live Links

- **Frontend**: [CLIENT](https://ai-code-review-assistant-six-khaki.vercel.app/)
- **Backend API**: [SERVER](https://ai-codereview-assistant-wdv9.onrender.com)
- **GitHub Repo**: [AI-CodeReview-Assistant](https://github.com/sanyalankita12/AI-CodeReview-Assistant)

## Overview

Instead of waiting for a senior developer to manually review code, users can paste JavaScript code snippets or upload files directly into the application. The system runs a two-stage review process:

1. **Static Analysis** — ESLint checks for syntax errors, unused variables, and style violations.
2. **AI-Based Review** — Groq's Llama 3.3 model analyzes the code for bugs, code smells, performance issues, security concerns, and best practice violations.

All reviews are stored and can be revisited anytime through the submission history.

## ✨ Features

- User authentication (Signup/Login) with JWT and bcrypt password hashing
- Paste code or upload `.js` files for review
- Automated static analysis via ESLint
- AI-generated code review (bugs, optimizations, security, best practices)
- Submission history with detailed code + review view
- Dashboard with submission stats

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (hosted on Render) |
| Authentication | JWT + bcrypt |
| AI Integration | Groq API (Llama 3.3 70B) |
| Static Analysis | ESLint |
| File Uploads | Multer |
| Deployment | Vercel (frontend) + Render (backend & database) |

## 📁 Project Structure
AI-CodeReview-Assistant/
```
├── client/          # React frontend

└── server/          # Express backend
```

See individual README files in `/client` and `/server` for setup instructions.

##  Database Schema

**users**
| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR(100) |
| email | VARCHAR(150) UNIQUE |
| password_hash | VARCHAR(255) |
| created_at | TIMESTAMP |

**projects**
| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| user_id | INTEGER REFERENCES users(id) |
| project_name | VARCHAR(150) |
| code_content | TEXT |
| language | VARCHAR(50) |
| created_at | TIMESTAMP |

**reviews**
| Column | Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| project_id | INTEGER REFERENCES projects(id) |
| overall_summary | TEXT |
| full_review | TEXT |
| created_at | TIMESTAMP |

##  Known Scope Limitations

This project was built under a compressed timeline. The following features from the original scope were intentionally deprioritized:

- Multi-language static analysis (currently JavaScript only)
- Complexity metrics (cyclomatic complexity, etc.)
- Forgot password / profile management
- Search, filter, and delete on submission history
- GitHub repository integration

##  Author

 -Ankita Sanyal