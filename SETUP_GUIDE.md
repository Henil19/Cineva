# Cineva - Complete Setup Guide

A full-stack movie booking application built with **React**, **Node.js**, and **MongoDB**.

---

## 📋 Features

- ✅ Browse movies with search functionality
- ✅ View detailed movie information
- ✅ Select dates and view available showtimes
- ✅ Theater information and showtime pricing
- ✅ Responsive design for mobile and desktop
- ✅ Real-time seat availability tracking

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with gradients and animations
- **date-fns** - Date manipulation

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin request handling

---

## 📦 Prerequisites

Before you begin, ensure you have installed:

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **MongoDB** (v4.4 or higher)
   - Download: https://www.mongodb.com/try/download/community
   - Or use **MongoDB Atlas** (cloud): https://www.mongodb.com/cloud/atlas
   - Start MongoDB locally: `mongod`

3. **Git** (optional, for version control)
   - Download: https://git-scm.com/

---

## 🚀 Installation & Setup

### Step 1: Clone/Download the Project
```bash
cd Cineva
```

### Step 2: Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/bookmyshow
PORT=5000
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookmyshow
PORT=5000
```

Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

---

### Step 3: Frontend Setup

In a **new terminal**, navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm start
```

The app will automatically open at: **http://localhost:3000**

---

## 🎬 Adding Sample Data

Use this script to populate your database with sample movies and theaters.

### Option 1: Using cURL (Recommended)

Open your terminal and run these commands:

**Add Movies:**
```bash
curl -X POST http://localhost:5000/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Oppenheimer",
    "genre": ["Drama", "History"],
    "duration": 180,
    "language": ["English", "Hindi"],
    "releaseDate": "2023-09-21T00:00:00Z",
    "posterUrl": "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
    "description": "A biographical film about J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    "rating": 8.5
  }'
```

```bash
curl -X POST http://localhost:5000/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Barbie",
    "genre": ["Comedy", "Fantasy"],
    "duration": 114,
    "language": ["English", "Hindi"],
    "releaseDate": "2023-07-21T00:00:00Z",
    "posterUrl": "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    "description": "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.",
    "rating": 7.2
  }'
```

**Add Theater:**
```bash
curl -X POST http://localhost:5000/api/theaters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PVR Cinemas",
    "city": "Mumbai",
    "address": "123 Marine Drive, Mumbai",
    "screens": 8,
    "facilities": ["AC", "Parking", "Food Court", "Wheelchair Access"]
  }'
```

```bash
curl -X POST http://localhost:5000/api/theaters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "INOX Cinemas",
    "city": "Delhi",
    "address": "456 Connaught Place, Delhi",
    "screens": 6,
    "facilities": ["AC", "Parking", "Recliner Seats"]
  }'
```

### Option 2: Using MongoDB Compass (Visual)

1. Open **MongoDB Compass**
2. Connect to `mongodb://localhost:27017`
3. Create database: `bookmyshow` (the default legacy MongoDB database name; change `MONGO_URI` to use another name)
4. Create collections: `movies`, `theaters`, `showtimes`
5. Insert documents manually

---

## 📱 Application Routes

### Frontend Routes
- `/` - Home page with all movies
- `/movie/:id` - Movie detail page
- `/showtimes/:movieId` - Showtime selection page
- `/about` - About Cineva and its technology stack
- `/booking/:showtimeId` - Seat-selection placeholder; no booking is created

### Backend API Endpoints

**Movies:**
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get single movie
- `POST /api/movies` - Add new movie (admin)

**Theaters:**
- `GET /api/theaters` - Get all theaters
- `POST /api/theaters` - Add new theater (admin)

**Showtimes:**
- `GET /api/showtimes` - Get showtimes (query params: movieId, date)
- `GET /api/showtimes/:movieId/:date` - Get showtimes for movie on specific date
- `GET /api/showtimes/id/:showtimeId` - Get one populated showtime
- `POST /api/showtimes` - Add new showtime (admin; currently unprotected)

All POST routes for movies, theaters, and showtimes are currently unprotected. Authentication is not implemented; do not expose these routes publicly.

**Health Check:**
- `GET /api/health` - Server status

---

## 🔧 Project Structure

```
Cineva/
├── backend/
│   ├── models/
│   │   ├── Movie.js
│   │   ├── Theater.js
│   │   └── Showtime.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   └── Navigation.css
│   │   ├── pages/
│   │   │   ├── MovieList.js
│   │   │   ├── MovieList.css
│   │   │   ├── MovieDetail.js
│   │   │   ├── MovieDetail.css
│   │   │   ├── ShowtimeSelection.js
│   │   │   └── ShowtimeSelection.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── SETUP_GUIDE.md
```

---

## 🎨 Customization

### Change Color Scheme
Edit the gradient colors in CSS files:
- Primary: `#667eea` to any hex color
- Secondary: `#764ba2` to any hex color

### Update App Title
Edit `frontend/public/index.html`:
```html
<title>Your App Name Here</title>
```

### Change Backend Port
Edit `backend/.env`:
```env
PORT=8000  # Change from 5000
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
// Use MongoDB installer or run: mongod
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure backend server is running on http://localhost:5000

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change port in `.env` or kill the process using that port

### Module Not Found
```
Cannot find module 'express'
```
**Solution:** Run `npm install` in the respective directory

---

## 📊 Next Steps (Advanced Features)

1. **Seat Selection & Booking**
   - Add seat visualization
   - Implement seat selection logic
   - Store bookings in database

2. **User Authentication**
   - User signup/login
   - JWT tokens
   - User booking history

3. **Payment Integration**
   - Razorpay or Stripe integration
   - Payment processing
   - Invoice generation

4. **Admin Dashboard**
   - Add/edit movies and theaters
   - View bookings
   - Generate reports

5. **Notifications**
   - Email confirmations
   - SMS notifications
   - Booking reminders

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure both backend and frontend servers are running
4. Check browser console for error messages

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🎉 You're All Set!

Your Cineva application is ready to use. Start exploring, customizing, and building amazing features!

Happy Coding! 🚀
