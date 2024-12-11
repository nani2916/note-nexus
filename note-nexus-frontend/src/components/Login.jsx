import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainNav from "./MainNav";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config";

const Login = () => {
  const [formData, setFormData] = useState({
    uname: "",
    password: "",
    cpassword: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    error: "",
    message: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkPasswordMatch = () => {
    const { password, cpassword } = formData;
    const msgElement = document.getElementById("message");

    if (password && cpassword) {
      if (password === cpassword) {
        msgElement.textContent = "Password matches.";
        msgElement.classList.add("match");
        msgElement.classList.remove("nomatch");
      } else {
        msgElement.textContent = "Passwords do not match.";
        msgElement.classList.add("nomatch");
        msgElement.classList.remove("match");
      }
    } else {
      msgElement.textContent = "";
    }
  };

  useEffect(() => {
    checkPasswordMatch();
  }, [formData.password, formData.cpassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.uname || !formData.password || !formData.cpassword) {
      toast.error("Fill all details properly", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 1500,
      });
      setTimeout(() => {
        
      }, 1000);
      if (response.status === 200) {
        const { name, username } = response.data;

        localStorage.setItem("name", name);
        localStorage.setItem("username", username);

        toast.success("Redirecting to Home...", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response
        ? err.response.data.Error
        : "Something went wrong. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

  return (
    <div>
      <div className="hero">
        <MainNav />
      </div>
      <div className="signup">
        <div className="container">
          <div className="title">Login to NoteNexus</div>
          <form id="my_login_form" onSubmit={handleSubmit}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Username</span>
                <input
                  type="text"
                  id="uname"
                  placeholder="Enter your Username"
                  name="uname"
                  value={formData.uname}
                  onChange={handleChange}
                  required
                  onInvalid={(e) =>
                    e.target.setCustomValidity("Please Enter Username")
                  }
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>

              <div className="input-box">
                <span className="details">Password</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  placeholder="Enter your Password"
                  required
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must contain at least one number, one uppercase and lowercase letter, and at least 8 characters"
                  onChange={handleChange}
                />
              </div>

              <div className="input-box">
                <span className="details">Confirm Password</span>
                <input
                  type="password"
                  id="cpassword"
                  name="cpassword"
                  value={formData.cpassword}
                  placeholder="Confirm your Password"
                  required
                  onChange={handleChange}
                />
                <span className="message" id="message"></span>
              </div>
            </div>

            <div className="sbutton">
              <button type="submit" id="aButton" style={{ cursor: "pointer" }}>
                Login
              </button>
              <span className="lmessage1" id="llogin_message">
                {errorMessages.error}
              </span>
            </div>
            <div className="asignup">
              Don't have an account?{" "}
              <a href="/register" className="bsignup">
                <u>Register</u>
              </a>{" "}
              here
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
