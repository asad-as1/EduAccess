import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "cookies-js";
import Swal from "sweetalert2";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import "./Event.css";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Edit, Delete, Add, Save } from "@mui/icons-material";

const EventTimeline = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [open, setOpen] = useState(false);

  const token = Cookies.get("user");

  const fetchEvents = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/events/fetchAll`,
        { token }
      );
      setEvents(response?.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const isCompleted = (endTime) => new Date(endTime) < new Date();

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.post(`${import.meta.env.VITE_URL}/events/delete/${id}`, { token });
        setEvents(events.filter((event) => event._id !== id));
        Swal.fire("Deleted!", "The event has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting event:", error);
        Swal.fire("Error!", "Failed to delete event.", "error");
      }
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      Swal.fire("Warning!", "Please fill in all required fields!", "warning");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_URL}/events/newEvent`, {
        ...newEvent,
        token,
      });
      await fetchEvents();
      setNewEvent({ title: "", startTime: "", endTime: "", description: "" });
      Swal.fire("Success!", "Event added successfully!", "success");
    } catch (error) {
      console.error("Error adding event:", error);
      Swal.fire("Error!", "Failed to add event. Please try again.", "error");
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent || !editingEvent.title.trim() || !editingEvent.description.trim()) {
      Swal.fire("Warning!", "Title or Description cannot be empty!", "warning");
      return;
    }

    const updatedFields = {};
    if (editingEvent.title !== selectedEvent?.title) updatedFields.title = editingEvent.title;
    if (editingEvent.description !== selectedEvent?.description) updatedFields.description = editingEvent.description;
    if (editingEvent.startTime !== selectedEvent?.startTime) updatedFields.startTime = editingEvent.startTime;
    if (editingEvent.endTime !== selectedEvent?.endTime) updatedFields.endTime = editingEvent.endTime;

    if (Object.keys(updatedFields).length === 0) {
      Swal.fire("Info!", "No changes detected!", "info");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_URL}/events/${editingEvent._id}`, {
        ...updatedFields,
        token,
      });

      await fetchEvents();
      setOpen(false);
      Swal.fire("Success!", "Event updated successfully!", "success");
    } catch (error) {
      console.error("Error updating event:", error);
      Swal.fire("Error!", "Failed to update event. Please try again.", "error");
    }
  };

  return (
    <div className="timeline-container">
      <h2 className="timeline-title">📅 Event Timeline</h2>
  
      <div className="add-event-form">
        <TextField
          label="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          fullWidth
          required
          margin="dense"
        />
        <TextField
          label="Start Time"
          type="date"
          value={newEvent.startTime}
          onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
          fullWidth
          required
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Time"
          type="date"
          value={newEvent.endTime}
          onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
          fullWidth
          required
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          fullWidth
          multiline
          rows={2}
          margin="dense"
          required
        />
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={handleAddEvent}
          fullWidth
        >
          Add Event
        </Button>
      </div>
  
      <VerticalTimeline>
        {events?.map((event) => (
          <VerticalTimelineElement
            key={event._id}
            date={`${new Date(event.startTime).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
            })} - ${new Date(event.endTime).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
            })}`}
            iconStyle={{
              background: isCompleted(event.endTime) ? 'green' : 'blue',
              color: '#fff',
            }}
            className="timeline-element"
          >
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            <p className={`status ${isCompleted(event.endTime) ? 'completed' : 'in-progress'}`}>
              {isCompleted(event.endTime) ? '✅ Completed' : '⏳ In Progress'}
            </p>
            <div className="button-group">
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Edit />}
                onClick={() => handleEditEvent(event)}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={() => handleDelete(event._id)}
              >
                Delete
              </Button>
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
  
      {/* Update Event Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Update Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={editingEvent?.title || ''}
            onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Start Time"
            type="date"
            value={editingEvent?.startTime || ''}
            onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Time"
            type="date"
            value={editingEvent?.endTime || ''}
            onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            value={editingEvent?.description || ''}
            onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateEvent} color="primary" startIcon={<Save />}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  
};

export default EventTimeline;
