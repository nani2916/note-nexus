import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { BASE_URL } from "../config";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    lastEditedBy: "", 
  });

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/note/${id}`);
        setFormData({
          title: response.data.note.title,
          content: response.data.note.content,
          lastEditedBy: response.data.note.lastEditedBy || "Unknown", 
        });
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Failed to load the note.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/user/edit-note`,
        {
          ...formData,
          id: id,
          lastEditedBy: localStorage.getItem("name"), 
        }
      );
      toast.success(response.data.message);
      setTimeout(() => {
        toast.success("Redirecting to View Notes...");
        setTimeout(() => {
          navigate("/view-notes");
        }, 1000);
      }, 2000);
    } catch (error) {
      toast.error("Failed to save note.");
      console.error("Error saving note:", error);
    }
  };

  return (
    <div>
      <Nav />
      <div className="bg1">
        <div className="container">
          <h2 className="title">Edit Note</h2>
          {loading ? (
            <p>Loading note...</p>
          ) : (
            <form>
              <div className="input-box1 w-full mb-4">
                <label className="text-[#CCBA78] pb-2 block mb-2 font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border"
                />
              </div>
              <div className="input-box1 w-full pb-4">
                <label className="text-[#CCBA78] block mb-2 font-semibold">Content</label>
                <ReactQuill
                  value={formData.content}
                  modules={modules}
                  onChange={handleContentChange}
                  className="h-48 mb-14"
                />
              </div>
              <div className="text-[#CCBA78] mb-4">
                <span className="font-semibold">Last Edited By:</span> <span className="text-white">{formData.lastEditedBy}</span>
              </div>
              <div className="flexcenter">
                <div className="button w-full pr-5">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="aButton"
                  >
                    Save Note
                  </button>
                </div>
                <div className="button w-full pl-5">
                  <button
                    type="button"
                    onClick={() => navigate("/view-notes")}
                    className="aButton"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditNote;
