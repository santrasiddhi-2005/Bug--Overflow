import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import "./About.css";

const About = ({ slideIn, handleSlideIn }) => {
  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} handleSlideIn={handleSlideIn} />
      <div className="home-container-2 about-page">
        <h1 className="about-title">About BugOverflow</h1>
        <p className="about-subtitle">
          BugOverflow is a community platform where developers ask questions,
          share answers, write articles, and learn together.
        </p>

        <section className="about-section">
          <h2>How BugOverflow Works</h2>
          <ul>
            <li>Ask clear technical questions and add relevant tags.</li>
            <li>Get answers from the community and vote on helpful content.</li>
            <li>Bookmark useful questions and articles for quick access later.</li>
            <li>Write and publish articles to share deeper knowledge.</li>
            <li>Build your profile through contributions and engagement.</li>
          </ul>
        </section>

        <section className="about-section gratitude-card">
          <h2>Special Thanks</h2>
          <p>
            Thank you to <strong>Siddhi Santra</strong> (<strong>Drone Aishu</strong>)
            for creating such a beautiful platform and helping developers connect,
            solve problems, and grow together.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
