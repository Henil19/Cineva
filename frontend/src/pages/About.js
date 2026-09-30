import React from 'react';
import './About.css';

function About() {
  return (
    <main className="about-page container">
      <section className="about-card">
        <h1>About Cineva</h1>
        <p>Cineva is a movie discovery and showtime browsing application. Explore films, learn about each movie, and find screenings at nearby theaters.</p>
        <h2>Built with</h2>
        <ul>
          <li>React 18 and React Router for the web interface</li>
          <li>Node.js and Express for the REST API</li>
          <li>MongoDB and Mongoose for movie, theater, and showtime data</li>
          <li>Axios for API requests and date-fns for calendar dates</li>
        </ul>
      </section>
    </main>
  );
}

export default About;
