# AI Code Review Assistant — Backend

Express.js REST API for the AI Code Review Assistant.

## Tech Stack

- Node.js + Express.js
- PostgreSQL (via `pg`)
- JWT authentication + bcrypt password hashing
- Multer (file uploads)
- ESLint (static analysis)
- Groq API (AI code review)

## Local Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder.

Run the dev server:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Login and receive a JWT token |

### Projects
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/projects` | Yes | Submit pasted code |
| POST | `/api/projects/upload` | Yes | Submit code via file upload |
| GET | `/api/projects` | Yes | Get all projects for the logged-in user |

### Reviews
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/reviews/:projectId` | Yes | Generate a static + AI review for a project |
| GET | `/api/reviews/:projectId` | Yes | Get all reviews for a specific project |

Protected routes require an `Authorization: Bearer <token>` header.

## Folder Structure
```
server/
├── config/
│ └── db.js # PostgreSQL connection
├── controllers/
│ ├── authController.js
│ ├── projectController.js
│ └── reviewController.js
├── middleware/
│ ├── authMiddleware.js # JWT verification
│ └── upload.js # Multer config
├── routes/
│ ├── authRoutes.js
│ ├── projectRoutes.js
│ └── reviewRoutes.js
└── server.js


```

## Deployment

Deployed on Render as a Web Service. Root directory set to `server`, build command `npm install`, start command `node server.js`.




