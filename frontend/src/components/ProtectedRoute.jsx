import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookie from 'cookies-js';
import axios from 'axios';

const ProtectedRoute = ({ element: Component, userId }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const user = Cookie.get('user'); 
  const BACKEND_URL = import.meta.env.VITE_URL;
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/user/profile`, { token: user });
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

  if (isAuthenticated === null) {
    return <div style={{ textAlign: 'center', margin: '16px', fontSize: '1.25rem' }}>Loading...</div>;
  }

  return isAuthenticated ?  React.cloneElement(Component, { userId }) : <Navigate to="/login" state={{ from: location }} />;

};

export default ProtectedRoute;