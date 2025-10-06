import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>This website is for people who love to study. It will help you improve yourself, grow, and develop your skills.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/takeatest">Take A Test</Link></li>
            <li><Link to="/studynotes">Study Notes</Link></li>
            <li><Link to="/summarization">Summarization</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li>Email: info@eduAccessapp.com</li>
            <li>Phone: (555) 123-4567</li>
            <li>Address: 123 App Street</li>
            <li>City, State 12345</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-links">
            <Link to='/' className="social-link">Facebook</Link>
            <Link to='/' className="social-link">Twitter</Link>
            <Link to='/' className="social-link">LinkedIn</Link>
            <Link to='/' className="social-link">Instagram</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p> 
          <b>Made by: Mohd Asad Ansari</b>
          <div>&copy; {currentYear} EduAccess. All rights reserved.</div>
        </p>
      </div>
    </footer>
  );
};

export default Footer;