# Hotel Booking System

Full-stack hotel booking application built with Node.js/Express (backend) and React/Vite (frontend).

## 📁 Project Structure

```
hotel-booking-system/
├── backend/              # Node.js API server
│   ├── src/
│   ├── package.json
│   ├── .env.example     # Copy to .env and fill with your values
│   └── server.js
│
├── frontend/            # React Vite application
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
cp .env.example .env        # Copy and fill in your environment variables
npm install
npm run dev                 # Start with nodemon
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev                 # Start Vite dev server
```

## 📋 Environment Variables

### Backend (`.env`)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_USER` - Gmail for sending emails
- `EMAIL_PASSWORD` - Gmail app password
- `PORT` - Server port (default: 5000)

See `.env.example` for all variables.

## 🔒 Security

- Never commit `.env` files
- Use `.env.example` as a template
- Keep sensitive keys in environment variables
- Use different keys for dev/production

## 📚 Features

- User authentication (JWT)
- Room management
- Booking system
- Points/Rewards system
- Admin dashboard
- Email notifications

## 🛠 Tech Stack

**Backend:**
- Node.js/Express
- MongoDB/Mongoose
- JWT Authentication
- Nodemailer

**Frontend:**
- React 18
- Vite
- Axios
- React Router

## 📝 License

MIT
