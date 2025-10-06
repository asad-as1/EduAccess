import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookie from "cookies-js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import Side from "../../components/Side/Side.jsx";
import "./Login.css";

export const login = async (data, navigate, setApiError, from) => {
  try {

    const res = await axios.post(`${import.meta.env.VITE_URL}/user/login`, data);
    // console.log("Redirecting to:", from); // Debugging

    if (res?.status === 200) {
      Cookie.set("user", res.data.token, { secure: true });

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You are now logged in!",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate(from, { replace: true });
      });
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Login failed. Please try again.";
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: errorMessage,
    });
    setApiError(errorMessage);
  }
};


function Login({ user }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  
  const navigate = useNavigate();
  const token = Cookie.get("user");
  
  useEffect(() => {
    if (token) {
      navigate("/"); 
    }
  }, [token, navigate]);

  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (user) {
      reset({ username: user.username || "" });
    }
  }, [user, reset]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (formData) => {
    const from = location.state?.from?.pathname || "/"; // Get the previous route
    await login(formData, navigate, setApiError, from);
  };

  return (
    <div className="login-container">
      <Side />

      <div className="form-container">
        <div className="form-box">
          <div className="form-header">
            <h2>Login to your account</h2>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="form">
            <div className="form-group">
              <label>Username:</label>
              <input
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="error">{errors.username.message}</p>
              )}
            </div>

            <div className="form-group">
              <label>Password:</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                      message:
                        "Must contain uppercase, number, and special character",
                    },
                  })}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="toggle-password"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
            </div>
            <div className="form-header">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="link">
                  Sign Up 
                </Link>
              </p>
            </div>

            {apiError && <p className="error">{apiError}</p>}

            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
