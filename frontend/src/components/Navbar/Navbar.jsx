import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookie from "cookies-js";
import axios from "axios";
import Swal from "sweetalert2";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  const user = Cookie.get("user");
  const BACKEND_URL = import.meta.env.VITE_URL;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const closeMenu = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeMenu);
    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/user/profile`, {
          token: user,
        });
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    if (user) {
      checkAuth();
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookie.expire("user");
        setIsAuthenticated(false);
        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">EduAccess</Link>
      <div ref={menuRef} className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/takeatest">Take A Test</Link>
        <Link to="/summarization">Summarization</Link>
        <Link to="/textreader">Text Reader</Link>
        <Link to="/schedule">Schedule</Link>
        <Link to="/studynotes">Study Notes</Link>
        <Link to="/mynotes">MyNotes</Link>
        <Link to="/myactivity">My Activities</Link>
        <Link to="/queandans">Ques & Ans</Link>
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">SignUp</Link>
          </>
        )}
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
