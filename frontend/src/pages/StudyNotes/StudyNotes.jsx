import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { upload } from "../../firebase.js";
import { getStorage, ref, deleteObject } from "firebase/storage";
import Cookie from "cookies-js";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Share2,
  X,
  Upload,
  FileText,
  Trash2,
  User,
  ExternalLink,
} from "lucide-react";
import "./StudyNotes.css";

const StudyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const token = Cookie.get("user");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserProfile();
        await fetchNotes();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/user/profile`,
        { token }
      );
      setUserProfile(response.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/notes/getAllNotes`,
        { token }
      );
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAddNote = async () => {
    if (!title || !description || !file) {
      Swal.fire(
        "Incomplete Data",
        "Please fill in all fields and upload a file.",
        "error"
      );
      return;
    }

    try {
      const fileUrl = await upload(file, (progress) =>
        setUploadProgress(progress)
      );

      const newNote = { title, description, file: fileUrl };
      await axios.post(`${import.meta.env.VITE_URL}/notes/studynotes`, {
        newNote,
        token,
      });

      fetchNotes();
      setTitle("");
      setDescription("");
      setFile(null);
      setUploadProgress(null);
      setShowModal(false);
      Swal.fire("Success", "Your note has been added successfully.", "success");
    } catch (error) {
      console.error("Error adding note:", error);
      Swal.fire("Error", "Failed to add note. Please try again.", "error");
    }
  };

  const handleDeleteNote = async (noteId, fileUrl) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${import.meta.env.VITE_URL}/notes/deleteNote`, {
            noteId,
            token,
          });

          const storage = getStorage();
          const filePath = decodeURIComponent(
            fileUrl.split("/").pop().split("?")[0]
          );
          const storageRef = ref(storage, filePath);
          await deleteObject(storageRef);

          setNotes(notes.filter((note) => note._id !== noteId));
          Swal.fire(
            "Deleted!",
            "Your note and file have been deleted.",
            "success"
          );
        } catch (error) {
          console.error("Error deleting note:", error);
          Swal.fire(
            "Error",
            "Failed to delete note. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const extension = selectedFile.name.split(".").pop().toLowerCase();
      if (["mp3", "mp4", "mkv"].includes(extension)) {
        Swal.fire(
          "Invalid File Type",
          "Audio and video files are not allowed.",
          "error"
        );
        e.target.value = "";
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="study-notes-container">
      <h1 className="page-title">Study Notes Sharing</h1>

      <div className="search-section">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={() => setShowModal(true)} className="add-note-btn">
          <Plus size={20} />
          <span>Share Notes</span>
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">
                <Share2 size={24} />
                <h2>Share Your Note</h2>
              </div>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
              />
              <textarea
                placeholder="Description *
Description should be of 20 words."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea-field"
              />
              <div className="file-upload">
                <label htmlFor="file-input" className="file-label">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    id="file-input"
                    className="file-input"
                    style={{ display: "none" }} // Hide the default input
                  />
                  <Upload size={20} />
                  {file ? file.name : "Choose File"}
                </label>
              </div>

              {uploadProgress !== null && (
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}

              <button onClick={handleAddNote} className="submit-btn">
                <FileText size={20} />
                Submit Note
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="notes-grid">
        {filteredNotes.map((note) => (
          <div key={note._id} className="note-card">
            <div className="note-content">
              <div className="sameme">
                <div className="">
              <FileText className="note-card-icon" />
              </div>
              <h3 className="note-title">{note.title}</h3>
              </div>
              <p className="note-description">{note.description}</p>
              <p className="note-author">
                <User size={16} />
                <span>By {note?.author?.username || "Unknown"}</span>
              </p>
            </div>
            <div className="note-actions">
              {note.file && (
                <Link
                  to={note.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-btn"
                >
                  <ExternalLink size={18} />
                  View
                </Link>
              )}
              {(note.author?._id === userProfile?._id ||
                userProfile?.role === "admin") && (
                <button
                  onClick={() => handleDeleteNote(note._id, note.file)}
                  className="delete-btn"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyNotes;
