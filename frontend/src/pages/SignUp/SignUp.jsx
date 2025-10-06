import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../Login/Login.jsx";
import { upload } from "../../firebase.js";
import axios from "axios";
import Cookie from "cookies-js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import Side from "../../components/Side/Side.jsx";
import "./SignUp.css"

function Signup({ user }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      bio: "",
    },
  });

  const token = Cookie.get("user");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (token) {
      navigate("/"); 
    }
  }, [token, navigate]);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        _id: user._id || "",
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user, reset]);

  const handleRegister = async (data) => {
    try {
      if (data.profilePicture && data.profilePicture.length > 0) {
        const file = data.profilePicture[0];
        const url = await upload(file);
        data.profilePicture = url;
      } else {
        data.profilePicture = user?.profilePicture || "";
      }

      let res;
      if (user) {
        res = await axios.put(`${import.meta.env.VITE_URL}/user/profile`, data);
        if (res?.status === 201) {
          await Swal.fire({
            icon: "success",
            title: "Profile Updated Successfully",
            confirmButtonText: "OK",
          }).then(() => {
            reset();
            navigate("/");
          });
        }
      } else {
        res = await axios.post(`${import.meta.env.VITE_URL}/user/register`, data);
        console.log(res)
        if (res?.status === 201) {
          await Swal.fire({
            icon: "success",
            title: "Successfully Registered",
            confirmButtonText: "OK",
          }).then(() => {
            login(data, navigate, () => {}, "/");
          });
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="signup-container">
        < Side />

      <div className="form-container">
        <div className="form-box">
          {!user && (
            <div className="form-header">
              <h2>Sign up to create an account</h2>
              
            </div>
          )}

          {user && (
            <div className="form-header">
              <h2>Edit Your Profile</h2>
            </div>
          )}

          <form onSubmit={handleSubmit(handleRegister)} className="form">
            {!user && (
              <div className="form-group">
                <label>Username:</label>
                <input
                  placeholder="Username"
                  {...register("username", { required: true })}
                />
              </div>
            )}
            <div className="form-group">
              <label>Full Name:</label>
              <input
                placeholder="Enter your full name"
                {...register("name", { required: true })}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPattern: (value) =>
                      /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/.test(value) ||
                      "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>
            {!user && (
              <div className="form-group">
                <label>Password:</label>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      validate: {
                        minLength: (value) =>
                          value.length >= 8 ||
                          "Password must be at least 8 characters",
                        hasUpperCase: (value) =>
                          /[A-Z]/.test(value) ||
                          "Must contain at least one uppercase letter",
                        hasSpecialChar: (value) =>
                          /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                          "Must contain at least one special character",
                        hasDigit: (value) =>
                          /\d/.test(value) || "Must contain at least one digit",
                      },
                    })}
                  />
                  <span onClick={togglePasswordVisibility} className="toggle-password">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && (
                  <p className="error">{errors.password.message}</p>
                )}
              </div>
            )}
            <div className="form-group">
              <label>Bio:</label>
              <input
                placeholder="Enter your bio"
                {...register("bio")}
              />
            </div>
            {user && user.profilePicture && (
              <div className="profile-picture">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="profile-img"
                />
                <p>Current Profile Picture</p>
              </div>
            )}
            <div className="form-group">
              <label>Profile Picture:</label>
              <input type="file" {...register("profilePicture")} />
            </div>
            <div className="form-header">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="link">
                  Sign In
                </Link>
              </p>
            </div>
            <button type="submit" className="submit-btn">
              {user ? "Save Changes" : "Create Account"}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;