import React from "react";
import { FaRocket, FaLock, FaUsers, FaChartLine } from "react-icons/fa";
import "./Side.css";

const Side = () => {
  return (
    <div className="side-container">
      <div className="side-content">
        <h1 className="side-title">Empower Your Learning Journey</h1>
        <p className="side-description">
          Explore new skills, gain knowledge, and achieve your goals
          effortlessly.
        </p>
        <div className="side-features">
          <div className="feature-item">
            <FaRocket className="feature-icon yellow" />
            <div>
              <h3 className="feature-title">Boost Your Potential</h3>
              <p className="feature-description">
                Access high-quality courses and learning materials to stay
                ahead.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <FaUsers className="feature-icon red" />
            <div>
              <h3 className="feature-title">Engage with Community</h3>
              <p className="feature-description">
                Interact with experts, mentors, and fellow learners worldwide.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <FaChartLine className="feature-icon pink" />
            <div>
              <h3 className="feature-title">Monitor Your Success</h3>
              <p className="feature-description">
                Track your learning progress with insights and performance
                analytics.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <FaLock className="feature-icon green" />
            <div>
              <h3 className="feature-title">Enhanced Security</h3>
              <p className="feature-description">
                Enjoy a safe and secure platform designed to protect your data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Side;
