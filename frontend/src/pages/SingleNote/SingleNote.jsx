import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "cookies-js";
import Swal from "sweetalert2";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { upload } from "../../firebase.js";
import "./SingleNote.css";
import NotFound from "../Not Found/NotFound.jsx";

const SingleNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState({ title: "", shortNote: "", fileUrl: "" });
  const [newFile, setNewFile] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const navigate = useNavigate();
  const token = Cookies.get("user");
  const storage = getStorage();
  const [errorMessage, setErrorMessage] = useState(""); // New error message state

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URL}/mynotes/${id}`,
          { token }
        );
        setNote(response.data);
      } catch (error) {
        // console.error("Error fetching the note:", error);
        // Swal.fire("Error", "Failed to load the note.", "error");
        setErrorMessage(error); 

      }
    };
    fetchNote();
  }, [id, token, errorMessage]);

  const deleteFileFromFirebase = async (fileUrl) => {
    if (!fileUrl) return;
    const filePath = decodeURIComponent(fileUrl.split("/").pop().split("?")[0]);
    const storageRef = ref(storage, filePath);
    try {
      await deleteObject(storageRef);
      console.log("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this note!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (note.fileUrl) {
            await deleteFileFromFirebase(note.fileUrl);
          }
          await axios.post(
            `${import.meta.env.VITE_URL}/mynotes/deleteNote/${id}`,
            { token }
          );
          Swal.fire("Deleted!", "Your note has been deleted.", "success");
          navigate("/mynotes");
        } catch (error) {
          console.error("Error deleting the note:", error);
          Swal.fire("Error", "Failed to delete the note.", "error");
        }
      }
    });
  };

  const handleUpdate = async () => {
    let fileUrl = note.fileUrl;

    if (newFile) {
      if (note.fileUrl) {
        await deleteFileFromFirebase(note.fileUrl);
      }
      fileUrl = await upload(newFile);
    }

    const updatedNoteData = {
      title: note.title,
      shortNote: note.shortNote,
      fileUrl,
    };

    try {
      await axios.put(`${import.meta.env.VITE_URL}/mynotes/${id}`, {
        token,
        updatedNoteData,
      });
      Swal.fire("Updated!", "Your note has been updated.", "success");
      navigate("/mynotes");
    } catch (error) {
      console.error("Error updating the note:", error);
      Swal.fire("Error", "Failed to update the note.", "error");
    }
  };

  return (
    errorMessage ? (
      <NotFound message={errorMessage} />
    ) : (
      <div className="single-note-containers">
        {note ? (
          <>
            <Typography variant="h5" className="notes-titles">
              <p>Title: {note.title}</p>
            </Typography>
            {note.fileUrl && (
              <iframe
                src={note.fileUrl}
                title="Note File"
                className="note-iframe"
                frameBorder="0"
              />
            )}
            {note.shortNote && note.fileUrl ? (
              <p>Short Note: {note.shortNote}</p>
            ) : (
              <div className="note-text-contents">
                <p>{note.shortNote}</p>
              </div>
            )}
  
            <div className="note-actions">
              <Button
                className="del-bt"
                variant="outlined"
                color="primary"
                onClick={() => setShowUpdateForm(!showUpdateForm)}
              >
                {showUpdateForm ? "Cancel Update" : "Update Note"}
              </Button>
              <Button
                className="del-bt"
                variant="contained"
                color="secondary"
                onClick={handleDelete}
              >
                Delete Note
              </Button>
            </div>
  
            {showUpdateForm && (
              <Card className="note-card">
                <CardContent>
                  <Typography variant="h6">Edit Note</Typography>
  
                  <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    value={note.title}
                    onChange={(e) => setNote({ ...note, title: e.target.value })}
                  />
  
                  <TextField
                    label="Short Note"
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                    value={note.shortNote}
                    onChange={(e) =>
                      setNote({ ...note, shortNote: e.target.value })
                    }
                  />
  
                  <input
                    type="file"
                    onChange={(e) => setNewFile(e.target.files[0])}
                    accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
                    style={{ marginBottom: "1rem", display: "block" }}
                  />
  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                  >
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <p>Loading note...</p>
        )}
      </div>
    )
  );
  
};

export default SingleNote;