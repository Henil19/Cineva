# 🎬 Cineva

A movie discovery and showtime booking demo built with **React**, **Node.js**, **Express**, and **MongoDB**. Users can register, sign in, reserve seats, and view their bookings. Payments are not implemented.

![Cineva movie discovery app](https://via.placeholder.com/1200x400?text=Cineva)

---

## ✨ Features

### 🎯 Core Features
- 🎬 **Movie Listings** - Browse all available movies
- 🔍 **Search Functionality** - Search movies by title
- 📺 **Movie Details** - View comprehensive movie information
- 🏢 **Theater Selection** - Choose theaters and showtimes
- 📅 **Date Selection** - Browse showtimes for different dates
- 💺 **Interactive Seat Selection** - Select up to eight available seats from a 150-seat cinema layout
- 🎟️ **Demo Bookings** - Persist seat reservations and show a human-readable booking reference
- 📱 **Responsive Design** - Works perfectly on mobile and desktop

### 🎨 UI/UX Features
- Beautiful gradient background with purple theme
- Smooth animations and transitions
- Interactive cards with hover effects
- Organized grid layouts
- Mobile-first responsive design
- Easy-to-use search and filters

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                         │
│              (http://localhost:3000)                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  MovieList  → MovieDetail  → ShowtimeSelection          │
│                                                           │
└──────────────────────┬──────────────────────────────────┘
                       │ (Axios HTTP)
                       ↓
┌─────────────────────────────────────────────────────────┐
│                 Node.js Express API                       │
│              (http://localhost:5000)                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  /api/movies  /api/theaters  /api/showtimes             │
│                                                           │
└──────────────────────┬──────────────────────────────────┘
                       │ (Mongoose)
                       ↓
┌─────────────────────────────────────────────────────────┐
│                   MongoDB Database                        │
│         (collections: movies, theaters, showtimes)       │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MongoDB** running ([Download](https://www.mongodb.com/))

### Installation

**1. Backend Setup:**
```bash
cd backend
npm install
npm start
```

**2. Seed Database (Optional):**
```bash
node seed.js
```

**3. Frontend Setup (New Terminal):**
```bash
cd frontend
npm install
npm start
```

**4. Open Browser:**
```
http://localhost:3000
```

---

## 📂 Project Structure

```
Cineva/
├── backend/
│   ├── models/
│   │   ├── Movie.js          # Movie schema
│   │   ├── Theater.js        # Theater schema
│   │   └── Showtime.js       # Showtime schema
│   ├── server.js             # Express server & routes
│   ├── seed.js               # Sample data script
│   ├── package.json
│   ├── .env.example
│   └── node_modules/
│
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   └── Navigation.css
│   │   ├── pages/
│   │   │   ├── MovieList.js
│   │   │   ├── MovieDetail.js
│   │   │   ├── ShowtimeSelection.js
│   │   │   └── *.css         # Page styles
│   │   ├── services/
│   │   │   └── api.js        # Axios API calls
│   │   ├── App.js            # Main component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── node_modules/
│
├── README.md                 # This file
├── QUICK_START.md           # 5-minute setup guide
├── SETUP_GUIDE.md           # Detailed documentation
└── LICENSE
```

---

## 🔗 API Endpoints

### Movies
```
GET  /api/movies              # Get all movies
GET  /api/movies/:id          # Get single movie
POST /api/movies              # Add new movie
```

### Theaters
```
GET  /api/theaters            # Get all theaters
POST /api/theaters            # Add new theater
```

### Showtimes
```
GET  /api/showtimes?movieId=X&date=Y  # date is YYYY-MM-DD, matched as a UTC day range
GET  /api/showtimes/:movieId/:date    # Get showtimes for movie on calendar day
GET  /api/showtimes/id/:showtimeId    # Get one populated showtime
POST /api/showtimes                    # Add new showtime
```

### Bookings
```
POST /api/bookings                     # [Bearer token] Atomically reserve seats and create a demo booking
GET  /api/bookings/my                  # [Bearer token] List the current user's bookings
GET  /api/bookings/:bookingReference   # [Bearer token] Retrieve an owned booking
```

### Authentication
```
POST /api/auth/register                # Create account and return a JWT
POST /api/auth/login                   # Sign in and return a JWT
GET  /api/auth/me                      # [Bearer token] Return the current user
```

Create a booking with only the showtime ID and selected seat IDs; the server calculates prices from the showtime document:
```json
{ "showtimeId": "<showtime ObjectId>", "seatNumbers": ["A4", "I7"] }
```
Seat IDs cover rows A–J, 15 seats per row. Rows A–H use `priceStandard`; rows I–J use `premiumPrice`. A booking may contain up to eight unique seats. A stale seat selection returns `409 Conflict`; malformed requests return `400`. The server reserves seats atomically before writing a booking and releases them if booking persistence fails.

New bookings require authentication and are associated with the account that created them. Booking history and reference lookup only return records owned by that account. Older demo bookings without a user owner remain in the database but are not visible through these account-scoped APIs. Bookings are local demo records only; payment and cancellation are not implemented.

Movie, theater, and showtime creation POST routes remain unprotected. No admin authentication is implemented; do not expose these endpoints publicly.

Include `JWT_SECRET` in the backend environment, using a long random secret. The demo frontend stores its JWT in `localStorage`; production session handling should consider HttpOnly, Secure, SameSite cookies.

### Health
```
GET  /api/health              # Check server status
```

---

## 💾 Database Schema

### Movie Model
```javascript
{
  _id: ObjectId,
  title: String,
  genre: [String],
  duration: Number,        // in minutes
  language: [String],
  releaseDate: Date,
  posterUrl: String,       // URL to poster image
  description: String,
  rating: Number,
  createdAt: Date
}
```

### Theater Model
```javascript
{
  _id: ObjectId,
  name: String,
  city: String,
  address: String,
  screens: Number,
  facilities: [String],
  createdAt: Date
}
```

### Showtime Model
```javascript
{
  _id: ObjectId,
  movieId: ObjectId,       // Reference to Movie
  theaterId: ObjectId,     // Reference to Theater
  date: Date,
  time: String,            // HH:MM format
  priceStandard: Number,
  premiumPrice: Number,
  totalSeats: Number,
  bookedSeats: [String],   // Array of seat numbers
  createdAt: Date
}
```

### Booking Model
```javascript
{
  bookingReference: String, // Unique CV-<year>-<random hex> reference
  userId: ObjectId,          // Reference to User; optional for legacy demo records
  showtimeId: ObjectId,
  movieId: ObjectId,
  theaterId: ObjectId,
  seatNumbers: [String],
  seatBreakdown: [{ category, seatNumbers, unitPrice, subtotal }],
  amount: Number,
  status: String,          // confirmed (demo booking)
  createdAt: Date
}
```

### User Model
```javascript
{
  name: String,
  email: String,             // Unique, lowercase, trimmed
  passwordHash: String,      // bcrypt hash; never returned by the API
  createdAt: Date
}
```

---

## 🎨 UI Components

### Pages
- **MovieList** - Grid of all available movies with search
- **MovieDetail** - Full movie information and booking button
- **ShowtimeSelection** - Date selector and showtime cards by theater
- **SeatSelection** - Interactive 150-seat layout and live booking summary
- **BookingConfirmation** - Persisted booking details by booking reference
- **Login / Register** - Account sign in and creation
- **MyBookings / BookingDetail** - Owner-scoped booking history and details

### Components
- **Navigation** - Header with logo and links

### Features
- Search bar with real-time filtering
- Date picker for 7 days ahead
- Theater grouping and filtering
- Seat availability indicators
- Responsive grid layouts

---

## 🔧 Configuration

### Backend Environment
Create `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/bookmyshow
PORT=5000
NODE_ENV=development
```

### Frontend Configuration (Optional)
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎨 Styling

### Color Scheme
- **Primary Purple:** `#667eea`
- **Secondary Dark Purple:** `#764ba2`
- **Accent Gold:** `#ffd700`
- **Backgrounds:** White, Light gradients

### Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

---

## 📦 Dependencies

### Backend
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Cross-origin support
- **dotenv** - Environment variables
- **bcryptjs** - Password hashing for account registration and login
- **jsonwebtoken** - JWT creation and verification for authenticated API requests

### Frontend
- **react** - UI library
- **react-router-dom** - Client routing
- **axios** - HTTP client
- **date-fns** - Date manipulation

---

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Create account on hosting platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Connect GitHub to Vercel/Netlify
3. Deploy

---

## 🔐 Security Considerations

Currently this is a demo application. For production:
- ✅ User authentication (JWT) and bcryptjs password hashing are implemented for the demo
- ✅ Validate all inputs on backend
- ✅ Use HTTPS only
- ✅ Implement rate limiting
- ✅ Authentication middleware protects account and booking endpoints; movie/theater/showtime admin POST routes are still unprotected
- ✅ Encrypt sensitive data

---

## 🔄 Future Enhancements

- [x] **User Authentication** - Sign up and login
- [x] **Seat Selection** - Visual seat map with selection
- [x] **Booking History** - View own bookings and details
- [ ] **Payment Integration** - Razorpay/Stripe
- [ ] **Admin Dashboard** - Manage movies, theaters, showtimes
- [ ] **Reviews & Ratings** - User movie ratings
- [ ] **Email Notifications** - Booking confirmations
- [ ] **Mobile App** - React Native
- [ ] **API Documentation** - Swagger/OpenAPI
- [ ] **Testing** - Unit & integration tests

---

## 🐛 Known Issues & Limitations

- Bookings are local demo records; payment and cancellation are not implemented
- Poster images use TMDb image URLs (plus one local Pathaan poster asset) and fall back to a local Cineva graphic if an image cannot load
- No payment processing (UI only)
- The demo stores JWTs in browser `localStorage`; production should consider HttpOnly, Secure, SameSite cookies
- No email notifications
- Movie, theater, and showtime creation endpoints remain unprotected; do not expose them publicly.

---

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup & configuration
- **API Documentation** - See API Endpoints section above

---

## 🤝 Contributing

Contributions are welcome! 

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💻 Author

Built as a demo full-stack application showcasing React, Node.js, and MongoDB.

---

## 🎓 Learning Resources

This project demonstrates:
- ✅ React hooks and state management
- ✅ React Router for navigation
- ✅ Component-based architecture
- ✅ REST API design with Express
- ✅ MongoDB database design
- ✅ Axios for HTTP requests
- ✅ CSS Grid and Flexbox
- ✅ Responsive web design

---

## 💬 Support

For questions or issues:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting
2. Review error messages in browser console
3. Verify MongoDB and Node.js are running
4. Ensure both servers (frontend & backend) are started

---

## 📊 Project Stats

- **Frontend:** React 18, 500+ lines of JSX
- **Backend:** Node.js/Express, 200+ lines of JavaScript
- **Database:** MongoDB with 3 collections
- **Styling:** 700+ lines of custom CSS
- **Components:** 5 main pages + 1 shared component

---

## 🎯 Next Steps

1. **Run the app** - Follow QUICK_START.md
2. **Explore the code** - Understand the structure
3. **Customize** - Add your own colors and content
4. **Add features** - Implement seat selection or payments
5. **Deploy** - Put it online for the world to see

---

**Happy Coding! 🚀**

Build something amazing! 🎬🍿
