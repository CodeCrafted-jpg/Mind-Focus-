# 🧠 Mind-Focus+

A full-stack productivity application designed to help users stay focused using Pomodoro timers, session tracking, and distraction blocking.

> 📌 Built with React + Express + MongoDB.  
> 🛡️ Features login, session management, and Chrome extension support.

---

## 📂 Project Structure

Mind-Focus/
├── client/ # React (Vite) Frontend
├── server/ # Express Backend
├── chrome-extension/ # Chrome Extension (for site blocking)

yaml
Copy
Edit

---

## 🚀 Features

- 🔐 **User Auth:** Secure login and signup (JWT-based)
- ⏱️ **Pomodoro Timer:** Customizable focus and break sessions
- 📊 **Study Tracker:** Track today’s and weekly study time
- 👥 **Groups:** Collaborative study groups
- 🧱 **Chrome Extension:** Block distracting websites during focus mode (WIP)
- 🤖 **Ai Assistent:**Chat with ai study companion and get suggestions and help
---

## 🌐 Live Demo

🔗 **App:** [https://mind-focus.vercel.app](https://mind-focus.vercel.app)  
🛡️ The backend API is private and used internally by the app.

---

## 🧰 Tech Stack

| Frontend (client)           | Backend (server)            |
|-----------------------------|-----------------------------|
| React + Vite                | Express.js                  |
| TailwindCSS (theme: emerald)| MongoDB via Mongoose        |
| React Router DOM            | JWT + bcrypt for auth       |
| Recharts for analytics      | dotenv, cors, validator     |

---

## 🛠️ Local Setup

### 1. Clone the Repo

```bash
git clone https://github.com/CodeCrafted-jpg/Mind-Focus-.git
cd Mind-Focus-
2. Frontend (client)
bash
Copy
Edit
cd client
npm install
npm run dev
VITE_API_URL=http://localhost:8000
3. Backend (server)
bash
Copy
Edit
cd server
npm install
npm run dev
Configure .env in server/:

env
Copy
Edit
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
4. Chrome Extension
Coming soon with setup instructions

🧪 API Routes Overview
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
GET	/api/sessions/today	Today's sessions
POST	/api/sessions	Create session
DELETE	/api/sessions/:id	Delete a session
...	More endpoints...	In /routes/

📁 Deployment Plan
Frontend: Vercel

Backend: Render

MongoDB: MongoDB Atlas

📦 Will update this README with deployed links after hosting.

🤝 Contributing
Want to contribute? Open an issue, suggest features, or fork & pull request.

📄 License
MIT License

💬 Contact
Feel free to reach out via GitHub Issues or create a discussion.

