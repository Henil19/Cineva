import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const steps = [
  { number: '01', title: 'Discover', description: 'Browse a focused collection of films and find a story that catches your eye.' },
  { number: '02', title: 'Explore', description: 'Get the details that matter: genres, languages, ratings, and a short synopsis.' },
  { number: '03', title: 'Find a show', description: 'Compare nearby theaters and screening times before you make your plans.' },
];

const technologies = [
  { name: 'React 18', role: 'Web experience', mark: 'R' },
  { name: 'Node.js + Express', role: 'Application API', mark: 'N' },
  { name: 'MongoDB', role: 'Movie & showtime data', mark: 'M' },
  { name: 'Mongoose', role: 'Data modeling', mark: 'D' },
];

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="container about-hero-inner">
          <div className="about-hero-copy">
            <span className="about-eyebrow"><span className="brand-mark" aria-hidden="true"><span /></span> A little about us</span>
            <h1>More than a movie night. <em>A feeling.</em></h1>
            <p>Cineva brings the fun of finding your next film together with the ease of finding where and when to watch it.</p>
            <Link className="button-primary about-hero-cta" to="/">Explore movies <span aria-hidden="true">→</span></Link>
          </div>
          <div className="about-reel-art" aria-hidden="true">
            <div className="reel-glow" />
            <div className="reel-frame reel-frame-back"><span /></div>
            <div className="reel-frame reel-frame-front"><span className="reel-play" /></div>
            <span className="reel-caption">LIGHTS DOWN. STORY UP.</span>
          </div>
        </div>
      </section>

      <section className="about-how page-section" aria-labelledby="about-how-title">
        <div className="container">
          <div className="section-heading about-section-heading">
            <div><span className="section-kicker">Simple by design</span><h2 id="about-how-title">From discovery to showtime</h2></div>
            <p>Everything you need to plan the movie. All that’s left is to enjoy it.</p>
          </div>
          <div className="about-steps">
            {steps.map((step) => (
              <article className="about-step" key={step.number}>
                <span className="about-step-number">{step.number}</span>
                <span className="about-step-rule" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-tech-section page-section" aria-labelledby="about-tech-title">
        <div className="container about-tech-layout">
          <div className="about-tech-intro">
            <span className="section-kicker">Thoughtfully built</span>
            <h2 id="about-tech-title">The craft behind Cineva</h2>
            <p>Cineva is a full-stack project made to bring movie discovery and showtime information into one clear, welcoming experience.</p>
            <div className="about-purpose"><span aria-hidden="true">✳</span><p><strong>Our purpose</strong><br />Make it easier to find a film and turn “what should we watch?” into a plan.</p></div>
          </div>
          <div className="tech-grid">
            {technologies.map((technology) => (
              <article className="tech-card" key={technology.name}>
                <span className="tech-mark" aria-hidden="true">{technology.mark}</span>
                <div><h3>{technology.name}</h3><p>{technology.role}</p></div>
              </article>
            ))}
            <div className="tech-note"><span className="tech-note-dot" /> Built as a modern JavaScript application</div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
