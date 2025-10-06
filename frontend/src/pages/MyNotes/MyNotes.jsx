import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { AiOutlinePlus } from 'react-icons/ai';
import axios from 'axios';
import { upload } from '../../firebase.js';
import Cookies from 'cookies-js';
import NoteCard from '../../components/NoteCard/NoteCard.jsx';
import Swal from 'sweetalert2';  // Import SweetAlert2
import './MyNotes.css';

const NotesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [user, setUser] = useState();
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState([]);

  const token = Cookies.get('user');
  const BACKEND_URL = import.meta.env.VITE_URL;
  // console.log(token)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/user/profile`, {
          token,
        });
        // console.log(response.data.user)
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
    };

    if (token) {
      checkAuth();
    } else {
      setUser(null);
    }
  }, [token]);

  const fetchNotes = async () => {
    // console.log(user?.role)
    if(user?.role !== 'admin') {
      try {
        const response = await axios.post(`${import.meta.env.VITE_URL}/mynotes/getAllNotes`, { token });
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    }
    else {
      try {
        const response = await axios.post(`${import.meta.env.VITE_URL}/mynotes/getAllUsersNotes`, { token });
        setNotes(response.data);
        // console.log(notes)
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    }
  };

  useEffect(() => {
    if(user) {
      fetchNotes();
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !["audio/mpeg", "video/mp4"].includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid file type',
        text: 'Please select a valid file (no MP3 or MP4).',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      Swal.fire({
        icon: 'warning',
        title: 'Title is required',
        text: 'Please provide a title for the note.',
      });
      return;
    }

    if (!textContent && !file) {
      Swal.fire({
        icon: 'warning',
        title: 'Content or file required',
        text: 'Please provide either text content or a file.',
      });
      return;
    }

    let fileUrl;

    if(file) fileUrl = await upload(file);

    const noteData = {
      title,
      shortNote: textContent,
      fileUrl
    };

    try {
      await axios.post(`${import.meta.env.VITE_URL}/mynotes/note`, { token, noteData });
      Swal.fire({
        icon: 'success',
        title: 'Note saved successfully!',
        text: 'Your note has been saved.',
      });
      setShowForm(false);
      setTitle('');
      setTextContent('');
      setFile(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to save note',
        text: 'There was an error saving your note. Please try again.',
      });
    }
  };

  return (
    <div className='div-top'>
      <div className="notes-page-container">
      <div className="add-note-button-container">
        <Button variant="contained" onClick={() => setShowForm(true)} startIcon={<AiOutlinePlus />}>
          Add Note
        </Button>
      </div>

      {showForm && (
        <div className="note-form-container">
          <form onSubmit={handleSubmit} className="note-form">
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Enter your text (optional)"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              multiline
              rows={6}
              fullWidth
              margin="normal"
            />
            <TextField
              type="file"
              inputProps={{ accept: '.pdf,.txt,.docx' }}
              onChange={handleFileChange}
              fullWidth
              margin="normal"
            />
            <div className="note-form-actions">
              <Button variant="outlined" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save Note
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="notes-list-container">
        {notes.map((note, index) => (
          <NoteCard key={index} title={note.title} id={note._id} shortNote={note.shortNote} author={note?.author} role={user?.role} />
        ))}
      </div>
    </div>
    </div>
    
  );
};

export default NotesPage;
