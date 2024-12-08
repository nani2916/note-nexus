import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../components/Nav";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

const ViewNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 4;
  const navigate = useNavigate();

  const MAX_CONTENT_LENGTH = 20;

  useEffect(() => {
    let isMounted = true;

    const fetchNotes = async () => {
      try {
        const uname = localStorage.getItem("username");
        const response = await axios.get(`${BASE_URL}/api/user/view-notes`, {
          params: { username: uname },
        });

        if (isMounted) {
          setNotes(response.data.notes || []);
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 1500,
          });
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Failed to fetch notes.", {
            position: "top-right",
            autoClose: 1500,
          });
        }
        console.error("Error fetching notes:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = (noteId) => navigate(`/edit-note/${noteId}`);
  const handleDelete = async (noteId) => navigate(`/delete-note/${noteId}`);
  const handleView = (noteId) => navigate(`/view-note/${noteId}`);

  const lastNoteIndex = currentPage * notesPerPage;
  const firstNoteIndex = lastNoteIndex - notesPerPage;
  const currentNotes = notes.slice(firstNoteIndex, lastNoteIndex);
  const totalPages = Math.ceil(notes.length / notesPerPage);

  const changePage = (newPage) => setCurrentPage(newPage);

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 3;
    const half = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => changePage(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="ellipsis">
            ...
          </span>
        );
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <button
          key={page}
          onClick={() => changePage(page)}
          className={`pagination-btn ${
            page === currentPage ? "active-page" : ""
          }`}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="ellipsis">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => changePage(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div>
      <Nav />
      <div className="bg1">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <h2 className="title">All Notes</h2>

          {loading ? (
            <p>Loading notes...</p>
          ) : (
            <>
              <table className="paybill w-full">
                <thead>
                  <tr>
                    <th className="w-full text-black">Author</th>
                    <th className="w-full text-black">Title</th>
                    <th className="w-full text-black">Content</th>
                    <th className="w-full text-black">Last Edited By</th>
                    <th className="w-full text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentNotes.length > 0 ? (
                    currentNotes.map((note) => (
                      <tr key={note._id}>
                        <td className="w-full">{note.owner}</td>
                        <td className="w-full">{note.title}</td>
                        <td className="w-full">
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                note.content.length > MAX_CONTENT_LENGTH
                                  ? `${note.content.slice(
                                      0,
                                      MAX_CONTENT_LENGTH
                                    )}...`
                                  : note.content,
                            }}
                          />
                          {note.content.length > MAX_CONTENT_LENGTH && (
                            <button
                              onClick={() => handleView(note._id)}
                              className="text-blue-500 ml-2"
                            >
                              Read More
                            </button>
                          )}
                        </td>
                        <td className="w-full">{note.lastEditedBy}</td>
                        <td className="w-full">
                          <button
                            onClick={() => handleView(note._id)}
                            className="mr-4 text-blue-500"
                          >
                            <i
                              className="fa fa-eye text-3xl"
                              aria-hidden="true"
                            ></i>
                          </button>
                          <button
                            onClick={() => handleEdit(note._id)}
                            className="mr-4"
                          >
                            <i
                              className="fa fa-pencil text-3xl"
                              aria-hidden="true"
                            ></i>
                          </button>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="text-red-500"
                          >
                            <i
                              className="fa fa-trash text-3xl"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: "center", padding: "10px" }}
                      >
                        No notes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-end my-4 items-center space-x-1">
                {currentPage > 1 && (
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                )}
                {renderPagination()}
                {currentPage < totalPages && (
                  <button
                    onClick={() => changePage(currentPage + 1)}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewNotes;
