const mongoose = require('mongoose');
require('dotenv').config();

const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Showtime = require('./models/Showtime');

const mongoURL = process.env.MONGO_URI || 'mongodb://localhost:27017/bookmyshow';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Clear existing data
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await Showtime.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create Movies
    const movies = await Movie.insertMany([
      {
        title: 'Oppenheimer',
        genre: ['Drama', 'History'],
        duration: 180,
        language: ['English', 'Hindi'],
        releaseDate: new Date('2023-09-21'),
        posterUrl: 'https://via.placeholder.com/300x450?text=Oppenheimer',
        description: 'A biographical film about J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        rating: 8.5,
      },
      {
        title: 'Barbie',
        genre: ['Comedy', 'Fantasy'],
        duration: 114,
        language: ['English', 'Hindi'],
        releaseDate: new Date('2023-07-21'),
        posterUrl: 'https://via.placeholder.com/300x450?text=Barbie',
        description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.',
        rating: 7.2,
      },
      {
        title: 'Jawan',
        genre: ['Action', 'Thriller'],
        duration: 169,
        language: ['Hindi', 'Tamil', 'Telugu'],
        releaseDate: new Date('2023-09-07'),
        posterUrl: 'https://via.placeholder.com/300x450?text=Jawan',
        description: 'An ex-soldier leads a special forces team on a dangerous mission to stop a sinister terrorist plot.',
        rating: 7.0,
      },
      {
        title: 'Pathaan',
        genre: ['Action', 'Spy'],
        duration: 146,
        language: ['Hindi', 'Tamil', 'Telugu'],
        releaseDate: new Date('2023-01-25'),
        posterUrl: 'https://via.placeholder.com/300x450?text=Pathaan',
        description: 'An Indian spy goes on a daring mission across the globe to stop a deadly terrorist attack.',
        rating: 7.1,
      },
      {
        title: 'Killers of the Flower Moon',
        genre: ['Crime', 'Drama'],
        duration: 206,
        language: ['English', 'Hindi'],
        releaseDate: new Date('2023-10-20'),
        posterUrl: 'https://via.placeholder.com/300x450?text=Killers',
        description: 'An investigation into the serial murders of wealthy Osage Native Americans in 1920s Oklahoma.',
        rating: 8.1,
      },
    ]);
    console.log('🎬 Added 5 movies');

    // Create Theaters
    const theaters = await Theater.insertMany([
      {
        name: 'PVR Cinemas',
        city: 'Mumbai',
        address: '123 Marine Drive, Mumbai',
        screens: 8,
        facilities: ['AC', 'Parking', 'Food Court', 'Wheelchair Access'],
      },
      {
        name: 'INOX Cinemas',
        city: 'Delhi',
        address: '456 Connaught Place, Delhi',
        screens: 6,
        facilities: ['AC', 'Parking', 'Recliner Seats'],
      },
      {
        name: 'Cinemax',
        city: 'Mumbai',
        address: '789 Phoenix Mall, Mumbai',
        screens: 5,
        facilities: ['AC', 'Parking', '4DX'],
      },
      {
        name: 'Carnival Cinemas',
        city: 'Ahmedabad',
        address: '321 Vastrapur, Ahmedabad',
        screens: 4,
        facilities: ['AC', 'Parking'],
      },
    ]);
    console.log('🏢 Added 4 theaters');

    // Create Showtimes
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const showtimes = await Showtime.insertMany([
      // Today's shows
      {
        movieId: movies[0]._id,
        theaterId: theaters[0]._id,
        date: today,
        time: '10:00',
        priceStandard: 250,
        premiumPrice: 350,
        totalSeats: 150,
        bookedSeats: [],
      },
      {
        movieId: movies[0]._id,
        theaterId: theaters[0]._id,
        date: today,
        time: '13:30',
        priceStandard: 250,
        premiumPrice: 350,
        totalSeats: 150,
        bookedSeats: ['A1', 'A2', 'A3'],
      },
      {
        movieId: movies[0]._id,
        theaterId: theaters[1]._id,
        date: today,
        time: '16:00',
        priceStandard: 280,
        premiumPrice: 380,
        totalSeats: 120,
        bookedSeats: [],
      },
      {
        movieId: movies[1]._id,
        theaterId: theaters[0]._id,
        date: today,
        time: '09:00',
        priceStandard: 200,
        premiumPrice: 300,
        totalSeats: 150,
        bookedSeats: [],
      },
      {
        movieId: movies[1]._id,
        theaterId: theaters[2]._id,
        date: today,
        time: '14:00',
        priceStandard: 250,
        premiumPrice: 350,
        totalSeats: 100,
        bookedSeats: [],
      },
      {
        movieId: movies[2]._id,
        theaterId: theaters[1]._id,
        date: today,
        time: '19:00',
        priceStandard: 300,
        premiumPrice: 400,
        totalSeats: 120,
        bookedSeats: [],
      },

      // Tomorrow's shows
      {
        movieId: movies[0]._id,
        theaterId: theaters[0]._id,
        date: tomorrow,
        time: '10:00',
        priceStandard: 250,
        premiumPrice: 350,
        totalSeats: 150,
        bookedSeats: [],
      },
      {
        movieId: movies[1]._id,
        theaterId: theaters[1]._id,
        date: tomorrow,
        time: '15:00',
        priceStandard: 280,
        premiumPrice: 380,
        totalSeats: 120,
        bookedSeats: [],
      },
      {
        movieId: movies[2]._id,
        theaterId: theaters[2]._id,
        date: tomorrow,
        time: '18:00',
        priceStandard: 250,
        premiumPrice: 350,
        totalSeats: 100,
        bookedSeats: [],
      },
      {
        movieId: movies[3]._id,
        theaterId: theaters[3]._id,
        date: tomorrow,
        time: '20:00',
        priceStandard: 200,
        premiumPrice: 300,
        totalSeats: 80,
        bookedSeats: [],
      },
    ]);
    console.log('🎪 Added 10 showtimes');

    console.log('\n✨ Database seeded successfully!');
    console.log(`📊 Total: ${movies.length} movies, ${theaters.length} theaters, ${showtimes.length} showtimes`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
