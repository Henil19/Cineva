# 🚀 Cineva - Quick Start

Get your app running in **5 minutes**!

---

## ⚡ Prerequisites

Make sure you have:
- **Node.js** installed: https://nodejs.org/ (v14+)
- **MongoDB** running: https://www.mongodb.com/
- **Two terminal windows** open

---

## 📋 Step-by-Step Guide

### Terminal 1: Start Backend Server

```bash
# Navigate to backend folder
cd backend

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

**Expected output:**
```
Server running on port 5000
MongoDB connected
```

---

### Terminal 2: Seed Database (Optional but Recommended)

In a new terminal:
```bash
cd backend

# Run seed script to populate sample data
node seed.js
```

**Expected output:**
```
✅ MongoDB connected
🗑️ Cleared existing data
🎬 Added 5 movies
🏢 Added 4 theaters
🎪 Added 11 showtimes
✨ Database seeded successfully!
```

---

### Terminal 3: Start Frontend Server

In another new terminal:
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (first time only)
npm install

# Start the React app
npm start
```

**Expected output:**
```
webpack compiled successfully
Compiled successfully!

You can now view cineva-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.x.x.x:3000
```

---

## 🎬 Open in Browser

Click or go to: **http://localhost:3000**

---

## 🎮 What You Can Do

✅ **Browse Movies** - See all available movies on the home page  
✅ **Search** - Use the search bar to find specific movies  
✅ **View Details** - Click on a movie card to see full details  
✅ **Select Showtimes** - Browse showtimes by date and theater  
✅ **Check Availability** - See seat counts stored for each showtime

---

## 🗂️ Project Files Location

```
Cineva/
├── backend/          ← Backend API (Node + MongoDB)
│   ├── server.js     ← Main server file
│   ├── seed.js       ← Sample data script
│   ├── models/       ← Database schemas
│   └── package.json
│
├── frontend/         ← Frontend UI (React)
│   ├── src/
│   │   ├── pages/    ← Page components
│   │   ├── components/
│   │   └── services/ ← API calls
│   └── package.json
│
├── SETUP_GUIDE.md    ← Detailed setup
└── QUICK_START.md    ← This file
```

---

## 🔗 API Base URL

All API requests go to: `http://localhost:5000/api`

**Example:**
```
GET  http://localhost:5000/api/movies
GET  http://localhost:5000/api/theaters
GET  http://localhost:5000/api/showtimes
```

---

## 🌐 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/bookmyshow
PORT=5000
```

### Frontend (.env - optional)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🛑 Stopping Servers

Press `Ctrl + C` in any terminal to stop the server

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **MongoDB connection error** | Make sure MongoDB is running (`mongod` in terminal) |
| **Port 5000 already in use** | Change `PORT` in `.env` or close other apps |
| **npm not found** | Install Node.js from nodejs.org |
| **Module not found error** | Run `npm install` in that directory |
| **CORS error** | Make sure backend is running on port 5000 |

---

## 📊 Sample Data Included

After running `seed.js`, you'll have:
- 5 Movies: Oppenheimer, Barbie, Jawan, Pathaan, Killers of the Flower Moon
- 4 Theaters: PVR, INOX, Cinemax, Carnival
- 11 Showtimes across today and tomorrow; every movie has at least one

---

## 🎨 Customize

Want to change colors?
- Edit `/frontend/src/App.css`
- Change `#667eea` (purple) to your color
- Change `#764ba2` (dark purple) to your accent color

---

## 📚 Learn More

For detailed setup, advanced features, and deployment:
→ Read **SETUP_GUIDE.md**

---

## 🎉 You're Ready!

Your Cineva app is now running. Enjoy! 🎬🍿

**Next Steps:**
- Explore the app
- Customize the design
- Add more features
- Deploy to production

Happy coding! 🚀
