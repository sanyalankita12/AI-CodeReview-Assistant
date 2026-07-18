# AI Code Review Assistant — Frontend

React (Vite) frontend for the AI Code Review Assistant.

## Tech Stack

- React 19 (Vite)
- Tailwind CSS v4
- Axios (API calls)
- react-markdown (rendering AI review output)

## Local Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:

VITE_API_URL=http://localhost:5000

(For production, this points to the deployed backend URL.)

Run the dev server:

```bash
npm run dev
```

App runs on `http://localhost:5173`

## Folder Structure
## 📁 Project Structure

```text
client/
├── src/
│   ├── Components/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── CodeSubmit.jsx
│   ├── App.jsx
│   └── main.jsx
```

## Deployment

Deployed on Vercel. Environment variable `VITE_API_URL` must be set in Vercel project settings to point to the live backend URL.