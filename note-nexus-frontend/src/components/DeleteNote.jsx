import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../components/Nav";
import { BASE_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import sureImage from "../assets/sure.png";

const DeleteNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = localStorage.getItem("username");

  const handleCancel = () => {
    navigate("/view-notes");
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/user/delete-note/${id}`,
        { params: { username: user } }
      );

      toast.success(response.data.message, {
        position: "top-right",
          autoClose: 1500
        });
      setTimeout(() => {
        toast.success("Redirecting to View Notes...", {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/view-notes");
        }, 1000);
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("You are not authorized to delete this note.", {
          position: "top-right",
        });
      } else {
        toast.error("Failed to delete note.", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <div>
      <Nav />
      <div className="signup">
        <div className="container" style={{ width: "800px" }}>
          <div style={{ marginBottom: "20px" }}>
            <div
              className="flexcenter"
              style={{
                textAlign: "center",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <img
                src={sureImage}
                alt="Delete Emoji"
                style={{
                  height: "70px",
                  width: "80px",
                  borderRadius: "100%",
                }}
              />
              <p className="title1" style={{ fontSize: "30px" }}>
                Delete Note
              </p>
            </div>
          </div>
          <div className="flexcenter">
            <p style={{ fontSize: "20px", fontWeight: "600" }}>
              Are you sure you want to delete the Note?
            </p>
          </div>
          <div className="flexcenter">
            <div
              className="nodelete-button"
              style={{ width: "100%", padding: "20px" }}
            >
              <button
                style={{ cursor: "pointer", backgroundColor: "green" }}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            <div
              className="delete-button"
              style={{ width: "100%", padding: "20px" }}
            >
              <button
                style={{ cursor: "pointer", backgroundColor: "red" }}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteNote;
