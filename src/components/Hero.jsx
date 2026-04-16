import React from 'react';
import airpodImg from '../assets/image/image.png';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-left">
          <h1 className="hero-title">SOFTY AIRPOD</h1>
          <div className="hero-description">
            <p>Experience the ultimate comfort with Softy AirPod. Designed with precision, these earbuds offer a seamless fit and unparalleled sound quality.</p>
            <p>With innovative materials that feel like a soft touch, you'll forget you're even wearing them. The future of sound is here, and it's soft.</p>
          </div>
          <button className="hero-cta">Discover More</button>
        </div>
        <div className="hero-right">
          <div className="hero-image-wrapper">
            <img src={airpodImg} alt="Softy AirPod" className="hero-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
